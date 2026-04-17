"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Button from "@/components/ui/Button";
import DataTable, { TableColumn } from "@/components/ui/DataTable";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import { buildPositionRecordsWithGuest, getGuestUpdatedEventName, readGuestSalaryHistory } from "@/lib/guest-data";
import { mockPositionRecords } from "@/lib/mock-data";
import { PositionRecord, SalaryHistoryEntry } from "@/lib/types";
import { slugify, toCurrency } from "@/lib/utils";

const columns: TableColumn<PositionRecord>[] = [
  { key: "positionName", header: "Pozisyon" },
  { key: "company", header: "Şirket" },
  { key: "location", header: "Şehir" },
  { key: "level", header: "Seviye" },
  {
    key: "averageSalary",
    header: "Ortalama Maaş",
    render: (row) => toCurrency(row.averageSalary),
  },
  {
    key: "averageBenefits",
    header: "Ortalama Yan Hak",
    render: (row) => toCurrency(row.averageBenefits),
  },
  {
    key: "action",
    header: "",
    render: (row) => (
      <Link href={`/positions/${slugify(row.positionName)}`}>
        <Button type="button" variant="ghost" className="px-3 py-1.5 text-xs">
          Detayı Gör
        </Button>
      </Link>
    ),
    className: "text-right",
  },
];

export default function PositionSearchPage() {
  const [guestEntries, setGuestEntries] = useState<SalaryHistoryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    const load = () => setGuestEntries(readGuestSalaryHistory());
    load();

    const eventName = getGuestUpdatedEventName();
    window.addEventListener(eventName, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(eventName, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const allRecords = useMemo(() => {
    const useGuestOnly = guestEntries.length > 0;
    return buildPositionRecordsWithGuest(useGuestOnly ? [] : mockPositionRecords, guestEntries);
  }, [guestEntries]);

  const locationOptions = useMemo(() => {
    const values = Array.from(new Set(allRecords.map((item) => item.location)));
    return [{ value: "all", label: "Tüm Şehirler" }, ...values.map((item) => ({ value: item, label: item }))];
  }, [allRecords]);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const rows = allRecords.filter((item) => {
      const byPosition = normalized.length === 0 || item.positionName.toLowerCase().includes(normalized);
      const byLocation = locationFilter === "all" || item.location === locationFilter;
      return byPosition && byLocation;
    });

    return rows.sort((a, b) =>
      sortDirection === "desc" ? b.averageSalary - a.averageSalary : a.averageSalary - b.averageSalary,
    );
  }, [allRecords, query, locationFilter, sortDirection]);

  return (
    <PageShell
      eyebrow="Sayfa 4"
      title="Pozisyona göre maaş arama"
      subtitle="Arama, filtre ve sıralama ile pozisyon bazlı verileri hızlı şekilde karşılaştır."
      navItems={[
        { href: "/salary-history", label: "Veri Girişi" },
        { href: "/positions/frontend-engineer", label: "Pozisyon Detay" },
      ]}
      actions={
        <Button
          variant="secondary"
          onClick={() => setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"))}
        >
          Maaşa Göre Sırala: {sortDirection === "desc" ? "Yüksekten Düşüğe" : "Düşükten Yükseğe"}
        </Button>
      }
    >
      <div className="search-controls mb-5 grid gap-3 md:grid-cols-3">
        <InputField
          label="Pozisyon Adı"
          placeholder="Pozisyon ara"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <SelectField
          label="Şehir Filtresi"
          value={locationFilter}
          onChange={(event) => setLocationFilter(event.target.value)}
          options={locationOptions}
        />
      </div>
      {filteredRows.length === 0 ? (
        <p className="rounded-xl border border-[rgba(30,27,22,0.1)] bg-white/60 p-4 text-sm text-[#6a645c]">
          Görüntülenecek pozisyon bulunamadı. Önce Veri Girişi sayfasından bir kayıt ekleyin.
        </p>
      ) : (
        <div className="table-wrap">
          <DataTable columns={columns} rows={filteredRows} rowKey={(row) => row.id} />
        </div>
      )}
    </PageShell>
  );
}

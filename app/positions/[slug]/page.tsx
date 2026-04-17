"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Button from "@/components/ui/Button";
import DataTable, { TableColumn } from "@/components/ui/DataTable";
import {
  buildPositionDetailsWithGuest,
  buildPositionRecordsWithGuest,
  getGuestUpdatedEventName,
  readGuestSalaryHistory,
} from "@/lib/guest-data";
import { mockPositionDetailsBySlug, mockPositionRecords } from "@/lib/mock-data";
import { PositionRecord, SalaryHistoryEntry } from "@/lib/types";
import { slugify, toCurrency } from "@/lib/utils";

type CompanyCompensation = {
  company: string;
  averageSalary: number;
  averageBenefits: number;
};

type TimelinePoint = {
  year: number;
  averageSalary: number;
};

type EnteredSalaryRow = {
  id: string;
  companyName: string;
  cityName: string;
  startDate: string;
  endDate: string;
  salary: number;
  benefits: string;
};

const toDisplayDate = (value: string): string => {
  if (!value) {
    return "-";
  }
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }
  return `${day}/${month}/${year}`;
};

const companyColumns: TableColumn<CompanyCompensation>[] = [
  { key: "company", header: "Şirket" },
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
];

export default function PositionDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [guestEntries, setGuestEntries] = useState<SalaryHistoryEntry[]>([]);

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

  const mergedRecords: PositionRecord[] = useMemo(
    () => buildPositionRecordsWithGuest(guestEntries.length > 0 ? [] : mockPositionRecords, guestEntries),
    [guestEntries],
  );

  const details = useMemo(
    () =>
      buildPositionDetailsWithGuest(
        slug,
        guestEntries.length > 0 ? {} : mockPositionDetailsBySlug,
        mergedRecords,
        guestEntries,
      ),
    [slug, mergedRecords, guestEntries],
  );

  const enteredSalaryRows = useMemo<EnteredSalaryRow[]>(
    () =>
      guestEntries
        .filter((entry) => slugify(entry.positionName) === slug)
        .map((entry) => ({
          id: entry.id,
          companyName: entry.companyName || "Belirtilmedi",
          cityName: entry.cityName || "Belirtilmedi",
          startDate: entry.startDate,
          endDate: entry.endDate,
          salary: entry.salary,
          benefits: entry.benefits,
        })),
    [guestEntries, slug],
  );

  if (!details) {
    return (
      <PageShell
        eyebrow="Sayfa 5"
        title="Pozisyon bulunamadı"
        subtitle="Bu pozisyon için henüz bir kayıt yok."
        navItems={[{ href: "/positions", label: "Aramaya dön" }]}
      >
        <div className="flex justify-end">
          <Link href="/positions">
            <Button variant="ghost">Aramaya Dön</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const timeline = details.timeline as TimelinePoint[];
  const maxSalary = Math.max(...timeline.map((item) => item.averageSalary), 1);
  const averageSalary = Math.round(
    details.companyCompensation.reduce((acc, item) => acc + item.averageSalary, 0) / details.companyCompensation.length,
  );
  const averageBenefits = Math.round(
    details.companyCompensation.reduce((acc, item) => acc + item.averageBenefits, 0) / details.companyCompensation.length,
  );

  return (
    <PageShell
      eyebrow="Sayfa 5"
      title="Seçilen pozisyon için yıllık maaş ortalaması"
      subtitle={details.positionName}
      navItems={[{ href: "/positions", label: "Aramaya dön" }]}
      actions={
        <Link href="/positions">
          <Button variant="ghost">Aramaya Dön</Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-5 md:grid-cols-3">
          <article className="feature-card">
            <p className="muted-label">Ortalama Maaş</p>
            <strong className="block text-3xl">{toCurrency(averageSalary)}</strong>
          </article>
          <article className="feature-card">
            <p className="muted-label">Ortalama Yan Hak</p>
            <strong className="block text-3xl">{toCurrency(averageBenefits)}</strong>
          </article>
          <article className="feature-card">
            <p className="muted-label">Kayıt Sayısı</p>
            <strong className="block text-3xl">{details.companyCompensation.length}</strong>
          </article>
        </section>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink">Şirket Karşılaştırma Tablosu</h2>
          <div className="table-wrap">
            <DataTable columns={companyColumns} rows={details.companyCompensation} rowKey={(row) => row.company} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink">Tarihsel Maaş Zaman Çizelgesi</h2>
          <ul className="space-y-3">
            {timeline.map((point) => {
              const width = Math.max(8, Math.round((point.averageSalary / maxSalary) * 100));
              return (
                <li key={point.year} className="grid items-center gap-2 sm:grid-cols-[80px_1fr_120px]">
                  <span className="text-sm text-muted">{point.year}</span>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-action" style={{ width: `${width}%` }} />
                  </div>
                  <span className="text-right text-sm font-medium text-ink">{toCurrency(point.averageSalary)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink">Girilen Maaş Kayıtları</h2>
          {enteredSalaryRows.length === 0 ? (
            <p className="text-sm text-[#6a645c]">Bu pozisyon için henüz kullanıcı maaş kaydı girilmedi.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Şirket</th>
                    <th>Şehir</th>
                    <th>Tarih Aralığı</th>
                    <th>Maaş</th>
                    <th>Yan Haklar</th>
                  </tr>
                </thead>
                <tbody>
                  {enteredSalaryRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.companyName}</td>
                      <td>{row.cityName}</td>
                      <td>{`${toDisplayDate(row.startDate)} - ${toDisplayDate(row.endDate)}`}</td>
                      <td>{toCurrency(row.salary)}</td>
                      <td>{row.benefits || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { readGuestSalaryHistory, writeGuestSalaryHistory } from "@/lib/guest-data";
import { SalaryHistoryEntry } from "@/lib/types";

const createEmptyRow = (): SalaryHistoryEntry => ({
  id: crypto.randomUUID(),
  startDate: "",
  endDate: "",
  companyName: "",
  cityName: "",
  positionName: "",
  salary: 0,
  benefits: "",
});

export default function SalaryHistoryPage() {
  const router = useRouter();
  const [rows, setRows] = useState<SalaryHistoryEntry[]>([createEmptyRow()]);
  const [saveError, setSaveError] = useState("");

  const requiredFieldMessage =
    "Bu veriyi girmediniz: Pozisyon, Şirket, Başlangıç Tarihi, Bitiş Tarihi ve Maaş alanları zorunludur.";

  useEffect(() => {
    const stored = readGuestSalaryHistory();
    if (stored.length > 0) {
      setRows(stored);
    }
  }, []);

  const updateRow = <K extends keyof SalaryHistoryEntry>(id: string, key: K, value: SalaryHistoryEntry[K]) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const nextRows = prev.length <= 1 ? [createEmptyRow()] : prev.filter((row) => row.id !== id);

      // Persist deletion immediately so removed rows do not reappear after refresh/navigation.
      const persistedRows = nextRows.filter(
        (row) =>
          row.positionName.trim().length > 0 ||
          row.companyName.trim().length > 0 ||
          row.cityName.trim().length > 0 ||
          row.salary > 0 ||
          row.benefits.trim().length > 0 ||
          row.startDate.trim().length > 0 ||
          row.endDate.trim().length > 0,
      );
      writeGuestSalaryHistory(persistedRows);

      return nextRows;
    });

    setSaveError("");
  };

  const saveGuestData = () => {
    const hasAnyInput = rows.some(
      (row) =>
        row.positionName.trim().length > 0 ||
        row.companyName.trim().length > 0 ||
        row.cityName.trim().length > 0 ||
        row.salary > 0 ||
        row.benefits.trim().length > 0 ||
        row.startDate.trim().length > 0 ||
        row.endDate.trim().length > 0,
    );

    if (!hasAnyInput) {
      setSaveError(requiredFieldMessage);
      return;
    }

    const hasInvalidRequiredData = rows.some(
      (row) =>
        (row.positionName.trim().length > 0 ||
          row.companyName.trim().length > 0 ||
          row.cityName.trim().length > 0 ||
          row.salary > 0 ||
          row.benefits.trim().length > 0 ||
          row.startDate.trim().length > 0 ||
          row.endDate.trim().length > 0) &&
        (row.positionName.trim().length === 0 ||
          row.companyName.trim().length === 0 ||
          row.startDate.trim().length === 0 ||
          row.endDate.trim().length === 0 ||
          row.salary <= 0),
    );

    if (hasInvalidRequiredData) {
      setSaveError(requiredFieldMessage);
      return;
    }

    const validRows = rows
      .filter(
        (row) =>
          row.positionName.trim().length > 0 &&
          row.companyName.trim().length > 0 &&
          row.startDate.trim().length > 0 &&
          row.endDate.trim().length > 0 &&
          row.salary > 0,
      )
      .map((row) => ({
        ...row,
        cityName: row.cityName.trim().length > 0 ? row.cityName : "Belirtilmedi",
      }));

    setSaveError("");
    writeGuestSalaryHistory(validRows);
    router.push("/positions");
  };

  return (
    <PageShell
      eyebrow="Sayfa 3"
      title="Daha önce çalıştığınız pozisyon ve maaşlar"
      subtitle="Misafir olarak girdiğiniz kayıtlar ortalamalara dahil edilir ve pozisyon aramada görünür."
      navItems={[
        { href: "/profile", label: "Profil" },
        { href: "/positions", label: "Pozisyon Ara" },
      ]}
      actions={<Button onClick={addRow}>Yeni kayıt ekle</Button>}
    >
      <div className="space-y-4">
        {saveError ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</p> : null}
        <div className="table-wrap">
          <table>
            <colgroup>
              <col style={{ width: "320px" }} />
              <col style={{ width: "190px" }} />
              <col style={{ width: "170px" }} />
              <col style={{ width: "190px" }} />
              <col style={{ width: "160px" }} />
              <col style={{ width: "190px" }} />
              <col style={{ width: "120px" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Tarih Aralığı (Başlangıç - Bitiş)</th>
                <th>Şirket Adı</th>
                <th>Şehir</th>
                <th>Pozisyon Adı</th>
                <th>Maaş</th>
                <th>Yan Haklar</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="align-top">
                  <td>
                    <div className="grid gap-2 md:grid-cols-2">
                      <InputField
                        label="Başlangıç"
                        type="date"
                        lang="en-GB"
                        value={row.startDate}
                        onChange={(event) => updateRow(row.id, "startDate", event.target.value)}
                        className="date-visible"
                      />
                      <InputField
                        label="Bitiş"
                        type="date"
                        lang="en-GB"
                        value={row.endDate}
                        onChange={(event) => updateRow(row.id, "endDate", event.target.value)}
                        className="date-visible"
                      />
                    </div>
                  </td>
                  <td>
                    <InputField
                      label="Şirket"
                      value={row.companyName}
                      onChange={(event) => updateRow(row.id, "companyName", event.target.value)}
                    />
                  </td>
                  <td>
                    <InputField
                      label="Şehir (İsteğe Bağlı)"
                      value={row.cityName}
                      onChange={(event) => updateRow(row.id, "cityName", event.target.value)}
                    />
                  </td>
                  <td>
                    <InputField
                      label="Pozisyon"
                      value={row.positionName}
                      onChange={(event) => updateRow(row.id, "positionName", event.target.value)}
                    />
                  </td>
                  <td>
                    <InputField
                      label="Maaş"
                      type="number"
                      min={0}
                      value={row.salary}
                      onChange={(event) => updateRow(row.id, "salary", Number(event.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <InputField
                      label="Yan Haklar"
                      value={row.benefits}
                      onChange={(event) => updateRow(row.id, "benefits", event.target.value)}
                    />
                  </td>
                  <td>
                    <Button type="button" variant="ghost" onClick={() => removeRow(row.id)}>
                      Sil
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={saveGuestData}>
            Kaydet ve Devam Et
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

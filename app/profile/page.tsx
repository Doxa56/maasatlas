"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";
import TagInput from "@/components/ui/TagInput";
import { mockProfile } from "@/lib/mock-data";
import { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const [form, setForm] = useState<UserProfile>(mockProfile);

  const updateField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PageShell
      eyebrow="Sayfa 2"
      title="Kullanıcı ayarları"
      subtitle="Profil bilgileri maaş dağılımını daha anlamlı karşılaştırmak için kullanılır."
      navItems={[
        { href: "/salary-history", label: "Geçmiş" },
        { href: "/positions", label: "Arama" },
      ]}
    >
      <form className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Cinsiyet"
          value={form.gender}
          onChange={(event) => updateField("gender", event.target.value)}
          placeholder="Opsiyonel"
        />
        <SelectField
          label="Yaş"
          value={form.ageGroup}
          onChange={(event) => updateField("ageGroup", event.target.value as UserProfile["ageGroup"])}
          options={[
            { value: "18-", label: "18-" },
            { value: "18-35", label: "18-35" },
            { value: "35+", label: "35+" },
          ]}
        />
        <InputField
          label="Meslek"
          value={form.profession}
          onChange={(event) => updateField("profession", event.target.value)}
        />
        <InputField
          label="Deneyim"
          type="number"
          min={0}
          value={form.yearsOfExperience}
          onChange={(event) => updateField("yearsOfExperience", Number(event.target.value) || 0)}
        />
        <TagInput label="Beceriler" tags={form.skills} onChange={(tags) => updateField("skills", tags)} />
        <InputField
          label="Askerlik Durumu"
          value={form.militaryServiceStatus}
          onChange={(event) => updateField("militaryServiceStatus", event.target.value)}
        />
        <InputField
          label="Medeni Hal"
          value={form.maritalStatus}
          onChange={(event) => updateField("maritalStatus", event.target.value)}
        />
        <InputField
          label="Çocuk Sayısı"
          type="number"
          min={0}
          value={form.numberOfChildren}
          onChange={(event) => updateField("numberOfChildren", Number(event.target.value) || 0)}
        />
        <div className="md:col-span-2">
          <InputField
            label="Çalıştığınız Şehirler"
            value={form.citiesWorkedIn}
            onChange={(event) => updateField("citiesWorkedIn", event.target.value)}
            placeholder="İstanbul, Ankara, İzmir..."
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Link href="/salary-history">
            <Button type="button">Kaydet ve Devam Et</Button>
          </Link>
        </div>
      </form>
    </PageShell>
  );
}

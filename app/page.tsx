"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getGuestUpdatedEventName, readGuestSalaryHistory } from "@/lib/guest-data";
import { SalaryHistoryEntry } from "@/lib/types";
import { toCurrency } from "@/lib/utils";

const parseBenefitAmount = (value: string): number => {
  const match = value.match(/\d+[\d.,]*/);
  if (!match) {
    return 0;
  }
  const normalized = match[0].replace(/,/g, ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function LandingPage() {
  const [guestEntries, setGuestEntries] = useState<SalaryHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = () => {
      setIsLoading(true);
      setGuestEntries(readGuestSalaryHistory());
      setIsLoading(false);
    };

    load();

    const eventName = getGuestUpdatedEventName();
    window.addEventListener(eventName, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(eventName, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const summary = useMemo(() => {
    if (guestEntries.length === 0) {
      return {
        uniquePositions: 0,
        totalEntries: 0,
        averageBenefits: 0,
      };
    }

    const uniquePositions = new Set(guestEntries.map((entry) => entry.positionName.trim()).filter(Boolean)).size;
    const totalEntries = guestEntries.length;
    const averageBenefits = Math.round(
      guestEntries.reduce((acc, item) => acc + parseBenefitAmount(item.benefits), 0) / guestEntries.length,
    );

    return {
      uniquePositions,
      totalEntries,
      averageBenefits,
    };
  }, [guestEntries]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <main className="grid gap-8">
        <section className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Modern, sade ve bilgi odaklı</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#1e1b16] sm:text-5xl">
              Kariyer adımlarını veriye dayalı şekilde karşılaştır.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#6a645c]">
              Kullanıcı maaşları, yan haklar, şehirler ve deneyim bilgileri üzerinden pozisyon bazlı içgörü sunan
              minimalist bir platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/salary-history"
                className="inline-flex rounded-full bg-[#1e1b16] px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
              >
                Misafir Olarak Veri Gir
              </Link>
              <Link
                href="/positions"
                className="inline-flex rounded-full border border-[#1e1b16]/10 bg-white/75 px-5 py-3 text-sm font-medium text-[#1e1b16] transition hover:bg-white"
              >
                Pozisyonları İncele
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(35,27,14,0.08)] backdrop-blur-xl">
            <p className="muted-label">Bugünün Özeti</p>
            <div className="grid gap-4">
              <article className="rounded-2xl border border-[#1e1b16]/10 bg-white/75 p-4">
                <span className="text-[#6a645c]">Kayıtlı pozisyon</span>
                {isLoading ? (
                  <div className="mt-3 h-9 w-20 animate-pulse rounded-lg bg-[#1e1b16]/10" />
                ) : (
                  <strong className="mt-2 block text-3xl">{summary.uniquePositions}</strong>
                )}
              </article>
              <article className="rounded-2xl border border-[#1e1b16]/10 bg-white/75 p-4">
                <span className="text-[#6a645c]">Anonim veri girişi</span>
                {isLoading ? (
                  <div className="mt-3 h-9 w-20 animate-pulse rounded-lg bg-[#1e1b16]/10" />
                ) : (
                  <strong className="mt-2 block text-3xl">{summary.totalEntries}</strong>
                )}
              </article>
              <article className="rounded-2xl border border-[#1e1b16]/10 bg-white/75 p-4">
                <span className="text-[#6a645c]">Ortalama yan hak</span>
                {isLoading ? (
                  <div className="mt-3 h-9 w-32 animate-pulse rounded-lg bg-[#1e1b16]/10" />
                ) : (
                  <strong className="mt-2 block text-3xl">{toCurrency(summary.averageBenefits)}</strong>
                )}
              </article>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <article className="rounded-[24px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(35,27,14,0.08)] backdrop-blur-xl">
            <p className="muted-label">01</p>
            <h2 className="mb-2 text-xl font-semibold">Maaşlarını güvenle gir</h2>
            <p className="text-[#6a645c]">Tarih aralığı, pozisyon, maaş ve yan hak bilgilerini tablo yapısında kaydet.</p>
          </article>
          <article className="rounded-[24px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(35,27,14,0.08)] backdrop-blur-xl">
            <p className="muted-label">02</p>
            <h2 className="mb-2 text-xl font-semibold">Pozisyona göre ara</h2>
            <p className="text-[#6a645c]">Arama, filtre ve sıralama ile belirli rollerin piyasadaki dağılımını hızlı gör.</p>
          </article>
          <article className="rounded-[24px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(35,27,14,0.08)] backdrop-blur-xl">
            <p className="muted-label">03</p>
            <h2 className="mb-2 text-xl font-semibold">Yıllık ortalamayı incele</h2>
            <p className="text-[#6a645c]">Şirketlerin aynı pozisyon için sunduğu maaş ve yan hakları karşılaştır.</p>
          </article>
        </section>

        <section className="grid items-stretch gap-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow">5 sayfalık akıllı akış</p>
            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-[#1e1b16] sm:text-5xl">
              Kullanım senaryosu net, arayüz yorucu değil.
            </h2>
            <p className="mt-4 text-[#6a645c]">
              Bu proje; kayıt, profil, maaş geçmişi, arama ve pozisyon analiz akışlarını tek bir sade tema altında toplar.
            </p>
          </div>
          <div className="grid gap-3 rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(35,27,14,0.08)] backdrop-blur-xl">
            <Link className="rounded-2xl border border-[#1e1b16]/10 bg-white/75 px-4 py-3" href="/profile">
              1. Kullanıcı ayarları
            </Link>
            <Link
              className="rounded-2xl border border-[#1e1b16]/10 bg-white/75 px-4 py-3"
              href="/salary-history"
            >
              2. Maaş geçmişi
            </Link>
            <Link className="rounded-2xl border border-[#1e1b16]/10 bg-white/75 px-4 py-3" href="/positions">
              3. Pozisyon arama
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

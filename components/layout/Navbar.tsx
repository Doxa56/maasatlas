"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: "Anasayfa", href: "/" },
  { label: "Profil", href: "/profile" },
  { label: "Geçmiş Maaşlar", href: "/salary-history" },
  { label: "Pozisyon Ara", href: "/positions" },
];

const getIsActive = (pathname: string, href: string): boolean => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const mappedItems = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        ...item,
        active: getIsActive(pathname, item.href),
      })),
    [pathname],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-3 font-semibold tracking-tight text-[#1e1b16]">
          <span className="inline-grid h-10 w-10 place-items-center rounded-2xl bg-[#1e1b16] text-sm font-bold text-white">
            M
          </span>
          <span className="text-base sm:text-lg">MaaşAtlas</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Ana navigasyon">
          {mappedItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                item.active
                  ? "border border-[#1e1b16]/20 bg-[#1e1b16] text-white font-semibold"
                  : "border border-[#1e1b16]/10 bg-white/75 text-[#645e55] hover:bg-white"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1e1b16]/10 bg-white/80 md:hidden"
          aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 origin-center rounded-full bg-[#1e1b16] transition-transform duration-300 ${
                isOpen ? "translate-y-[7px] rotate-45" : "translate-y-0 rotate-0"
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-[#1e1b16] transition-opacity duration-200 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 origin-center rounded-full bg-[#1e1b16] transition-transform duration-300 ${
                isOpen ? "-translate-y-[7px] -rotate-45" : "translate-y-0 rotate-0"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-white/60 bg-white/80 backdrop-blur-xl transition-[max-height,opacity] duration-300 md:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:px-6" aria-label="Mobil navigasyon">
          {mappedItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 text-sm transition-colors ${
                item.active
                  ? "border border-[#1e1b16]/20 bg-[#1e1b16] text-white font-semibold"
                  : "border border-[#1e1b16]/10 bg-white/85 text-[#645e55]"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
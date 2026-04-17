import { ReactNode } from "react";

interface PageShellProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  navItems?: ReadonlyArray<{ label: string; href: string }>;
  compactNav?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}

export default function PageShell({
  title,
  subtitle,
  eyebrow,
  actions,
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      <main className="grid gap-6">
        <section>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="text-4xl font-bold tracking-tight text-[#1e1b16] sm:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-3 max-w-3xl text-[#6a645c]">{subtitle}</p> : null}
        </section>
        <section className="rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(35,27,14,0.08)] backdrop-blur-xl">
          {actions ? <div className="mb-4 flex flex-wrap justify-end gap-3">{actions}</div> : null}
          {children}
        </section>
      </main>
    </div>
  );
}

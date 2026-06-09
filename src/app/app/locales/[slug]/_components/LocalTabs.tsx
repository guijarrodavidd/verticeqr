"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { suffix: "carta", label: "Carta", icono: "🍽" },
  { suffix: "tpv",   label: "TPV Sala", icono: "▣" },
  { suffix: "demo",  label: "Demo visual", icono: "✨" },
  { suffix: "admin", label: "Admin", icono: "⚙" },
];

export default function LocalTabs({ slug }: { slug: string }) {
  const pathname = usePathname() ?? "";
  return (
    <nav className="vqr-local-tabs" aria-label="Secciones del local">
      {TABS.map((t) => {
        const href = `/app/locales/${slug}/${t.suffix}`;
        const active = pathname.startsWith(href);
        return (
          <Link
            key={t.suffix}
            href={href}
            className={`vqr-local-tab ${active ? "vqr-local-tab-active" : ""}`}
          >
            <span className="vqr-local-tab-icon" aria-hidden>{t.icono}</span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

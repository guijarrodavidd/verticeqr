"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { sectorInfo, type Local } from "@/lib/locales-shared";

export default function LocalesSidebar({ locales }: { locales: Local[] }) {
  const pathname = usePathname() ?? "";
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return locales;
    return locales.filter(
      (l) =>
        l.nombre.toLowerCase().includes(t) ||
        l.slug.toLowerCase().includes(t),
    );
  }, [locales, q]);

  const enLista = pathname === "/app/locales";

  return (
    <aside className="vqr-loc-rail">
      <Link
        href="/app/locales"
        className={`vqr-loc-rail-back ${enLista ? "active" : ""}`}
      >
        ← Todos los locales
      </Link>

      <input
        type="text"
        placeholder="Buscar local…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="vqr-loc-rail-search"
        autoComplete="off"
      />

      <nav className="vqr-loc-rail-list" aria-label="Locales">
        {filtered.length === 0 ? (
          <div className="vqr-loc-rail-empty">
            {q ? "Ningún local coincide." : "No hay locales todavía."}
          </div>
        ) : (
          filtered.map((l) => {
            const sec = sectorInfo(l.sector);
            const color = l.color_primario || sec.color;
            const isActive = pathname.startsWith(`/app/locales/${l.slug}`);
            const activo = l.activo === 1;
            return (
              <Link
                key={l.id}
                href={`/app/locales/${l.slug}`}
                className={`vqr-loc-rail-item ${isActive ? "active" : ""}`}
                style={isActive ? { borderLeft: `3px solid ${color}` } : undefined}
              >
                <span
                  className="vqr-loc-rail-avatar"
                  style={{ background: color }}
                >
                  {l.logo_url ? (
                    <img src={l.logo_url} alt="" />
                  ) : (
                    <span>{sec.icono}</span>
                  )}
                </span>
                <div className="vqr-loc-rail-info">
                  <div className="vqr-loc-rail-name">{l.nombre}</div>
                  <div className="vqr-loc-rail-sub">
                    <span className={`vqr-loc-rail-dot ${activo ? "on" : "off"}`} />
                    <span>{sec.label}</span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </nav>

      <Link href="/app/locales#nuevo" className="vqr-loc-rail-new">
        + Nuevo local
      </Link>
    </aside>
  );
}

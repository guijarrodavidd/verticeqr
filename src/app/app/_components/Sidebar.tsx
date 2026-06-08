"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SectionItem = {
  href: string;
  label: string;
  icono: string;
  acento: string;
};

const SECTIONS: SectionItem[] = [
  { href: "/app", label: "Inicio", icono: "◧", acento: "#a78bfa" },
  { href: "/app/locales", label: "Locales", icono: "▥", acento: "#60a5fa" },
  { href: "/app/leads", label: "Solicitudes", icono: "✉", acento: "#fbbf24" },
  { href: "/app/qr", label: "Generador QR", icono: "▦", acento: "#f472b6" },
  { href: "/app/tpv", label: "TPV Sala", icono: "▣", acento: "#34d399" },
  { href: "/app/todos", label: "Todo List", icono: "✓", acento: "#4ade80" },
];

export default function Sidebar({
  userNombre,
  userEmail,
  logoutAction,
}: {
  userNombre: string;
  userEmail: string;
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname() ?? "/app";
  const [movilAbierto, setMovilAbierto] = useState(false);

  const isActive = (href: string) =>
    href === "/app" ? pathname === "/app" : pathname.startsWith(href);

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={() => setMovilAbierto((v) => !v)}
        className="vqr-app-toggle"
      >
        <span>☰</span>
        <span style={{ fontSize: "0.92rem", fontWeight: 600 }}>Panel</span>
      </button>

      {movilAbierto && (
        <div
          className="vqr-app-overlay"
          onClick={() => setMovilAbierto(false)}
          aria-hidden
        />
      )}

      <aside className={`vqr-app-sidebar ${movilAbierto ? "vqr-app-sidebar-open" : ""}`}>
        <div className="vqr-app-brand">
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#f2f2f5",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
            onClick={() => setMovilAbierto(false)}
          >
            <span style={{ color: "#a78bfa" }}>▲</span> VerticeQR
          </Link>
          <div className="vqr-app-brand-sub">Panel interno</div>
        </div>

        <nav className="vqr-app-nav">
          <div className="vqr-app-section-title">Workspace</div>
          {SECTIONS.map((s) => {
            const active = isActive(s.href);
            return (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setMovilAbierto(false)}
                className={`vqr-app-nav-item ${active ? "vqr-app-nav-item-active" : ""}`}
                style={
                  active
                    ? {
                        borderLeft: `3px solid ${s.acento}`,
                        paddingLeft: "calc(0.85rem - 3px)",
                      }
                    : undefined
                }
              >
                <span
                  className="vqr-app-nav-icon"
                  style={{ color: s.acento }}
                >
                  {s.icono}
                </span>
                <span style={{ flex: 1 }}>{s.label}</span>
                {!active && <span style={{ color: "#4b5563", fontSize: "0.78rem" }}>→</span>}
              </Link>
            );
          })}
        </nav>

        <div className="vqr-app-userbox">
          <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: "0.3rem" }}>
            Sesión
          </div>
          <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{userNombre}</div>
          <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: "0.75rem", wordBreak: "break-all" }}>
            {userEmail}
          </div>
          <form action={logoutAction}>
            <button type="submit" className="vqr-app-logout">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

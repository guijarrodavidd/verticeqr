"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DEMOS, type TipoDemo } from "../_lib/demos";

export default function Sidebar() {
  const pathname = usePathname() ?? "/demos";
  const [movilAbierto, setMovilAbierto] = useState(false);

  const activo = (slug: string) => pathname === `/demos/${slug}`;
  const hubActivo = pathname === "/demos";

  return (
    <>
      {/* Toggle móvil */}
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={() => setMovilAbierto((v) => !v)}
        className="vqr-mobile-toggle"
      >
        <span>☰</span>
        <span style={{ fontSize: "0.92rem", fontWeight: 600 }}>Demos</span>
      </button>

      {/* Overlay móvil */}
      {movilAbierto && (
        <div
          className="vqr-overlay"
          onClick={() => setMovilAbierto(false)}
          aria-hidden
        />
      )}

      <aside
        className={`vqr-sidebar ${movilAbierto ? "vqr-sidebar-open" : ""}`}
      >
        {/* Logo + volver */}
        <div style={{ padding: "0 1.5rem 1.25rem", borderBottom: "1px solid #1d1d28" }}>
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
          <div
            style={{
              fontSize: "0.72rem",
              color: "#6b7280",
              marginTop: "0.35rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Demos gratuitas
          </div>
        </div>

        {/* Hub */}
        <nav style={{ padding: "0.75rem 0.75rem", flex: 1, overflowY: "auto" }}>
          <Link
            href="/demos"
            onClick={() => setMovilAbierto(false)}
            className={`vqr-nav-item ${hubActivo ? "vqr-nav-item-active" : ""}`}
            style={{ marginBottom: "0.5rem" }}
          >
            <span className="vqr-nav-icon" style={{ color: "#cdcdd9" }}>◧</span>
            <span style={{ flex: 1 }}>Todos los tipos</span>
          </Link>

          <div className="vqr-section-title">Tipos de local</div>

          {DEMOS.map((d: TipoDemo) => {
            const esActivo = activo(d.slug);
            return (
              <Link
                key={d.slug}
                href={`/demos/${d.slug}`}
                onClick={() => setMovilAbierto(false)}
                className={`vqr-nav-item ${esActivo ? "vqr-nav-item-active" : ""}`}
                style={
                  esActivo
                    ? { borderLeft: `3px solid ${d.acento}`, paddingLeft: "calc(0.85rem - 3px)" }
                    : undefined
                }
              >
                <span className="vqr-nav-icon" style={{ color: d.acento }}>{d.icono}</span>
                <span style={{ flex: 1 }}>{d.nombre}</span>
                {!esActivo && <span style={{ color: "#4b5563", fontSize: "0.78rem" }}>→</span>}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            padding: "0.75rem 1.5rem",
            borderTop: "1px solid #1d1d28",
            fontSize: "0.72rem",
            color: "#6b7280",
          }}
        >
          Modo demo — datos de ejemplo
        </div>
      </aside>
    </>
  );
}

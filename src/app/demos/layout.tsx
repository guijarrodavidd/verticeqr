import Link from "next/link";
import type { ReactNode } from "react";
import { DEMOS } from "./_lib/demos";

// Layout de la sección /demos. Sidebar fijo a la izquierda con el catálogo
// de tipos de local, contenido a la derecha. Inspiración visual: Angular
// Material dashboard (sidebar denso, contenido en cards con bordes sutiles).

export default function DemosLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside
        style={{
          width: 280,
          flexShrink: 0,
          background: "#0d0d14",
          borderRight: "1px solid #1d1d28",
          padding: "1.5rem 0",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Logo y volver */}
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
          >
            <span style={{ color: "#a78bfa" }}>▲</span> VerticeQR
          </Link>
          <div style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Demos gratuitas
          </div>
        </div>

        {/* Lista de demos */}
        <nav style={{ padding: "0.75rem 0.75rem", flex: 1 }}>
          <div style={sectionTitle}>Tipos de local</div>
          {DEMOS.map((d) => (
            <Link
              key={d.slug}
              href={`/demos/${d.slug}`}
              style={navItem}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  background: "#15151f",
                  color: d.acento,
                  fontSize: "0.95rem",
                }}
              >
                {d.icono}
              </span>
              <span style={{ flex: 1 }}>{d.nombre}</span>
              <span style={{ color: "#4b5563", fontSize: "0.78rem" }}>→</span>
            </Link>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div style={{ padding: "0.75rem 1.5rem", borderTop: "1px solid #1d1d28", fontSize: "0.72rem", color: "#6b7280" }}>
          Modo demo — datos de ejemplo
        </div>
      </aside>

      {/* CONTENIDO */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}

const sectionTitle = {
  padding: "0.5rem 0.85rem",
  fontSize: "0.7rem",
  color: "#6b7280",
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  fontWeight: 600,
};

const navItem = {
  display: "flex",
  alignItems: "center",
  gap: "0.7rem",
  padding: "0.55rem 0.85rem",
  color: "#cdcdd9",
  textDecoration: "none",
  borderRadius: 8,
  fontSize: "0.92rem",
  marginBottom: "0.15rem",
};

import Link from "next/link";
import { DEMOS } from "./_lib/demos";

export const metadata = {
  title: "Demos gratuitas — VerticeQR",
  description: "Explora cómo VerticeQR se ve en cada tipo de local: lounge, coctelería, pub, restaurante…",
};

export default function DemosIndex() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ fontSize: "0.78rem", color: "#6b7280", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Demos
      </div>
      <h1 style={{ fontSize: "2rem", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
        Elige un tipo de local
      </h1>
      <p style={{ color: "#9ca3af", maxWidth: 600, marginBottom: "2.5rem" }}>
        Cada demo muestra cómo se ve el menú QR de tu mesa para ese sector,
        con productos de ejemplo y ticket medio orientativo. Cuando contrates,
        lo personalizamos con tu carta real.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {DEMOS.map((d) => (
          <Link
            key={d.slug}
            href={`/demos/${d.slug}`}
            style={{
              display: "block",
              background: "#0f0f17",
              border: "1px solid #1d1d28",
              borderRadius: 14,
              padding: "1.25rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                background: "#15151f",
                color: d.acento,
                fontSize: "1.4rem",
                marginBottom: "0.85rem",
              }}
            >
              {d.icono}
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.3rem" }}>
              {d.nombre}
            </div>
            <div style={{ fontSize: "0.88rem", color: "#9ca3af", lineHeight: 1.45, marginBottom: "0.85rem" }}>
              {d.tagline}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#a78bfa", fontWeight: 600 }}>
              Ver demo →
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          marginTop: "3rem",
          padding: "1.25rem 1.5rem",
          background: "#15101f",
          border: "1px solid #2a1f4a",
          borderRadius: 12,
          fontSize: "0.9rem",
          color: "#cdcdd9",
        }}
      >
        <strong style={{ color: "#a78bfa" }}>Próximamente:</strong>{" "}
        cada demo enseñará el diseño definitivo del menú QR que ve el cliente al
        escanear la mesa. Lo iremos integrando aquí.
      </div>
    </div>
  );
}

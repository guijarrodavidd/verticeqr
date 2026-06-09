import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerLocalPorSlug, sectorInfo } from "@/lib/locales";
import { findDemo } from "@/lib/demos-catalog";

export const dynamic = "force-dynamic";

export default async function LocalDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const local = await obtenerLocalPorSlug(slug);
  if (!local) notFound();

  const sector = sectorInfo(local.sector);
  const demo = findDemo(local.sector);
  const accent = local.color_primario || sector.color;

  // Sector "otro" o cualquier valor sin demo en el catálogo.
  if (!demo) {
    return (
      <div className="vqr-todo-empty" style={{ marginTop: "2rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✨</div>
        <div style={{ color: "#cdcdd9", fontWeight: 600, marginBottom: "0.4rem" }}>
          Sin demo para este sector
        </div>
        <div style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
          El sector <strong>{sector.label}</strong> aún no tiene un mockup tipo.{" "}
          <Link href={`/app/locales/${slug}/admin`} style={{ color: "#a78bfa" }}>
            Cambia el sector en Admin →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, marginTop: "1.5rem" }}>
      <p style={{ color: "#9ca3af", marginTop: 0, marginBottom: "2rem" }}>
        Así se ve el menú QR estándar para un <strong style={{ color: "#cdcdd9" }}>{demo.nombre}</strong>.
        Cuando integremos el front definitivo, será exactamente este layout
        pero personalizado con el branding de <strong style={{ color: accent }}>{local.nombre}</strong>.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 360px) 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Mockup móvil */}
        <div
          style={{
            background: "#0f0f17",
            border: "1px solid #1d1d28",
            borderRadius: 24,
            padding: "1.5rem",
            aspectRatio: "9 / 16",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "0.7rem", color: "#6b7280", letterSpacing: "0.06em" }}>
              MESA 12
            </div>
            <div style={{ fontWeight: 700, marginTop: "0.25rem" }}>{local.nombre}</div>
          </div>

          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                width: 120,
                height: 120,
                background: `linear-gradient(135deg, ${accent}, #15151f)`,
                borderRadius: 12,
                margin: "0 auto 0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0a0a0f",
                fontSize: "3rem",
                fontWeight: 800,
              }}
            >
              QR
            </div>
            <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>Vista previa del menú</div>
          </div>

          <div style={{ fontSize: "0.78rem", color: "#6b7280", textAlign: "center" }}>
            verticeqr.com / m / {local.slug} / 12
          </div>
        </div>

        {/* Productos ejemplo del sector */}
        <div
          style={{
            background: "#0f0f17",
            border: "1px solid #1d1d28",
            borderRadius: 16,
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", margin: 0, letterSpacing: "-0.01em" }}>
              Productos típicos del sector
            </h2>
            <span style={{ fontSize: "0.78rem", color: accent, fontWeight: 600 }}>
              Ticket medio · {demo.ticketMedio}
            </span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {demo.productosEjemplo.map((p, i) => (
              <li
                key={i}
                style={{
                  padding: "0.75rem 0",
                  borderBottom:
                    i === demo.productosEjemplo.length - 1 ? "none" : "1px solid #1d1d28",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.92rem",
                }}
              >
                <span>{p}</span>
                <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>—</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px dashed #1d1d28", fontSize: "0.82rem", color: "#9ca3af" }}>
            {demo.tagline}
          </div>
        </div>
      </div>

      {/* Nota de placeholder */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          background: "#15101f",
          border: "1px solid #2a1f4a",
          borderRadius: 12,
          fontSize: "0.9rem",
          color: "#cdcdd9",
        }}
      >
        <strong style={{ color: accent }}>Vista placeholder.</strong> Aquí
        irá el diseño definitivo del menú QR. Cuando lo integremos, se
        renderizará con los productos reales de la <Link href={`/app/locales/${slug}/carta`} style={{ color: accent }}>carta</Link>{" "}
        y el branding del local.
      </div>
    </div>
  );
}

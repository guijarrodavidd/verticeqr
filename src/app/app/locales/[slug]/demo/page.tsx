import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerLocalPorSlug, sectorInfo } from "@/lib/locales";
import { findDemo } from "@/lib/demos-catalog";
import DemoPhone from "./_components/DemoPhone";

export const dynamic = "force-dynamic";

// Mapeo provisional sector → carta REAL disponible en /public/demos/.
// A medida que Cavani añada más cartas (cafetería, coctelería, etc.) este
// mapeo se amplía. Mientras tanto, todo sector cae en la carta más cercana.
const SECTOR_TO_CARTA: Record<string, { slug: string; nombre: string }> = {
  "bar-restaurante": { slug: "romanssera", nombre: "Romanssera" },
  "cafeteria":        { slug: "romanssera", nombre: "Romanssera" },
  "cocteleria":       { slug: "romanssera", nombre: "Romanssera" },
  "lounge-club":      { slug: "romanssera", nombre: "Romanssera" },
  "discoteca":        { slug: "romanssera", nombre: "Romanssera" },
  "hotel":            { slug: "romanssera", nombre: "Romanssera" },
  "pub":              { slug: "hamburgueseria", nombre: "Bonfire Burger" },
  "cerveceria":       { slug: "hamburgueseria", nombre: "Bonfire Burger" },
};

function cartaParaSector(sector: string): { slug: string; nombre: string } {
  return SECTOR_TO_CARTA[sector] ?? { slug: "romanssera", nombre: "Romanssera" };
}

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
  const cartaDemo = cartaParaSector(local.sector);
  const cartaUrl = `/demos/${cartaDemo.slug}/index.html`;
  const usandoFallback = cartaDemo.nombre !== local.nombre;

  return (
    <div style={{ maxWidth: 1000, marginTop: "1.5rem" }}>
      <p style={{ color: "#9ca3af", marginTop: 0, marginBottom: "2rem" }}>
        Vista previa del menú QR para{" "}
        <strong style={{ color: accent }}>{local.nombre}</strong>. La carta es{" "}
        <strong style={{ color: "#cdcdd9" }}>navegable de verdad</strong> dentro
        del móvil. Cuando integremos el front definitivo, será exactamente este
        layout pero con los productos reales de su carta y su branding.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 360px) 1fr",
          gap: "2.5rem",
          marginBottom: "2rem",
          alignItems: "start",
        }}
      >
        {/* Mockup móvil con la carta REAL */}
        <div style={{ padding: "0.5rem 0 2rem", display: "flex", justifyContent: "center" }}>
          <DemoPhone
            cartaUrl={cartaUrl}
            accent={accent}
            warning={
              usandoFallback
                ? `Mostrando la carta tipo de ${cartaDemo.nombre} como muestra del sector. Cuando integremos la carta real de ${local.nombre}, este móvil la enseñará directamente.`
                : undefined
            }
          />
        </div>

        {/* Productos típicos del sector (del catálogo) */}
        {demo && (
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
        )}

        {/* Si no hay match en el catálogo, igual mostramos info útil */}
        {!demo && (
          <div
            style={{
              background: "#0f0f17",
              border: "1px solid #1d1d28",
              borderRadius: 16,
              padding: "1.5rem",
              color: "#9ca3af",
            }}
          >
            <h2 style={{ fontSize: "1rem", margin: "0 0 0.6rem", color: "#cdcdd9" }}>
              Sin catálogo de muestra
            </h2>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.55, margin: 0 }}>
              El sector <strong>{sector.label}</strong> aún no tiene productos
              típicos en el catálogo, pero la carta navegable de la izquierda
              ya funciona.{" "}
              <Link href={`/app/locales/${slug}/admin`} style={{ color: "#a78bfa" }}>
                Cambia el sector en Admin →
              </Link>
            </p>
          </div>
        )}
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
        <strong style={{ color: accent }}>Carta navegable.</strong> Pruébala —
        haz click dentro del móvil y desplázate por las categorías. Cuando
        integremos el front definitivo, se renderizará con los productos
        reales de la{" "}
        <Link href={`/app/locales/${slug}/carta`} style={{ color: accent }}>
          carta
        </Link>{" "}
        y el branding del local.
      </div>
    </div>
  );
}

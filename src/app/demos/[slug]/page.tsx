import Link from "next/link";
import { notFound } from "next/navigation";
import { DEMOS, findDemo } from "../_lib/demos";

export function generateStaticParams() {
  return DEMOS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = findDemo(slug);
  if (!demo) return { title: "Demo no encontrada — VerticeQR" };
  return {
    title: `Demo ${demo.nombre} — VerticeQR`,
    description: demo.tagline,
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = findDemo(slug);
  if (!demo) notFound();

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: "0.82rem", color: "#6b7280", marginBottom: "0.75rem" }}>
        <Link href="/demos" style={{ color: "#9ca3af", textDecoration: "none" }}>
          Demos
        </Link>{" "}
        <span style={{ margin: "0 0.4rem" }}>/</span>
        <span style={{ color: "#cdcdd9" }}>{demo.nombre}</span>
      </div>

      {/* Cabecera */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
        <div
          style={{
            width: 52,
            height: 52,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            background: "#15151f",
            color: demo.acento,
            fontSize: "1.7rem",
          }}
        >
          {demo.icono}
        </div>
        <h1 style={{ fontSize: "2rem", margin: 0, letterSpacing: "-0.02em" }}>{demo.nombre}</h1>
      </div>
      <p style={{ color: "#9ca3af", maxWidth: 640, marginTop: 0, marginBottom: "2.5rem" }}>
        {demo.tagline}
      </p>

      {/* Maqueta del menú QR */}
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
            <div style={{ fontWeight: 700, marginTop: "0.25rem" }}>
              {demo.nombre}
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                width: 120,
                height: 120,
                background: `linear-gradient(135deg, ${demo.acento}, #15151f)`,
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
            <div style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
              Vista previa del menú
            </div>
          </div>

          <div style={{ fontSize: "0.78rem", color: "#6b7280", textAlign: "center" }}>
            verticeqr.com / m / 12
          </div>
        </div>

        {/* Productos de ejemplo */}
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
              Productos de la carta
            </h2>
            <span style={{ fontSize: "0.78rem", color: demo.acento, fontWeight: 600 }}>
              Ticket medio · {demo.ticketMedio}
            </span>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {demo.productosEjemplo.map((p, i) => (
              <li
                key={i}
                style={{
                  padding: "0.75rem 0",
                  borderBottom: i === demo.productosEjemplo.length - 1 ? "none" : "1px solid #1d1d28",
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
        <strong style={{ color: demo.acento }}>Vista placeholder.</strong> Aquí
        irá el diseño definitivo del menú QR para {demo.nombre}. Lo integraremos
        a partir del front que ya tienes hecho.
      </div>
    </div>
  );
}

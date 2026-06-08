import Link from "next/link";
import {
  planInfo,
  sectorInfo,
  type Local,
} from "@/lib/locales-shared";

function formatFecha(d: string): string {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Ya no se necesitan las acciones aquí — todo el editing vive en la página
// de detalle /app/locales/[slug]. La tarjeta es un Link puro.
export default function LocalesList({ locales }: { locales: Local[] }) {
  return (
    <div className="vqr-loc-grid">
      {locales.map((l) => {
        const sector = sectorInfo(l.sector);
        const plan = planInfo(l.plan);
        const activo = l.activo === 1;
        const color = l.color_primario || sector.color;
        return (
          <Link
            key={l.id}
            href={`/app/locales/${l.slug}`}
            className={`vqr-loc-card ${!activo ? "vqr-loc-card-inactive" : ""}`}
            style={{
              borderLeft: `4px solid ${color}`,
              color: "inherit",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",
            }}
          >
            <div className="vqr-loc-card-head">
              <div
                className="vqr-loc-avatar"
                style={{ background: color, color: "#0a0a0f" }}
              >
                {l.logo_url ? (
                  <img src={l.logo_url} alt="" />
                ) : (
                  <span>{sector.icono}</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="vqr-loc-nombre">{l.nombre}</div>
                <div className="vqr-loc-slug">/{l.slug}</div>
              </div>
              <span
                className="vqr-loc-status"
                style={{ color: activo ? "#4ade80" : "#9ca3af" }}
                title={activo ? "Activo" : "Inactivo"}
              >
                ●
              </span>
            </div>

            <div className="vqr-loc-tags">
              <span
                className="vqr-prio-badge"
                style={{
                  color: sector.color,
                  background: `${sector.color}1f`,
                  borderColor: `${sector.color}55`,
                }}
              >
                {sector.label}
              </span>
              <span
                className="vqr-prio-badge"
                style={{
                  color: plan.color,
                  background: `${plan.color}1f`,
                  borderColor: `${plan.color}55`,
                }}
              >
                {plan.label}
              </span>
            </div>

            <div className="vqr-loc-meta">
              {l.email && <div>✉️ {l.email}</div>}
              {l.telefono && <div>📞 {l.telefono}</div>}
              <div style={{ color: "#6b7280" }}>Alta · {formatFecha(l.created_at)}</div>
            </div>

            <div style={{ fontSize: "0.82rem", color: "#a78bfa", fontWeight: 600, marginTop: "auto" }}>
              Abrir detalle →
            </div>
          </Link>
        );
      })}
    </div>
  );
}

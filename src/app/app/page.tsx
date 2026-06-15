import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Paleta clara del dashboard de superadmin
const CREAM_BG = "#f5efe1";          // fondo cálido base
const CARD_BG = "#ffffff";           // cards blancas
const CARD_BORDER = "#e3d8c1";       // borde cálido sutil
const CARD_HOVER_BORDER = "#a78bfa"; // (manejado en CSS, aquí solo el default)
const TEXT_PRIMARY = "#2a2520";      // títulos
const TEXT_SECONDARY = "#7a6f5e";    // body / secundarios
const TEXT_MUTED = "#a89e88";        // muted / eyebrow
const ICON_TINT_BG = "#faf6ec";      // fondo del cuadrito del icono

type CardLink = {
  href: string;
  icono: string;
  iconoColor: string;
  titulo: string;
  desc: string;
};

const CARDS: CardLink[] = [
  {
    href: "/app/locales",
    icono: "▥",
    iconoColor: "#3b82f6",
    titulo: "Locales",
    desc: "Clientes contratados. Alta, plan, contacto, branding.",
  },
  {
    href: "/app/leads",
    icono: "✉",
    iconoColor: "#d97706",
    titulo: "Solicitudes",
    desc: "Leads desde la landing y las demos. Pipeline básico.",
  },
  {
    href: "/app/qr",
    icono: "▦",
    iconoColor: "#db2777",
    titulo: "Generador QR",
    desc: "Un QR por mesa, branded con el local. Listo para imprimir.",
  },
  {
    href: "/app/todos",
    icono: "✓",
    iconoColor: "#16a34a",
    titulo: "Todo List",
    desc: "Tareas del equipo. Crear, marcar hechas, fechas límite.",
  },
];

export default async function DashboardHome() {
  const user = (await getSession())!;

  return (
    <div
      style={{
        background: CREAM_BG,
        color: TEXT_PRIMARY,
        borderRadius: 16,
        padding: "2.5rem 2.25rem",
        minHeight: "calc(100vh - 4rem)",
        boxShadow: "inset 0 0 0 1px rgba(167, 139, 250, 0.08)",
      }}
    >
      <div style={{ maxWidth: 900 }}>
        <div
          style={{
            fontSize: "0.78rem",
            color: TEXT_MUTED,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "0.5rem",
            fontWeight: 600,
          }}
        >
          Panel
        </div>
        <h1
          style={{
            fontSize: "2rem",
            margin: "0 0 0.5rem",
            letterSpacing: "-0.02em",
            color: TEXT_PRIMARY,
          }}
        >
          Hola, {user.nombre} <span aria-hidden>👋</span>
        </h1>
        <p
          style={{
            color: TEXT_SECONDARY,
            marginBottom: "2.5rem",
            lineHeight: 1.6,
            maxWidth: 720,
          }}
        >
          Espacio interno del equipo VerticeQR. Desde el sidebar accedes a
          locales, solicitudes y herramientas. Iremos añadiendo más módulos
          (pedidos en vivo, métricas, calendario…).
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {CARDS.map((c) => (
            <a
              key={c.href}
              href={c.href}
              style={{
                display: "block",
                background: CARD_BG,
                border: `1px solid ${CARD_BORDER}`,
                borderRadius: 14,
                padding: "1.35rem 1.25rem",
                color: "inherit",
                textDecoration: "none",
                transition: "border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease",
                boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
              }}
              className="vqr-light-card"
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 11,
                  background: ICON_TINT_BG,
                  color: c.iconoColor,
                  fontSize: "1.35rem",
                  marginBottom: "0.85rem",
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                {c.icono}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: "0.35rem",
                  fontSize: "1.05rem",
                  color: TEXT_PRIMARY,
                }}
              >
                {c.titulo}
              </div>
              <div
                style={{
                  color: TEXT_SECONDARY,
                  fontSize: "0.88rem",
                  lineHeight: 1.5,
                }}
              >
                {c.desc}
              </div>
              <div
                style={{
                  fontSize: "0.84rem",
                  color: "#7c3aed",
                  fontWeight: 700,
                  marginTop: "0.85rem",
                  letterSpacing: "-0.005em",
                }}
              >
                Abrir →
              </div>
            </a>
          ))}

          {/* Próximamente */}
          <div
            style={{
              background: "transparent",
              border: `1px dashed ${CARD_BORDER}`,
              borderRadius: 14,
              padding: "1.35rem 1.25rem",
              color: TEXT_MUTED,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 11,
                background: ICON_TINT_BG,
                color: TEXT_MUTED,
                fontSize: "1.35rem",
                marginBottom: "0.85rem",
                border: `1px dashed ${CARD_BORDER}`,
              }}
            >
              +
            </div>
            <div
              style={{
                fontWeight: 600,
                marginBottom: "0.35rem",
                color: TEXT_SECONDARY,
                fontSize: "1.02rem",
              }}
            >
              Próximamente
            </div>
            <div style={{ fontSize: "0.86rem", lineHeight: 1.5 }}>
              Más módulos cuando integremos el front: productos, pedidos en
              vivo, métricas, configuración global.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

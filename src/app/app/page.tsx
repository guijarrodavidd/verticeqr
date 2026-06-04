import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const user = (await getSession())!;

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ fontSize: "0.78rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
        Panel
      </div>
      <h1 style={{ fontSize: "2rem", margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
        Hola, {user.nombre} 👋
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "2.5rem" }}>
        Espacio interno del equipo VerticeQR. Desde el sidebar accedes al Todo List
        compartido. Iremos añadiendo más módulos aquí (productos, locales,
        pedidos, métricas…).
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        <a
          href="/app/todos"
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
              color: "#4ade80",
              fontSize: "1.3rem",
              marginBottom: "0.75rem",
            }}
          >
            ✓
          </div>
          <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>Todo List</div>
          <div style={{ color: "#9ca3af", fontSize: "0.88rem" }}>
            Tareas del equipo. Crear, marcar hechas, fechas límite.
          </div>
          <div style={{ fontSize: "0.82rem", color: "#a78bfa", fontWeight: 600, marginTop: "0.75rem" }}>
            Abrir →
          </div>
        </a>

        <div
          style={{
            background: "#0f0f17",
            border: "1px dashed #1d1d28",
            borderRadius: 14,
            padding: "1.25rem",
            color: "#6b7280",
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
              color: "#6b7280",
              fontSize: "1.3rem",
              marginBottom: "0.75rem",
            }}
          >
            +
          </div>
          <div style={{ fontWeight: 600, marginBottom: "0.3rem", color: "#9ca3af" }}>Próximamente</div>
          <div style={{ fontSize: "0.85rem" }}>
            Más módulos cuando integremos el front: locales, productos, pedidos,
            métricas, configuración.
          </div>
        </div>
      </div>
    </div>
  );
}

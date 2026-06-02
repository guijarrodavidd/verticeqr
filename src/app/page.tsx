import { getPool } from "@/lib/db";

export const dynamic = "force-dynamic";

type Mensaje = { id: number; mensaje: string };
type CasoExito = {
  id: number;
  empresa: string;
  sector: string;
  qr_activos: number;
  escaneos_mes: number;
  destacado: number;
};

// Datos sembrados la primera vez que se levanta la app. Inventados pero creíbles
// para dar vida a la landing mientras no hay datos reales.
const SEED_CASOS: Array<Omit<CasoExito, "id">> = [
  { empresa: "Cervezas Volcán", sector: "Hostelería", qr_activos: 24, escaneos_mes: 18452, destacado: 1 },
  { empresa: "Floristería Lila", sector: "Retail", qr_activos: 8, escaneos_mes: 3210, destacado: 0 },
  { empresa: "Hotel Mediterránea", sector: "Turismo", qr_activos: 56, escaneos_mes: 41200, destacado: 1 },
  { empresa: "Museo de Artes Vivas", sector: "Cultura", qr_activos: 12, escaneos_mes: 9870, destacado: 0 },
  { empresa: "Logística Norte", sector: "B2B", qr_activos: 132, escaneos_mes: 73500, destacado: 1 },
];

async function asegurarTablaCasosExito() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS casos_exito (
      id INT AUTO_INCREMENT PRIMARY KEY,
      empresa VARCHAR(100) NOT NULL,
      sector VARCHAR(50) NOT NULL,
      qr_activos INT NOT NULL DEFAULT 0,
      escaneos_mes INT NOT NULL DEFAULT 0,
      destacado TINYINT(1) NOT NULL DEFAULT 0
    )
  `);
  const [countRows] = await pool.query("SELECT COUNT(*) AS n FROM casos_exito");
  const n = (countRows as Array<{ n: number }>)[0]?.n ?? 0;
  if (n === 0) {
    const values = SEED_CASOS.map(() => "(?, ?, ?, ?, ?)").join(", ");
    const params = SEED_CASOS.flatMap((c) => [
      c.empresa,
      c.sector,
      c.qr_activos,
      c.escaneos_mes,
      c.destacado,
    ]);
    await pool.query(
      `INSERT INTO casos_exito (empresa, sector, qr_activos, escaneos_mes, destacado) VALUES ${values}`,
      params,
    );
  }
}

async function leerLanding(): Promise<{
  ok: boolean;
  error?: string;
  mensajes: Mensaje[];
  casos: CasoExito[];
  totalEscaneos: number;
}> {
  try {
    await asegurarTablaCasosExito();
    const pool = getPool();
    const [mensajes] = await pool.query(
      "SELECT id, mensaje FROM prueba ORDER BY id DESC LIMIT 10",
    );
    const [casos] = await pool.query(
      "SELECT id, empresa, sector, qr_activos, escaneos_mes, destacado FROM casos_exito ORDER BY escaneos_mes DESC",
    );
    const totalEscaneos = (casos as CasoExito[]).reduce(
      (sum, c) => sum + c.escaneos_mes,
      0,
    );
    return {
      ok: true,
      mensajes: mensajes as Mensaje[],
      casos: casos as CasoExito[],
      totalEscaneos,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      mensajes: [],
      casos: [],
      totalEscaneos: 0,
    };
  }
}

function formatNumero(n: number): string {
  return n.toLocaleString("es-ES");
}

export default async function Home() {
  const data = await leerLanding();

  return (
    <>
      {/* NAV */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid #1d1d28",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.01em" }}>
          <span style={{ color: "#a78bfa" }}>▲</span> VerticeQR
        </div>
        <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.9rem", opacity: 0.85 }}>
          <a href="#producto" style={enlace}>Producto</a>
          <a href="#clientes" style={enlace}>Clientes</a>
          <a href="#estado" style={enlace}>Estado</a>
          <a href="#contacto" style={enlace}>Contacto</a>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "6rem 2rem 4rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "0.35rem 0.85rem",
            borderRadius: 999,
            border: "1px solid #2a2a3a",
            background: "#13131b",
            fontSize: "0.78rem",
            color: "#a78bfa",
            marginBottom: "1.5rem",
            letterSpacing: "0.04em",
          }}
        >
          EN DESARROLLO · v0.2
        </div>
        <h1
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            lineHeight: 1.05,
            margin: "0 0 1.25rem",
            letterSpacing: "-0.025em",
            fontWeight: 800,
          }}
        >
          Códigos QR que <span style={{ color: "#a78bfa" }}>trabajan por ti</span>
        </h1>
        <p
          style={{
            fontSize: "1.15rem",
            lineHeight: 1.55,
            color: "#b3b3c2",
            maxWidth: 600,
            margin: "0 auto 2.5rem",
          }}
        >
          Genera, personaliza y mide tus códigos QR desde un único lugar.
          Diseño, analítica y enlaces dinámicos sin complicarte.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#contacto" style={botonPrimario}>Empezar gratis</a>
          <a href="#producto" style={botonSecundario}>Ver cómo funciona →</a>
        </div>
      </section>

      {/* FEATURES */}
      <section id="producto" style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          <Feature icono="◉" titulo="Diseño a medida" texto="Logos, colores y formas. Tu marca, también en cada escaneo." />
          <Feature icono="⇄" titulo="QR dinámicos" texto="Cambia el destino sin reimprimir. Un código, infinitas campañas." />
          <Feature icono="📊" titulo="Analítica en vivo" texto="Sabe quién, cuándo y desde dónde escanea. Decisiones con datos." />
        </div>
      </section>

      {/* CASOS DE ÉXITO (datos en vivo de la tabla casos_exito) */}
      <section
        id="clientes"
        style={{
          maxWidth: 1100,
          margin: "4rem auto 2rem",
          padding: "0 2rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", marginBottom: "1.5rem", gap: "0.5rem" }}>
          <h2 style={{ fontSize: "1.75rem", margin: 0, letterSpacing: "-0.02em" }}>
            Quienes ya confían en nosotros
          </h2>
          {data.ok && (
            <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              <strong style={{ color: "#a78bfa" }}>{formatNumero(data.totalEscaneos)}</strong> escaneos este mes
            </span>
          )}
        </div>

        {data.ok && data.casos.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            {data.casos.map((c) => (
              <div
                key={c.id}
                style={{
                  background: c.destacado ? "#15101f" : "#0f0f17",
                  border: c.destacado ? "1px solid #3b2a5a" : "1px solid #1d1d28",
                  borderRadius: 14,
                  padding: "1.25rem",
                  position: "relative",
                }}
              >
                {c.destacado === 1 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      fontSize: "0.65rem",
                      letterSpacing: "0.06em",
                      color: "#a78bfa",
                      background: "#2a1f4a",
                      padding: "0.15rem 0.5rem",
                      borderRadius: 999,
                      fontWeight: 600,
                    }}
                  >
                    DESTACADO
                  </span>
                )}
                <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.25rem" }}>
                  {c.empresa}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {c.sector}
                </div>
                <div style={{ display: "flex", gap: "1.25rem" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>QR activos</div>
                    <div style={{ fontSize: "1.15rem", fontWeight: 700 }}>{c.qr_activos}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>Escaneos/mes</div>
                    <div style={{ fontSize: "1.15rem", fontWeight: 700 }}>{formatNumero(c.escaneos_mes)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
            Aún no hay casos para mostrar.
          </div>
        )}
      </section>

      {/* ESTADO DEL SISTEMA (datos vivos de la BD) */}
      <section
        id="estado"
        style={{
          maxWidth: 1100,
          margin: "3rem auto",
          padding: "2rem",
          background: "#0f0f17",
          border: "1px solid #1d1d28",
          borderRadius: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", margin: 0, letterSpacing: "-0.01em" }}>
            Estado del sistema
          </h2>
          <span
            style={{
              fontSize: "0.78rem",
              color: data.ok ? "#4ade80" : "#f87171",
              fontWeight: 600,
            }}
          >
            ● {data.ok ? "Operativo" : "Sin conexión a BD"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <Stat etiqueta="API" valor="OK" />
          <Stat etiqueta="Base de datos" valor={data.ok ? "Conectada" : "Error"} />
          <Stat etiqueta="Mensajes" valor={data.ok ? String(data.mensajes.length) : "—"} />
          <Stat etiqueta="Casos en BD" valor={data.ok ? String(data.casos.length) : "—"} />
        </div>

        {data.ok && data.mensajes.length > 0 && (
          <details style={{ marginTop: "1.5rem" }}>
            <summary style={{ cursor: "pointer", color: "#9ca3af", fontSize: "0.9rem" }}>
              Ver últimos mensajes
            </summary>
            <ul style={{ marginTop: "0.75rem", paddingLeft: "1.2rem", color: "#cdcdd9", fontSize: "0.92rem" }}>
              {data.mensajes.map((m) => (
                <li key={m.id} style={{ marginBottom: "0.25rem" }}>
                  <span style={{ color: "#6b7280" }}>#{m.id}</span> — {m.mensaje}
                </li>
              ))}
            </ul>
          </details>
        )}
        {!data.ok && data.error && (
          <pre
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              background: "#0a0a0f",
              borderRadius: 8,
              color: "#fca5a5",
              fontSize: "0.78rem",
              overflowX: "auto",
            }}
          >
            {data.error}
          </pre>
        )}
      </section>

      {/* CONTACTO */}
      <section
        id="contacto"
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.75rem", letterSpacing: "-0.02em", margin: "0 0 0.75rem" }}>
          ¿Te interesa probarlo?
        </h2>
        <p style={{ color: "#b3b3c2", margin: "0 0 1.5rem" }}>
          Estamos en fase privada. Déjanos tu correo y avisamos cuando abramos.
        </p>
        <a href="mailto:vertice605@gmail.com" style={botonPrimario}>
          vertice605@gmail.com
        </a>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #1d1d28",
          padding: "1.5rem 2rem",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "0.82rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        © {new Date().getFullYear()} VerticeQR · Hecho con Next.js
      </footer>
    </>
  );
}

function Feature({ icono, titulo, texto }: { icono: string; titulo: string; texto: string }) {
  return (
    <div
      style={{
        background: "#0f0f17",
        border: "1px solid #1d1d28",
        borderRadius: 14,
        padding: "1.5rem",
      }}
    >
      <div style={{ fontSize: "1.6rem", color: "#a78bfa", marginBottom: "0.6rem" }}>{icono}</div>
      <div style={{ fontWeight: 600, marginBottom: "0.35rem" }}>{titulo}</div>
      <div style={{ color: "#9ca3af", fontSize: "0.92rem", lineHeight: 1.5 }}>{texto}</div>
    </div>
  );
}

function Stat({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <div style={{ fontSize: "0.78rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {etiqueta}
      </div>
      <div style={{ fontSize: "1.4rem", fontWeight: 700, marginTop: "0.15rem" }}>{valor}</div>
    </div>
  );
}

const enlace = {
  color: "#cdcdd9",
  textDecoration: "none",
};

const botonPrimario = {
  display: "inline-block",
  background: "#a78bfa",
  color: "#0a0a0f",
  padding: "0.75rem 1.5rem",
  borderRadius: 10,
  fontWeight: 600,
  textDecoration: "none",
  fontSize: "0.95rem",
};

const botonSecundario = {
  display: "inline-block",
  background: "transparent",
  color: "#f2f2f5",
  padding: "0.75rem 1.5rem",
  borderRadius: 10,
  border: "1px solid #2a2a3a",
  fontWeight: 500,
  textDecoration: "none",
  fontSize: "0.95rem",
};

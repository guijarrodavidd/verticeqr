import { getPool } from "@/lib/db";

// Evita el cacheo estático: queremos leer la BD en cada visita.
export const dynamic = "force-dynamic";

type Fila = { id: number; mensaje: string };

async function leerPrueba(): Promise<
  { ok: true; filas: Fila[] } | { ok: false; error: string }
> {
  try {
    const [rows] = await getPool().query("SELECT id, mensaje FROM prueba ORDER BY id");
    return { ok: true, filas: rows as Fila[] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export default async function Home() {
  const resultado = await leerPrueba();

  return (
    <main style={{ maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>VerticeQR</h1>
      <p style={{ opacity: 0.7, marginTop: 0 }}>Web de prueba conectada a MySQL</p>

      <section
        style={{
          marginTop: "2rem",
          padding: "1.25rem",
          borderRadius: 12,
          background: "#16161d",
          border: "1px solid #2a2a35",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", marginTop: 0 }}>Estado de la base de datos</h2>

        {resultado.ok ? (
          <>
            <p style={{ color: "#4ade80" }}>✓ Conexión correcta</p>
            <ul>
              {resultado.filas.map((f) => (
                <li key={f.id}>
                  #{f.id} — {f.mensaje}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p style={{ color: "#f87171" }}>✗ No se pudo leer la base de datos</p>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "#0b0b0f",
                padding: "0.75rem",
                borderRadius: 8,
                fontSize: "0.85rem",
              }}
            >
              {resultado.error}
            </pre>
            <p style={{ opacity: 0.7, fontSize: "0.85rem" }}>
              Revisa las variables de entorno DB_HOST, DB_USER, DB_PASSWORD y DB_NAME, y
              que exista la tabla <code>prueba</code>.
            </p>
          </>
        )}
      </section>
    </main>
  );
}

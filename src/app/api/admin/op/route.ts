import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Endpoint admin con WHITELIST: solo acepta operaciones predefinidas.
// Cero SQL libre. Para añadir una operación nueva, edítala aquí y haz deploy.
//
// Auth: Authorization: Bearer <ADMIN_TOKEN>.
// Si ADMIN_TOKEN no está definida en el entorno, el endpoint queda deshabilitado (503).
//
// Uso desde local:
//   GET  https://verticeqr.com/api/admin/op   → lista las operaciones disponibles.
//   POST https://verticeqr.com/api/admin/op   body: {"op":"add_message","params":{"mensaje":"hola"}}

type Op = {
  description: string;
  run: (params: unknown) => Promise<unknown>;
};

function asString(v: unknown, name: string): string {
  if (typeof v !== "string" || !v.trim()) throw new Error(`params.${name} (string no vacío) requerido`);
  return v.trim();
}
function asPositiveInt(v: unknown, name: string): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw new Error(`params.${name} (entero positivo) requerido`);
  return n;
}

const operations: Record<string, Op> = {
  add_message: {
    description: "Inserta una fila en la tabla 'prueba' con el mensaje dado.",
    run: async (params) => {
      const p = (params ?? {}) as { mensaje?: unknown };
      const mensaje = asString(p.mensaje, "mensaje");
      const [result] = await getPool().query(
        "INSERT INTO prueba (mensaje) VALUES (?)",
        [mensaje],
      );
      return result;
    },
  },
  list_messages: {
    description: "Devuelve todas las filas de la tabla 'prueba' ordenadas por id.",
    run: async () => {
      const [rows] = await getPool().query("SELECT id, mensaje FROM prueba ORDER BY id");
      return rows;
    },
  },
  count_messages: {
    description: "Cuenta filas de la tabla 'prueba'.",
    run: async () => {
      const [rows] = await getPool().query("SELECT COUNT(*) AS n FROM prueba");
      return rows;
    },
  },
  delete_message: {
    description: "Borra una fila de 'prueba' por id.",
    run: async (params) => {
      const p = (params ?? {}) as { id?: unknown };
      const id = asPositiveInt(p.id, "id");
      const [result] = await getPool().query("DELETE FROM prueba WHERE id = ?", [id]);
      return result;
    },
  },
  list_migrations: {
    description: "Devuelve las migraciones aplicadas (tabla _migrations).",
    run: async () => {
      const [rows] = await getPool().query(
        "SELECT name, applied_at FROM _migrations ORDER BY applied_at",
      );
      return rows;
    },
  },
  apply_migrations: {
    description: "Aplica las migraciones pendientes ahora mismo.",
    run: async () => {
      const { applyPendingMigrations } = await import("@/lib/migrations");
      return await applyPendingMigrations();
    },
  },
};

function checkAuth(req: Request): NextResponse | null {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "endpoint disabled (ADMIN_TOKEN no definido)" },
      { status: 503 },
    );
  }
  const auth = req.headers.get("authorization") ?? "";
  const match = auth.match(/^Bearer\s+(.+)$/);
  if (!match || match[1] !== token) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: Request) {
  const denied = checkAuth(req);
  if (denied) return denied;
  return NextResponse.json({
    ok: true,
    operations: Object.fromEntries(
      Object.entries(operations).map(([k, v]) => [k, v.description]),
    ),
  });
}

export async function POST(req: Request) {
  const denied = checkAuth(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON body" }, { status: 400 });
  }

  const { op, params } =
    (body as { op?: unknown; params?: unknown } | null) ?? {};

  if (typeof op !== "string") {
    return NextResponse.json(
      { ok: false, error: "op (string) requerida", available: Object.keys(operations) },
      { status: 400 },
    );
  }

  const operation = operations[op];
  if (!operation) {
    return NextResponse.json(
      { ok: false, error: `op desconocida: ${op}`, available: Object.keys(operations) },
      { status: 400 },
    );
  }

  // Log de auditoría (queda en los Registros de tiempo de ejecución de Hostinger).
  console.log(`[admin/op] ${new Date().toISOString()} op=${op}`);

  try {
    const result = await operation.run(params);
    return NextResponse.json({ ok: true, op, result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, op, error: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }
}

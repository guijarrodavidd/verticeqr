// Solo SERVIDOR. Capa de BD para locales.
// Lo que necesite el cliente lo importa de "./locales-shared".

import { getPool } from "./db";
import type {
  EstadoFiltroLocal,
  Local,
  PlanLocal,
  SectorFiltro,
  SectorLocal,
} from "./locales-shared";
import { slugify } from "./locales-shared";

export * from "./locales-shared";

let ensured = false;

export async function ensureLocalesTable() {
  if (ensured) return;
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS locales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(80) NOT NULL UNIQUE,
      nombre VARCHAR(150) NOT NULL,
      sector VARCHAR(50) NOT NULL,
      email VARCHAR(150),
      telefono VARCHAR(30),
      plan VARCHAR(30) NOT NULL DEFAULT 'basic',
      activo TINYINT(1) NOT NULL DEFAULT 1,
      color_primario VARCHAR(20) DEFAULT '#a78bfa',
      logo_url VARCHAR(500),
      timezone VARCHAR(50) NOT NULL DEFAULT 'Europe/Madrid',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_locales_activo (activo, created_at),
      INDEX idx_locales_sector (sector)
    ) ENGINE=InnoDB
  `);
  ensured = true;
}

export type FiltrosLocales = {
  estado: EstadoFiltroLocal;
  sector: SectorFiltro;
  q?: string;
};

export async function listarLocales(f: FiltrosLocales): Promise<Local[]> {
  await ensureLocalesTable();
  const pool = getPool();
  const conds: string[] = [];
  const params: (string | number)[] = [];
  if (f.estado === "activos") conds.push("activo = 1");
  else if (f.estado === "inactivos") conds.push("activo = 0");
  if (f.sector !== "todos") {
    conds.push("sector = ?");
    params.push(f.sector);
  }
  if (f.q && f.q.trim()) {
    conds.push("(nombre LIKE ? OR email LIKE ?)");
    const like = `%${f.q.trim()}%`;
    params.push(like, like);
  }
  const where = conds.length ? "WHERE " + conds.join(" AND ") : "";
  const [rows] = await pool.query(
    `SELECT id, slug, nombre, sector, email, telefono, plan, activo,
            color_primario, logo_url, timezone, created_at, updated_at
     FROM locales
     ${where}
     ORDER BY activo DESC, created_at DESC, id DESC`,
    params,
  );
  return rows as Local[];
}

export async function obtenerLocalPorSlug(slug: string): Promise<Local | null> {
  await ensureLocalesTable();
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, slug, nombre, sector, email, telefono, plan, activo,
            color_primario, logo_url, timezone, created_at, updated_at
     FROM locales WHERE slug = ? LIMIT 1`,
    [slug],
  );
  const arr = rows as Local[];
  return arr[0] ?? null;
}

export async function contarLocales(): Promise<{
  total: number;
  activos: number;
}> {
  await ensureLocalesTable();
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) AS activos
     FROM locales`,
  );
  const r = (rows as Array<{ total: number; activos: number | null }>)[0];
  return { total: Number(r?.total ?? 0), activos: Number(r?.activos ?? 0) };
}

async function asegurarSlugUnico(
  base: string,
  excluirId?: number,
): Promise<string> {
  const pool = getPool();
  let candidato = base || "local";
  let i = 2;
  // Bucle corto: el slug colisiona muy raramente. Limitamos por seguridad.
  while (i < 1000) {
    const [rows] = await pool.query(
      `SELECT id FROM locales WHERE slug = ? LIMIT 1`,
      [candidato],
    );
    const r = rows as Array<{ id: number }>;
    if (r.length === 0 || (excluirId != null && r[0].id === excluirId)) {
      return candidato;
    }
    candidato = `${base}-${i}`;
    i++;
  }
  return `${base}-${Date.now()}`;
}

export async function crearLocal(args: {
  nombre: string;
  slug?: string;
  sector: SectorLocal;
  email?: string | null;
  telefono?: string | null;
  plan?: PlanLocal;
  color_primario?: string | null;
  logo_url?: string | null;
  timezone?: string;
}): Promise<{ id: number; slug: string }> {
  await ensureLocalesTable();
  const pool = getPool();
  const baseSlug = slugify(args.slug?.trim() || args.nombre);
  const slug = await asegurarSlugUnico(baseSlug);
  const [result] = await pool.query(
    `INSERT INTO locales
       (slug, nombre, sector, email, telefono, plan, color_primario, logo_url, timezone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      slug,
      args.nombre.trim(),
      args.sector,
      args.email?.trim() || null,
      args.telefono?.trim() || null,
      args.plan || "basic",
      args.color_primario?.trim() || "#a78bfa",
      args.logo_url?.trim() || null,
      args.timezone || "Europe/Madrid",
    ],
  );
  const insertId = (result as { insertId: number }).insertId;
  return { id: insertId, slug };
}

export async function actualizarLocal(
  id: number,
  args: Partial<{
    nombre: string;
    slug: string;
    sector: SectorLocal;
    email: string | null;
    telefono: string | null;
    plan: PlanLocal;
    activo: number;
    color_primario: string | null;
    logo_url: string | null;
    timezone: string;
  }>,
) {
  await ensureLocalesTable();
  const sets: string[] = [];
  const params: (string | number | null)[] = [];

  if (args.nombre !== undefined) {
    sets.push("nombre = ?");
    params.push(args.nombre.trim());
  }
  if (args.slug !== undefined) {
    const base = slugify(args.slug);
    const finalSlug = await asegurarSlugUnico(base, id);
    sets.push("slug = ?");
    params.push(finalSlug);
  }
  if (args.sector !== undefined) {
    sets.push("sector = ?");
    params.push(args.sector);
  }
  if (args.email !== undefined) {
    sets.push("email = ?");
    params.push(args.email?.trim() || null);
  }
  if (args.telefono !== undefined) {
    sets.push("telefono = ?");
    params.push(args.telefono?.trim() || null);
  }
  if (args.plan !== undefined) {
    sets.push("plan = ?");
    params.push(args.plan);
  }
  if (args.activo !== undefined) {
    sets.push("activo = ?");
    params.push(args.activo);
  }
  if (args.color_primario !== undefined) {
    sets.push("color_primario = ?");
    params.push(args.color_primario?.trim() || null);
  }
  if (args.logo_url !== undefined) {
    sets.push("logo_url = ?");
    params.push(args.logo_url?.trim() || null);
  }
  if (args.timezone !== undefined) {
    sets.push("timezone = ?");
    params.push(args.timezone);
  }

  if (sets.length === 0) return;
  params.push(id);
  const pool = getPool();
  await pool.query(`UPDATE locales SET ${sets.join(", ")} WHERE id = ?`, params);
}

export async function toggleActivo(id: number) {
  await ensureLocalesTable();
  const pool = getPool();
  await pool.query(
    "UPDATE locales SET activo = 1 - activo WHERE id = ?",
    [id],
  );
}

export async function borrarLocal(id: number) {
  await ensureLocalesTable();
  const pool = getPool();
  await pool.query("DELETE FROM locales WHERE id = ?", [id]);
}

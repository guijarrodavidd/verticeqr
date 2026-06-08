// Solo SERVIDOR. Capa de BD para leads.

import { getPool } from "./db";
import type { EstadoLead, EstadoLeadFiltro, Lead } from "./leads-shared";

export * from "./leads-shared";

let ensured = false;

export async function ensureLeadsTable() {
  if (ensured) return;
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      telefono VARCHAR(30),
      empresa VARCHAR(150),
      sector VARCHAR(50),
      num_mesas INT,
      mensaje TEXT,
      origen VARCHAR(80) NOT NULL DEFAULT 'landing',
      estado VARCHAR(30) NOT NULL DEFAULT 'nuevo',
      notas TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_leads_estado (estado, created_at),
      INDEX idx_leads_origen (origen),
      INDEX idx_leads_email (email)
    ) ENGINE=InnoDB
  `);
  ensured = true;
}

export type FiltrosLeads = {
  estado: EstadoLeadFiltro;
  q?: string;
};

export async function listarLeads(f: FiltrosLeads): Promise<Lead[]> {
  await ensureLeadsTable();
  const pool = getPool();
  const conds: string[] = [];
  const params: (string | number)[] = [];
  if (f.estado !== "todos") {
    conds.push("estado = ?");
    params.push(f.estado);
  }
  if (f.q && f.q.trim()) {
    conds.push("(nombre LIKE ? OR email LIKE ? OR empresa LIKE ?)");
    const like = `%${f.q.trim()}%`;
    params.push(like, like, like);
  }
  const where = conds.length ? "WHERE " + conds.join(" AND ") : "";
  const [rows] = await pool.query(
    `SELECT id, nombre, email, telefono, empresa, sector, num_mesas,
            mensaje, origen, estado, notas, created_at, updated_at
     FROM leads
     ${where}
     ORDER BY
       FIELD(estado, 'nuevo', 'contactado', 'negociacion', 'cerrado', 'perdido') ASC,
       created_at DESC`,
    params,
  );
  return rows as Lead[];
}

export async function contarLeadsPorEstado(): Promise<Record<EstadoLead, number>> {
  await ensureLeadsTable();
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT estado, COUNT(*) AS n FROM leads GROUP BY estado`,
  );
  const out: Record<EstadoLead, number> = {
    nuevo: 0,
    contactado: 0,
    negociacion: 0,
    cerrado: 0,
    perdido: 0,
  };
  for (const r of rows as Array<{ estado: EstadoLead; n: number }>) {
    if (r.estado in out) out[r.estado] = Number(r.n);
  }
  return out;
}

export async function crearLead(args: {
  nombre: string;
  email: string;
  telefono?: string | null;
  empresa?: string | null;
  sector?: string | null;
  num_mesas?: number | null;
  mensaje?: string | null;
  origen?: string;
}): Promise<number> {
  await ensureLeadsTable();
  const pool = getPool();
  const [res] = await pool.query(
    `INSERT INTO leads
       (nombre, email, telefono, empresa, sector, num_mesas, mensaje, origen)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      args.nombre.trim().slice(0, 150),
      args.email.trim().toLowerCase().slice(0, 150),
      args.telefono?.trim().slice(0, 30) || null,
      args.empresa?.trim().slice(0, 150) || null,
      args.sector?.trim().slice(0, 50) || null,
      args.num_mesas ?? null,
      args.mensaje?.trim().slice(0, 5000) || null,
      (args.origen || "landing").slice(0, 80),
    ],
  );
  return (res as { insertId: number }).insertId;
}

export async function actualizarLead(
  id: number,
  args: Partial<{
    estado: EstadoLead;
    notas: string | null;
    nombre: string;
    email: string;
    telefono: string | null;
    empresa: string | null;
    sector: string | null;
    num_mesas: number | null;
    mensaje: string | null;
  }>,
) {
  await ensureLeadsTable();
  const sets: string[] = [];
  const params: (string | number | null)[] = [];
  if (args.estado !== undefined) { sets.push("estado = ?"); params.push(args.estado); }
  if (args.notas !== undefined) { sets.push("notas = ?"); params.push(args.notas?.trim() || null); }
  if (args.nombre !== undefined) { sets.push("nombre = ?"); params.push(args.nombre.trim()); }
  if (args.email !== undefined) { sets.push("email = ?"); params.push(args.email.trim().toLowerCase()); }
  if (args.telefono !== undefined) { sets.push("telefono = ?"); params.push(args.telefono?.trim() || null); }
  if (args.empresa !== undefined) { sets.push("empresa = ?"); params.push(args.empresa?.trim() || null); }
  if (args.sector !== undefined) { sets.push("sector = ?"); params.push(args.sector?.trim() || null); }
  if (args.num_mesas !== undefined) { sets.push("num_mesas = ?"); params.push(args.num_mesas); }
  if (args.mensaje !== undefined) { sets.push("mensaje = ?"); params.push(args.mensaje?.trim() || null); }
  if (sets.length === 0) return;
  params.push(id);
  const pool = getPool();
  await pool.query(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?`, params);
}

export async function borrarLead(id: number) {
  await ensureLeadsTable();
  const pool = getPool();
  await pool.query("DELETE FROM leads WHERE id = ?", [id]);
}

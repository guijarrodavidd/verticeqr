import { getPool } from "./db";

export type Prioridad = "urgente" | "media" | "leve";

export const PRIORIDADES: { value: Prioridad; label: string; color: string }[] = [
  { value: "urgente", label: "Urgente", color: "#f87171" },
  { value: "media", label: "Media", color: "#fbbf24" },
  { value: "leve", label: "Leve", color: "#4ade80" },
];

export function parsePrioridad(v: unknown): Prioridad {
  if (v === "urgente" || v === "media" || v === "leve") return v;
  return "media";
}

export type Tarea = {
  id: number;
  titulo: string;
  descripcion: string | null;
  fecha_limite: string | null;
  hecha: number; // 0 | 1
  prioridad: Prioridad;
  creado_por: string | null;
  created_at: string;
  updated_at: string;
};

let ensured = false;

export async function ensureTareasTable() {
  if (ensured) return;
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tareas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(200) NOT NULL,
      descripcion TEXT,
      fecha_limite DATETIME NULL,
      hecha TINYINT(1) NOT NULL DEFAULT 0,
      prioridad VARCHAR(10) NOT NULL DEFAULT 'media',
      creado_por VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_tareas_hecha (hecha, fecha_limite),
      INDEX idx_tareas_prio (prioridad)
    ) ENGINE=InnoDB
  `);
  // Si la tabla ya existía sin la columna prioridad (instalaciones previas),
  // la añadimos. Si ya existe, MySQL devuelve "duplicate column" y lo ignoramos.
  try {
    await pool.query(
      `ALTER TABLE tareas ADD COLUMN prioridad VARCHAR(10) NOT NULL DEFAULT 'media'`,
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (!/duplicate column|exists/i.test(msg)) throw e;
  }
  ensured = true;
}

export type FiltroTareas = "todas" | "pendientes" | "hechas";

export async function listarTareas(filtro: FiltroTareas = "todas"): Promise<Tarea[]> {
  await ensureTareasTable();
  const pool = getPool();
  let where = "";
  if (filtro === "pendientes") where = "WHERE hecha = 0";
  else if (filtro === "hechas") where = "WHERE hecha = 1";
  const [rows] = await pool.query(
    `SELECT id, titulo, descripcion, fecha_limite, hecha, prioridad, creado_por, created_at, updated_at
     FROM tareas
     ${where}
     ORDER BY
       hecha ASC,
       FIELD(prioridad, 'urgente', 'media', 'leve') ASC,
       (fecha_limite IS NULL) ASC,
       fecha_limite ASC,
       id DESC`,
  );
  return rows as Tarea[];
}

export async function crearTarea(args: {
  titulo: string;
  descripcion?: string;
  fechaLimite?: string | null;
  prioridad?: Prioridad;
  creadoPor?: string;
}) {
  await ensureTareasTable();
  const pool = getPool();
  await pool.query(
    `INSERT INTO tareas (titulo, descripcion, fecha_limite, prioridad, creado_por)
     VALUES (?, ?, ?, ?, ?)`,
    [
      args.titulo.trim(),
      args.descripcion?.trim() || null,
      args.fechaLimite || null,
      args.prioridad || "media",
      args.creadoPor || null,
    ],
  );
}

export async function toggleTarea(id: number) {
  await ensureTareasTable();
  const pool = getPool();
  await pool.query("UPDATE tareas SET hecha = 1 - hecha WHERE id = ?", [id]);
}

export async function borrarTarea(id: number) {
  await ensureTareasTable();
  const pool = getPool();
  await pool.query("DELETE FROM tareas WHERE id = ?", [id]);
}

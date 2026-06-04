import { getPool } from "./db";

export type Tarea = {
  id: number;
  titulo: string;
  descripcion: string | null;
  fecha_limite: string | null; // ISO o "YYYY-MM-DD HH:mm:ss"
  hecha: number; // 0 | 1
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
      creado_por VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_tareas_hecha (hecha, fecha_limite)
    ) ENGINE=InnoDB
  `);
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
    `SELECT id, titulo, descripcion, fecha_limite, hecha, creado_por, created_at, updated_at
     FROM tareas
     ${where}
     ORDER BY hecha ASC, (fecha_limite IS NULL) ASC, fecha_limite ASC, id DESC`,
  );
  return rows as Tarea[];
}

export async function crearTarea(args: {
  titulo: string;
  descripcion?: string;
  fechaLimite?: string | null;
  creadoPor?: string;
}) {
  await ensureTareasTable();
  const pool = getPool();
  await pool.query(
    `INSERT INTO tareas (titulo, descripcion, fecha_limite, creado_por)
     VALUES (?, ?, ?, ?)`,
    [
      args.titulo.trim(),
      args.descripcion?.trim() || null,
      args.fechaLimite || null,
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

// Solo SERVIDOR. Las funciones aquí tocan la BD (mysql2). Lo que necesite
// el cliente lo importa de "./todos-shared".

import { getPool } from "./db";
import type { Filtros, Prioridad, Tarea } from "./todos-shared";

export * from "./todos-shared";

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

function buildWhere(f: Filtros): { sql: string; params: (string | number)[] } {
  const conds: string[] = [];
  const params: (string | number)[] = [];
  if (f.estado === "pendientes") conds.push("hecha = 0");
  else if (f.estado === "hechas") conds.push("hecha = 1");
  if (f.prioridad !== "todas") {
    conds.push("prioridad = ?");
    params.push(f.prioridad);
  }
  switch (f.fecha) {
    case "hoy":
      conds.push(
        "fecha_limite IS NOT NULL AND DATE(fecha_limite) = CURDATE()",
      );
      break;
    case "semana":
      conds.push(
        "fecha_limite IS NOT NULL AND fecha_limite BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)",
      );
      break;
    case "vencidas":
      conds.push(
        "fecha_limite IS NOT NULL AND fecha_limite < NOW() AND hecha = 0",
      );
      break;
    case "sin_fecha":
      conds.push("fecha_limite IS NULL");
      break;
  }
  const sql = conds.length ? "WHERE " + conds.join(" AND ") : "";
  return { sql, params };
}

export async function listarTareas(filtros: Filtros): Promise<Tarea[]> {
  await ensureTareasTable();
  const pool = getPool();
  const { sql: where, params } = buildWhere(filtros);
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
    params,
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

export async function actualizarTarea(
  id: number,
  args: {
    titulo?: string;
    descripcion?: string | null;
    fechaLimite?: string | null;
    prioridad?: Prioridad;
  },
) {
  await ensureTareasTable();
  const sets: string[] = [];
  const params: (string | number | null)[] = [];
  if (args.titulo !== undefined) {
    sets.push("titulo = ?");
    params.push(args.titulo.trim());
  }
  if (args.descripcion !== undefined) {
    sets.push("descripcion = ?");
    params.push(args.descripcion?.trim() || null);
  }
  if (args.fechaLimite !== undefined) {
    sets.push("fecha_limite = ?");
    params.push(args.fechaLimite || null);
  }
  if (args.prioridad !== undefined) {
    sets.push("prioridad = ?");
    params.push(args.prioridad);
  }
  if (sets.length === 0) return;
  params.push(id);
  const pool = getPool();
  await pool.query(`UPDATE tareas SET ${sets.join(", ")} WHERE id = ?`, params);
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

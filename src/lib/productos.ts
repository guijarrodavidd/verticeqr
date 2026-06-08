// Solo SERVIDOR. Capa de BD para productos + categorías de un local.

import { getPool } from "./db";
import type { Categoria, Producto } from "./productos-shared";

export * from "./productos-shared";

let ensured = false;

// Crea las tablas necesarias en el orden correcto por sus FKs:
// locales (debería existir ya, lo creamos en ensureLocalesTable) → categorias → productos.
export async function ensureProductosTables() {
  if (ensured) return;
  const pool = getPool();

  // Aseguramos locales primero (por la FK desde categorias y productos).
  // No mete sobrecarga: si ya existe la query CREATE IF NOT EXISTS es trivial.
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
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INT AUTO_INCREMENT PRIMARY KEY,
      local_id INT NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      orden INT NOT NULL DEFAULT 0,
      activa TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_cat_local (local_id, orden),
      FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      local_id INT NOT NULL,
      categoria_id INT,
      nombre VARCHAR(150) NOT NULL,
      descripcion TEXT,
      precio_cents INT NOT NULL,
      imagen_url VARCHAR(500),
      activo TINYINT(1) NOT NULL DEFAULT 1,
      destacado TINYINT(1) NOT NULL DEFAULT 0,
      orden INT NOT NULL DEFAULT 0,
      alergenos JSON,
      iva_pct DECIMAL(4,2) NOT NULL DEFAULT 10.00,
      stock INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_prod_local_cat (local_id, categoria_id, orden),
      FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
    ) ENGINE=InnoDB
  `);

  ensured = true;
}

function parseAlergenosJson(raw: unknown): string[] | null {
  if (raw == null) return null;
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === "string");
    } catch {
      /* ignore */
    }
  }
  return null;
}

// CATEGORIAS

export async function listarCategorias(local_id: number): Promise<Categoria[]> {
  await ensureProductosTables();
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, local_id, nombre, descripcion, orden, activa, created_at, updated_at
     FROM categorias WHERE local_id = ? ORDER BY orden ASC, nombre ASC`,
    [local_id],
  );
  return rows as Categoria[];
}

export async function crearCategoria(local_id: number, nombre: string): Promise<number> {
  await ensureProductosTables();
  const pool = getPool();
  const [res] = await pool.query(
    `INSERT INTO categorias (local_id, nombre) VALUES (?, ?)`,
    [local_id, nombre.trim()],
  );
  return (res as { insertId: number }).insertId;
}

export async function actualizarCategoria(
  id: number,
  args: { nombre?: string; descripcion?: string | null; orden?: number; activa?: number },
) {
  await ensureProductosTables();
  const sets: string[] = [];
  const params: (string | number | null)[] = [];
  if (args.nombre !== undefined) {
    sets.push("nombre = ?");
    params.push(args.nombre.trim());
  }
  if (args.descripcion !== undefined) {
    sets.push("descripcion = ?");
    params.push(args.descripcion?.trim() || null);
  }
  if (args.orden !== undefined) {
    sets.push("orden = ?");
    params.push(args.orden);
  }
  if (args.activa !== undefined) {
    sets.push("activa = ?");
    params.push(args.activa);
  }
  if (sets.length === 0) return;
  params.push(id);
  const pool = getPool();
  await pool.query(`UPDATE categorias SET ${sets.join(", ")} WHERE id = ?`, params);
}

export async function borrarCategoria(id: number) {
  await ensureProductosTables();
  const pool = getPool();
  await pool.query("DELETE FROM categorias WHERE id = ?", [id]);
}

// PRODUCTOS

export async function listarProductos(local_id: number): Promise<Producto[]> {
  await ensureProductosTables();
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT id, local_id, categoria_id, nombre, descripcion, precio_cents, imagen_url,
            activo, destacado, orden, alergenos, iva_pct, stock, created_at, updated_at
     FROM productos
     WHERE local_id = ?
     ORDER BY destacado DESC, activo DESC, categoria_id ASC, orden ASC, nombre ASC`,
    [local_id],
  );
  return (rows as Array<Omit<Producto, "alergenos"> & { alergenos: unknown }>).map((r) => ({
    ...r,
    alergenos: parseAlergenosJson(r.alergenos),
    iva_pct: Number(r.iva_pct),
  }));
}

export async function crearProducto(args: {
  local_id: number;
  categoria_id?: number | null;
  nombre: string;
  descripcion?: string | null;
  precio_cents: number;
  imagen_url?: string | null;
  destacado?: number;
  alergenos?: string[] | null;
  iva_pct?: number;
  stock?: number | null;
}): Promise<number> {
  await ensureProductosTables();
  const pool = getPool();
  const [res] = await pool.query(
    `INSERT INTO productos
       (local_id, categoria_id, nombre, descripcion, precio_cents, imagen_url, destacado, alergenos, iva_pct, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      args.local_id,
      args.categoria_id ?? null,
      args.nombre.trim(),
      args.descripcion?.trim() || null,
      args.precio_cents,
      args.imagen_url?.trim() || null,
      args.destacado ?? 0,
      args.alergenos && args.alergenos.length > 0 ? JSON.stringify(args.alergenos) : null,
      args.iva_pct ?? 10,
      args.stock ?? null,
    ],
  );
  return (res as { insertId: number }).insertId;
}

export async function actualizarProducto(
  id: number,
  args: Partial<{
    categoria_id: number | null;
    nombre: string;
    descripcion: string | null;
    precio_cents: number;
    imagen_url: string | null;
    activo: number;
    destacado: number;
    orden: number;
    alergenos: string[] | null;
    iva_pct: number;
    stock: number | null;
  }>,
) {
  await ensureProductosTables();
  const sets: string[] = [];
  const params: (string | number | null)[] = [];

  if (args.categoria_id !== undefined) {
    sets.push("categoria_id = ?");
    params.push(args.categoria_id);
  }
  if (args.nombre !== undefined) {
    sets.push("nombre = ?");
    params.push(args.nombre.trim());
  }
  if (args.descripcion !== undefined) {
    sets.push("descripcion = ?");
    params.push(args.descripcion?.trim() || null);
  }
  if (args.precio_cents !== undefined) {
    sets.push("precio_cents = ?");
    params.push(args.precio_cents);
  }
  if (args.imagen_url !== undefined) {
    sets.push("imagen_url = ?");
    params.push(args.imagen_url?.trim() || null);
  }
  if (args.activo !== undefined) {
    sets.push("activo = ?");
    params.push(args.activo);
  }
  if (args.destacado !== undefined) {
    sets.push("destacado = ?");
    params.push(args.destacado);
  }
  if (args.orden !== undefined) {
    sets.push("orden = ?");
    params.push(args.orden);
  }
  if (args.alergenos !== undefined) {
    sets.push("alergenos = ?");
    params.push(args.alergenos && args.alergenos.length > 0 ? JSON.stringify(args.alergenos) : null);
  }
  if (args.iva_pct !== undefined) {
    sets.push("iva_pct = ?");
    params.push(args.iva_pct);
  }
  if (args.stock !== undefined) {
    sets.push("stock = ?");
    params.push(args.stock);
  }

  if (sets.length === 0) return;
  params.push(id);
  const pool = getPool();
  await pool.query(`UPDATE productos SET ${sets.join(", ")} WHERE id = ?`, params);
}

export async function toggleActivoProducto(id: number) {
  await ensureProductosTables();
  const pool = getPool();
  await pool.query("UPDATE productos SET activo = 1 - activo WHERE id = ?", [id]);
}

export async function toggleDestacadoProducto(id: number) {
  await ensureProductosTables();
  const pool = getPool();
  await pool.query("UPDATE productos SET destacado = 1 - destacado WHERE id = ?", [id]);
}

export async function borrarProducto(id: number) {
  await ensureProductosTables();
  const pool = getPool();
  await pool.query("DELETE FROM productos WHERE id = ?", [id]);
}

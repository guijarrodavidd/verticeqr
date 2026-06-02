import { getPool } from "@/lib/db";

// Esquema completo de VerticeQR. SaaS multitenant para hostelería: cada
// local es un tenant que gestiona sus propias mesas, productos y pedidos.
//
// Diseño:
// - Todas las tablas "owned by local" llevan local_id FK con ON DELETE CASCADE
//   → borrar un local borra todo lo suyo en cascada.
// - Precios en céntimos (INT) para evitar floats.
// - Pedido_items guarda SNAPSHOT (nombre, precio) — si el producto se borra
//   o cambia, el histórico de pedidos queda íntegro.
// - InnoDB explícito en todas para garantizar FKs (debería ser el default
//   en MySQL moderno, pero más vale curarse en salud).
//
// El runner es idempotente: CREATE TABLE IF NOT EXISTS y caché en memoria
// del proceso para que solo se intente una vez por instancia.

const STATEMENTS: { name: string; sql: string }[] = [
  {
    name: "locales",
    sql: `
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
    `,
  },
  {
    name: "usuarios",
    sql: `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        nombre VARCHAR(150) NOT NULL,
        rol_global VARCHAR(20) NOT NULL DEFAULT 'user',
        activo TINYINT(1) NOT NULL DEFAULT 1,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `,
  },
  {
    name: "usuarios_locales",
    sql: `
      CREATE TABLE IF NOT EXISTS usuarios_locales (
        usuario_id INT NOT NULL,
        local_id INT NOT NULL,
        rol VARCHAR(20) NOT NULL DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (usuario_id, local_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `,
  },
  {
    name: "mesas",
    sql: `
      CREATE TABLE IF NOT EXISTS mesas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        local_id INT NOT NULL,
        identificador VARCHAR(50) NOT NULL,
        slug VARCHAR(80) NOT NULL,
        zona VARCHAR(50),
        capacidad INT,
        activa TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_mesa_slug (local_id, slug),
        FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `,
  },
  {
    name: "categorias",
    sql: `
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
    `,
  },
  {
    name: "productos",
    sql: `
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
    `,
  },
  {
    name: "modificadores",
    sql: `
      CREATE TABLE IF NOT EXISTS modificadores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        local_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        tipo VARCHAR(20) NOT NULL DEFAULT 'opcion',
        precio_extra_cents INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `,
  },
  {
    name: "productos_modificadores",
    sql: `
      CREATE TABLE IF NOT EXISTS productos_modificadores (
        producto_id INT NOT NULL,
        modificador_id INT NOT NULL,
        PRIMARY KEY (producto_id, modificador_id),
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
        FOREIGN KEY (modificador_id) REFERENCES modificadores(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `,
  },
  {
    name: "pedidos",
    sql: `
      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        local_id INT NOT NULL,
        mesa_id INT NOT NULL,
        numero VARCHAR(30) NOT NULL,
        estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
        total_cents INT NOT NULL DEFAULT 0,
        notas TEXT,
        cliente_nombre VARCHAR(100),
        metodo_pago VARCHAR(30),
        pagado_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_pedido_numero (local_id, numero),
        INDEX idx_pedido_estado (local_id, estado, created_at),
        FOREIGN KEY (local_id) REFERENCES locales(id) ON DELETE CASCADE,
        FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB
    `,
  },
  {
    name: "pedido_items",
    sql: `
      CREATE TABLE IF NOT EXISTS pedido_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pedido_id INT NOT NULL,
        producto_id INT,
        producto_nombre VARCHAR(150) NOT NULL,
        precio_unitario_cents INT NOT NULL,
        cantidad INT NOT NULL DEFAULT 1,
        modificadores JSON,
        notas TEXT,
        subtotal_cents INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_items_pedido (pedido_id),
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `,
  },
];

let schemaEnsured = false;

export async function ensureSchema(): Promise<{
  ok: boolean;
  applied: string[];
  error?: string;
}> {
  if (schemaEnsured) return { ok: true, applied: [] };
  const pool = getPool();
  const applied: string[] = [];
  try {
    for (const stmt of STATEMENTS) {
      await pool.query(stmt.sql);
      applied.push(stmt.name);
    }
    schemaEnsured = true;
    return { ok: true, applied };
  } catch (e) {
    return {
      ok: false,
      applied,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

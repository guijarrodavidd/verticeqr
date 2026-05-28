import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const MIGRATIONS_DIR = path.join(process.cwd(), "db", "migrations");

async function openConn() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Necesario para que las migraciones puedan tener varias sentencias en un mismo archivo.
    multipleStatements: true,
  });
}

export async function applyPendingMigrations(): Promise<
  { applied: string[]; skipped: string[] }
> {
  const conn = await openConn();
  try {
    await conn.query(
      `CREATE TABLE IF NOT EXISTS _migrations (
         name VARCHAR(255) PRIMARY KEY,
         applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
       )`,
    );

    const [rows] = await conn.query("SELECT name FROM _migrations");
    const appliedNames = new Set((rows as { name: string }[]).map((r) => r.name));

    let files: string[];
    try {
      files = (await readdir(MIGRATIONS_DIR))
        .filter((f) => f.endsWith(".sql"))
        .sort();
    } catch (e) {
      console.warn("[migrations] No se pudo leer", MIGRATIONS_DIR, e);
      return { applied: [], skipped: [] };
    }

    const applied: string[] = [];
    const skipped: string[] = [];

    for (const file of files) {
      if (appliedNames.has(file)) {
        skipped.push(file);
        continue;
      }
      const sql = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");
      console.log(`[migrations] Aplicando ${file}`);
      try {
        await conn.beginTransaction();
        await conn.query(sql);
        await conn.query("INSERT INTO _migrations (name) VALUES (?)", [file]);
        await conn.commit();
        applied.push(file);
        console.log(`[migrations]   OK ${file}`);
      } catch (e) {
        await conn.rollback();
        console.error(`[migrations]   FALLO ${file}`, e);
        throw e;
      }
    }

    if (applied.length === 0) {
      console.log("[migrations] Nada pendiente");
    }
    return { applied, skipped };
  } finally {
    await conn.end();
  }
}

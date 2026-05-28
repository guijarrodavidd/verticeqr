import mysql from "mysql2/promise";
import { migrations } from "../../db/migrations";

async function openConn() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Necesario para que una migración pueda contener varias sentencias.
    multipleStatements: true,
    connectTimeout: 10_000,
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

    const applied: string[] = [];
    const skipped: string[] = [];

    for (const { name, sql } of migrations) {
      if (appliedNames.has(name)) {
        skipped.push(name);
        continue;
      }
      console.log(`[migrations] Aplicando ${name}`);
      try {
        await conn.beginTransaction();
        await conn.query(sql);
        await conn.query("INSERT INTO _migrations (name) VALUES (?)", [name]);
        await conn.commit();
        applied.push(name);
        console.log(`[migrations]   OK ${name}`);
      } catch (e) {
        await conn.rollback();
        console.error(`[migrations]   FALLO ${name}`, e);
        throw e;
      }
    }

    if (applied.length === 0) {
      console.log(`[migrations] Nada pendiente (saltadas: ${skipped.length})`);
    }
    return { applied, skipped };
  } finally {
    await conn.end();
  }
}

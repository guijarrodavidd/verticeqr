// Registro de migraciones. Embedidas en código para que el runner no dependa
// de leer ficheros .sql en runtime (lo cual da problemas en builds standalone
// que no copian todos los assets).
//
// Para añadir una migración nueva:
//   1) Crea una constante exportada con el SQL.
//   2) Añádela al array `migrations` ABAJO, en orden y SIN reordenar las anteriores.
//   3) `git push` → se aplica automáticamente al arrancar el servidor.

export const m001_add_david_cavani = `
INSERT INTO prueba (mensaje) VALUES ('David y Cavani');
`;

export type Migration = { name: string; sql: string };

export const migrations: Migration[] = [
  { name: "001_add_david_cavani", sql: m001_add_david_cavani },
];

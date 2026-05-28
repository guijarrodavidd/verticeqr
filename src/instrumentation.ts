// Next.js ejecuta `register()` UNA VEZ al arrancar el servidor.
// Lo usamos para aplicar las migraciones pendientes contra la BD.
// IMPORTANTE: nada de lo que pase aquí debe poder tumbar el arranque del
// servidor. Por eso todo va en try/catch y con un timeout de seguridad,
// y los errores quedan en consola para revisarlos en los logs de Hostinger.

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { applyPendingMigrations } = await import("./lib/migrations");

    // Timeout de 20s: si la conexión a la BD se cuelga, no bloqueamos
    // el arranque del servidor (Hostinger lo marcaría como down).
    const result = await Promise.race([
      applyPendingMigrations(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("migrations timeout (20s)")), 20_000),
      ),
    ]);
    console.log("[instrumentation] migraciones:", result);
  } catch (e) {
    console.error(
      "[instrumentation] Fallo aplicando migraciones (la app sigue arrancando):",
      e,
    );
  }
}

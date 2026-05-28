// Hook que Next.js ejecuta UNA VEZ al arrancar el servidor.
// Lo usamos para aplicar las migraciones pendientes contra la base de datos
// antes de que la app empiece a atender peticiones.

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { applyPendingMigrations } = await import("@/lib/migrations");
  try {
    await applyPendingMigrations();
  } catch (e) {
    // No tumbamos la app si una migración falla: la app sigue sirviendo lo que pueda
    // y el error queda en logs para investigarlo desde el panel de Hostinger.
    console.error("[instrumentation] Fallo aplicando migraciones:", e);
  }
}

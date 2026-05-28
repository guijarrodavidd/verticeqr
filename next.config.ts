import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mysql2 es un paquete de servidor: lo dejamos fuera del bundle del cliente.
  serverExternalPackages: ["mysql2"],
  // Asegura que los .sql de db/migrations/ se copien al build standalone para que
  // el runner pueda leerlos en producción.
  outputFileTracingIncludes: {
    "/": ["./db/migrations/*.sql"],
  },
};

export default nextConfig;

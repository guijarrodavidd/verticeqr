import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mysql2 es un paquete de servidor: lo dejamos fuera del bundle del cliente.
  serverExternalPackages: ["mysql2"],
  // URL limpia para la calculadora estática (public/calculadora/index.html)
  async rewrites() {
    return [{ source: "/calculadora", destination: "/calculadora/index.html" }];
  },
};

export default nextConfig;

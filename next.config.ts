import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mysql2 es un paquete de servidor: lo dejamos fuera del bundle del cliente.
  serverExternalPackages: ["mysql2"],
  // URLs limpias para las herramientas estáticas (public/<x>/index.html)
  async rewrites() {
    return [
      { source: "/calculadora", destination: "/calculadora/index.html" },
      { source: "/diagnostico", destination: "/diagnostico/index.html" },
    ];
  },
};

export default nextConfig;

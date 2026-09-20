import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mysql2 es un paquete de servidor: lo dejamos fuera del bundle del cliente.
  serverExternalPackages: ["mysql2"],
  // URLs limpias para las herramientas estáticas (public/<x>/index.html)
  async rewrites() {
    return [
      { source: "/calculadora", destination: "/calculadora/index.html" },
      { source: "/diagnostico", destination: "/diagnostico/index.html" },
      { source: "/lienzo", destination: "/lienzo/index.html" },
    ];
  },
  async redirects() {
    return [
      { source: "/auditoria", destination: "/auditoria/index.html", permanent: false },
      { source: "/auditoria-rs", destination: "/auditoria-room-service/index.html", permanent: false },
      { source: "/auditoria-room-service", destination: "/auditoria-room-service/index.html", permanent: false },
      { source: "/mapa", destination: "/mapa/index.html", permanent: false },
    ];
  },
};

export default nextConfig;

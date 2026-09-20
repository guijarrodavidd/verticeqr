import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mysql2 es un paquete de servidor: lo dejamos fuera del bundle del cliente.
  serverExternalPackages: ["mysql2"],
  // URLs limpias para las herramientas estáticas (public/<x>/index.html)
  async rewrites() {
    return [
      { source: "/calculadora", destination: "/calculadora/index.html" },
      { source: "/diagnostico", destination: "/diagnostico/index.html" },
      { source: "/auditoria", destination: "/auditoria/index.html" },
      { source: "/auditoria/", destination: "/auditoria/index.html" },
      { source: "/auditoria-room-service", destination: "/auditoria-room-service/index.html" },
      { source: "/auditoria-room-service/", destination: "/auditoria-room-service/index.html" },
      // alias corto, más fácil de mandar por privado
      { source: "/auditoria-rs", destination: "/auditoria-room-service/index.html" },
      { source: "/mapa", destination: "/mapa/index.html" },
      { source: "/mapa/", destination: "/mapa/index.html" },
      { source: "/lienzo", destination: "/lienzo/index.html" },
    ];
  },
};

export default nextConfig;

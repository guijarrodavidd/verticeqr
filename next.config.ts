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
      { source: "/agentes", destination: "/agentes/index.html" },
      { source: "/kits", destination: "/kits/index.html" },
      { source: "/prompts", destination: "/prompts/index.html" },
      { source: "/recepcionista", destination: "/recepcionista/index.html" },
    ];
  },
  async redirects() {
    return [
      { source: "/auditoria", destination: "/auditoria/index.html", permanent: false },
      { source: "/auditoria-rs", destination: "/auditoria-room-service/index.html", permanent: false },
      { source: "/auditoria-room-service", destination: "/auditoria-room-service/index.html", permanent: false },
      { source: "/mapa", destination: "/mapa/index.html", permanent: false },
      { source: "/biblioteca", destination: "/biblioteca/index.html", permanent: false },
    ];
  },
};

export default nextConfig;

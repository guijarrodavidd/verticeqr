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
      { source: "/claude", destination: "/claude/index.html" },
      // Los 7 recursos de los posts del 17 de octubre.
      { source: "/cerebro", destination: "/cerebro/index.html" },
      { source: "/50-prompts", destination: "/50-prompts/index.html" },
      { source: "/equipo", destination: "/equipo/index.html" },
      { source: "/15-prompts", destination: "/15-prompts/index.html" },
      { source: "/ventas", destination: "/ventas/index.html" },
      { source: "/asistentes", destination: "/asistentes/index.html" },
      { source: "/nivel", destination: "/nivel/index.html" },
      // Demo privada de la carta de Casa Román (app Angular): cualquier ruta
      // dentro de la demo la resuelve su index.html. Sin enlazar desde la web.
      { source: "/d/casaroman-v7k2/:path*", destination: "/d/casaroman-v7k2/index.html" },
      { source: "/d/indigo-7c41/:path*", destination: "/d/indigo-7c41/index.html" },
      { source: "/d/nooe-a332/:path*", destination: "/d/nooe-a332/index.html" },
      { source: "/d/sheraton-5e38/:path*", destination: "/d/sheraton-5e38/index.html" },
      { source: "/d/uman-a055/:path*", destination: "/d/uman-a055/index.html" },
      { source: "/d/aldea-07ac/:path*", destination: "/d/aldea-07ac/index.html" },
      { source: "/d/hovima-d1be/:path*", destination: "/d/hovima-d1be/index.html" },
      { source: "/d/ananda-4260/:path*", destination: "/d/ananda-4260/index.html" },
      { source: "/d/stella-5f22/:path*", destination: "/d/stella-5f22/index.html" },
      { source: "/d/bordeluz-89c9/:path*", destination: "/d/bordeluz-89c9/index.html" },
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

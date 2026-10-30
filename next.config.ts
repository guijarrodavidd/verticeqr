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
      { source: "/gm", destination: "/gm/index.html" },
      // Demo privada de la carta de Casa Román (app Angular): cualquier ruta
      // dentro de la demo la resuelve su index.html. Sin enlazar desde la web.
      { source: "/d/casaroman-v7k2/:path*", destination: "/d/casaroman-v7k2/index.html" },
      { source: "/d/indigo-7c41/:path*", destination: "/d/indigo-7c41/index.html" },
      { source: "/d/nooe-a332/:path*", destination: "/d/nooe-a332/index.html" },
      { source: "/d/sheraton-5e38/:path*", destination: "/d/sheraton-5e38/index.html" },
      { source: "/d/fiestainn-aec3/:path*", destination: "/d/fiestainn-aec3/index.html" },
      { source: "/d/carris-a793/:path*", destination: "/d/carris-a793/index.html" },
      { source: "/d/decapolis-d386/:path*", destination: "/d/decapolis-d386/index.html" },
      { source: "/d/megapolis-02dd/:path*", destination: "/d/megapolis-02dd/index.html" },
      { source: "/d/rosehall-61f7/:path*", destination: "/d/rosehall-61f7/index.html" },
      { source: "/d/quintaeden-e58f/:path*", destination: "/d/quintaeden-e58f/index.html" },
      { source: "/d/vibra-d5e4/:path*", destination: "/d/vibra-d5e4/index.html" },
      { source: "/d/mayan-4c74/:path*", destination: "/d/mayan-4c74/index.html" },
      { source: "/d/dreams-711d/:path*", destination: "/d/dreams-711d/index.html" },
      { source: "/d/presidente-cc35/:path*", destination: "/d/presidente-cc35/index.html" },
      { source: "/d/izaga-ca5b/:path*", destination: "/d/izaga-ca5b/index.html" },
      { source: "/d/amic-b801/:path*", destination: "/d/amic-b801/index.html" },
      { source: "/d/panel-2819/:path*", destination: "/d/panel-2819/index.html" },
      { source: "/d/plazaelbosque-fb94/:path*", destination: "/d/plazaelbosque-fb94/index.html" },
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

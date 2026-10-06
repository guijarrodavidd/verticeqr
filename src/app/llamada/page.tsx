import type { Metadata } from "next";
import { CALENDLY_URL } from "@/lib/site";

// Enlace corto para la llamada de diagnóstico: LinkedIn no consigue leer la
// vista previa de Calendly, así que el enlace destacado apunta aquí. La página
// lleva su propia portada (opengraph-image.tsx) y manda al Calendly al abrirla.

const title = "Llamada de diagnóstico — Vértice";
const description = "30 minutos con Héctor García. Vemos dónde se le escapa la venta a tu hotel.";

export const metadata: Metadata = {
  metadataBase: new URL("https://verticeqr.com"),
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { title, description, type: "website", siteName: "Vértice", url: "/llamada" },
  twitter: { card: "summary_large_image", title, description },
};

export default function Llamada() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#111", color: "#f4f4f2", fontFamily: "Manrope, system-ui, sans-serif", padding: 24, textAlign: "center" }}>
      <meta httpEquiv="refresh" content={`0;url=${CALENDLY_URL}`} />
      <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(CALENDLY_URL)})` }} />
      <p>
        Abriendo la agenda… <a href={CALENDLY_URL} style={{ color: "#fff" }}>Si no se abre, pulsa aquí</a>.
      </p>
    </main>
  );
}

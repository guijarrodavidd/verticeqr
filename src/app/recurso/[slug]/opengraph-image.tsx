import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getRecurso } from "@/lib/recursos";

// Portada que sale al pegar el enlace del recurso en LinkedIn, WhatsApp o un
// email: título del recurso con la marca Vértice y el Método Fricción 0.

export const alt = "Recurso gratuito de Vértice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recurso = getRecurso(slug);
  const titulo = recurso?.titulo ?? "Recurso gratuito";
  const etiqueta = recurso?.etiqueta ?? "Recurso gratuito";

  const logo = await readFile(join(process.cwd(), "public/vertice-wordmark-light.png"));
  const fonts = join(process.cwd(), "src/app/recurso/fonts");
  const [manrope800, manrope500] = await Promise.all([
    readFile(join(fonts, "Manrope-800.ttf")),
    readFile(join(fonts, "Manrope-500.ttf")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(180deg, #161616 0%, #0b0b0b 100%)",
          color: "#f4f4f2",
          fontFamily: "Manrope",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} height={44} alt="" />
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 4,
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            MÉTODO FRICCIÓN 0
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 5,
              color: "#b9b9b4",
              marginBottom: 22,
              textTransform: "uppercase",
            }}
          >
            {etiqueta}
          </div>
          <div style={{ display: "flex", fontSize: titulo.length > 32 ? 76 : 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
            {titulo}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: "#b9b9b4" }}>Más ingreso por huésped, sin sumar personal</div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 800,
              color: "#111111",
              background: "#ffffff",
              borderRadius: 999,
              padding: "14px 28px",
            }}
          >
            Obtener recurso →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: manrope800, weight: 800, style: "normal" },
        { name: "Manrope", data: manrope500, weight: 500, style: "normal" },
      ],
    },
  );
}

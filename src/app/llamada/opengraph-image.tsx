import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Portada del enlace destacado de LinkedIn para la llamada de diagnóstico.

export const alt = "Llamada de diagnóstico con Vértice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          <div style={{ display: "flex", fontSize: 20, fontWeight: 800, letterSpacing: 4, color: "#b9b9b4" }}>MÉTODO FRICCIÓN 0 · PARA HOTELES</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>LLAMADA DE</div>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>DIAGNÓSTICO</div>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 500, marginTop: 26 }}>Vemos dónde se le escapa la venta a tu hotel.</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 500, color: "#b9b9b4" }}>30 min · con tu caso · sin compromiso</div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 800, color: "#111111", background: "#ffffff", borderRadius: 999, padding: "14px 28px" }}>
            Reservar llamada →
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

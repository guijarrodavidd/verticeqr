"use client";

// Móvil con carta REAL embebida (iframe) + QR flotante + etiqueta "Pruébala".
// Replica el HeroPhone de la landing pero auto-contenido (sin depender del
// CSS module de la landing), para que viva dentro del panel interno.
export default function DemoPhone({
  cartaUrl,
  qrUrl = "/qr-hero.png",
  accent = "#9a1f2b",
  badge = "Pruébala",
  warning,
}: {
  cartaUrl: string;
  qrUrl?: string;
  accent?: string;
  badge?: string;
  warning?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 280,
        margin: "0 auto",
      }}
    >
      {/* Marco del móvil — el bezel oscuro */}
      <div
        style={{
          background: "#221b13",
          borderRadius: 40,
          padding: 10,
          boxShadow:
            "0 40px 90px -40px rgba(34,27,19,0.55), 0 0 0 1px rgba(34,27,19,0.06)",
          aspectRatio: "9 / 19.5",
        }}
      >
        {/* Pantalla con la carta real escalada */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: "#0a0a0c",
            borderRadius: 32,
            overflow: "hidden",
          }}
        >
          <iframe
            src={cartaUrl}
            title="Carta digital del local"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 390,
              height: 828,
              border: 0,
              display: "block",
              background: "#0a0a0c",
              transform: "scale(0.667)",
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>

      {/* QR flotante a la derecha del móvil */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: -28,
          top: 24,
          width: 80,
          height: 80,
          background: "#fff",
          borderRadius: 14,
          padding: 7,
          boxShadow: "0 18px 50px -20px rgba(34,27,19,0.42)",
          border: "1px solid #e7dcc7",
          transform: "rotate(6deg)",
          zIndex: 3,
          pointerEvents: "none",
          animation: "demoQrFloat 4.6s ease-in-out infinite",
        }}
      >
        <img
          src={qrUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 6,
            display: "block",
          }}
        />
      </div>

      {/* Etiqueta "Pruébala" debajo */}
      <div
        style={{
          position: "absolute",
          bottom: -16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          whiteSpace: "nowrap",
          background: "#fffdf8",
          color: "#221b13",
          border: "1px solid #e7dcc7",
          fontWeight: 600,
          fontSize: "0.74rem",
          letterSpacing: "0.01em",
          padding: "0.38rem 0.78rem",
          borderRadius: 999,
          boxShadow: "0 2px 10px rgba(83,60,30,0.06)",
          zIndex: 4,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 0 0 ${accent}80`,
            animation: "demoBadgePulse 1.8s ease-out infinite",
          }}
        />
        {badge}
      </div>

      {/* Aviso opcional (ej. "usando carta tipo X como muestra") */}
      {warning && (
        <div
          style={{
            marginTop: "2rem",
            fontSize: "0.75rem",
            color: "#a89e88",
            textAlign: "center",
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          {warning}
        </div>
      )}

      <style>{`
        @keyframes demoQrFloat {
          0%, 100% { transform: rotate(6deg) translateY(0); }
          50%      { transform: rotate(6deg) translateY(-7px); }
        }
        @keyframes demoBadgePulse {
          0%   { box-shadow: 0 0 0 0 ${accent}73; }
          70%  { box-shadow: 0 0 0 7px ${accent}00; }
          100% { box-shadow: 0 0 0 0 ${accent}00; }
        }
      `}</style>
    </div>
  );
}

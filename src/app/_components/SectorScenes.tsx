// Escenas SVG por sector que viven en el fondo de cada tarjeta de demo.
// Cada una se anima permanentemente (always-on) y se intensifica en hover
// (el hover lo controla el .demoCard con :hover en CSS del módulo de la
// landing).

import styles from "../landing.module.css";

export function DiscoBallScene() {
  return (
    <div className={styles.scene}>
      {/* Rayos de luz que rotan detrás de la bola */}
      <div className={styles.discoBeams} />

      {/* Bola facetada */}
      <svg viewBox="0 0 100 100" className={styles.discoBall} aria-hidden>
        <defs>
          <radialGradient id="db-sphere" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#dcdce6" />
            <stop offset="80%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#2a2a3a" />
          </radialGradient>
          <pattern
            id="db-facets"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect width="10" height="10" fill="none" stroke="rgba(0,0,0,0.22)" />
          </pattern>
          <radialGradient id="db-highlight" cx="30%" cy="25%" r="20%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill="url(#db-sphere)" />
        <circle cx="50" cy="50" r="38" fill="url(#db-facets)" opacity="0.55" />
        <circle cx="50" cy="50" r="38" fill="url(#db-highlight)" />
      </svg>

      {/* Cuerda */}
      <span className={styles.discoCable} />

      {/* Chispas de luz que titilan en posiciones distintas */}
      <span className={`${styles.spark} ${styles.spark1}`} style={{ background: "#f472b6" }} />
      <span className={`${styles.spark} ${styles.spark2}`} style={{ background: "#60a5fa" }} />
      <span className={`${styles.spark} ${styles.spark3}`} style={{ background: "#fbbf24" }} />
      <span className={`${styles.spark} ${styles.spark4}`} style={{ background: "#4ade80" }} />
      <span className={`${styles.spark} ${styles.spark5}`} style={{ background: "#a78bfa" }} />
    </div>
  );
}

export function ShishaScene() {
  return (
    <div className={styles.scene}>
      {/* Tres puffs de humo subiendo con desfase */}
      <span className={`${styles.smoke} ${styles.smoke1}`} />
      <span className={`${styles.smoke} ${styles.smoke2}`} />
      <span className={`${styles.smoke} ${styles.smoke3}`} />

      <svg viewBox="0 0 80 110" className={styles.shisha} aria-hidden>
        <defs>
          <linearGradient id="shisha-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5b21b6" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="shisha-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
        </defs>
        {/* Plato base */}
        <ellipse cx="40" cy="98" rx="22" ry="3" fill="url(#shisha-metal)" />
        {/* Vaso de cristal con "líquido" */}
        <path
          d="M 26 95 Q 22 70 30 60 L 50 60 Q 58 70 54 95 Z"
          fill="url(#shisha-glass)"
          stroke="rgba(167,139,250,0.45)"
          strokeWidth="0.8"
        />
        <ellipse cx="40" cy="80" rx="13" ry="4" fill="rgba(167,139,250,0.35)" />
        {/* Cuello metálico */}
        <rect x="36" y="40" width="8" height="22" rx="2" fill="url(#shisha-metal)" />
        {/* Cazoleta */}
        <ellipse cx="40" cy="38" rx="14" ry="5" fill="url(#shisha-metal)" />
        <path
          d="M 28 38 Q 32 26 40 26 Q 48 26 52 38 Z"
          fill="#3a3a4a"
          stroke="url(#shisha-metal)"
          strokeWidth="0.8"
        />
        {/* Carbón rojizo brillando */}
        <ellipse cx="40" cy="30" rx="7" ry="2.5" fill="#f87171">
          <animate
            attributeName="opacity"
            values="0.55;1;0.55"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Manguera saliendo en S */}
        <path
          d="M 56 50 Q 70 56 64 70 Q 56 84 70 90"
          fill="none"
          stroke="rgba(167,139,250,0.55)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function GlassesScene() {
  return (
    <div className={styles.scene}>
      <svg viewBox="0 0 60 90" className={`${styles.glass} ${styles.glassLeft}`} aria-hidden>
        <defs>
          <linearGradient id="g-left-liq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>
        </defs>
        {/* Triángulo (copa martini), pie y base */}
        <path
          d="M 8 10 L 52 10 L 30 48 Z"
          fill="rgba(244,114,182,0.18)"
          stroke="rgba(244,114,182,0.7)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M 14 12 L 46 12 L 30 40 Z"
          fill="url(#g-left-liq)"
          opacity="0.85"
        />
        {/* Aceituna */}
        <circle cx="30" cy="22" r="2.2" fill="#3a3a4a" />
        <rect x="29" y="9" width="0.8" height="6" fill="#6b7280" />
        {/* Pie y base */}
        <line x1="30" y1="48" x2="30" y2="80" stroke="rgba(244,114,182,0.7)" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="30" cy="82" rx="12" ry="2.4" fill="rgba(244,114,182,0.65)" />
      </svg>

      <svg viewBox="0 0 60 90" className={`${styles.glass} ${styles.glassRight}`} aria-hidden>
        <defs>
          <linearGradient id="g-right-liq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
        </defs>
        <path
          d="M 8 10 L 52 10 L 30 48 Z"
          fill="rgba(167,139,250,0.18)"
          stroke="rgba(167,139,250,0.7)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M 14 12 L 46 12 L 30 40 Z"
          fill="url(#g-right-liq)"
          opacity="0.85"
        />
        <circle cx="30" cy="22" r="2.2" fill="#fbbf24" />
        <rect x="29" y="9" width="0.8" height="6" fill="#6b7280" />
        <line x1="30" y1="48" x2="30" y2="80" stroke="rgba(167,139,250,0.7)" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="30" cy="82" rx="12" ry="2.4" fill="rgba(167,139,250,0.65)" />
      </svg>

      {/* Chispas en el punto de choque */}
      <span className={`${styles.clinkSpark} ${styles.clinkSpark1}`} />
      <span className={`${styles.clinkSpark} ${styles.clinkSpark2}`} />
      <span className={`${styles.clinkSpark} ${styles.clinkSpark3}`} />
    </div>
  );
}

// Para los sectores restantes usamos emoji animado por CSS (suficientemente
// rico, no necesita SVG dedicado).
export function EmojiScene({ glyph }: { glyph: string }) {
  return (
    <span className={styles.demoBg} aria-hidden>
      {glyph}
    </span>
  );
}

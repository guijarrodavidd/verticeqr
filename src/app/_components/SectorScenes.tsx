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

// Cervecería: dos jarras de cerveza espumosas haciendo chin-chin.
export function BeerMugsScene() {
  return (
    <div className={styles.scene}>
      <BeerMug side="left" />
      <BeerMug side="right" />
      {/* Salpicaduras de espuma al chocar */}
      <span className={`${styles.foamSpark} ${styles.foamSpark1}`} />
      <span className={`${styles.foamSpark} ${styles.foamSpark2}`} />
      <span className={`${styles.foamSpark} ${styles.foamSpark3}`} />
      <span className={`${styles.foamSpark} ${styles.foamSpark4}`} />
      <span className={`${styles.foamSpark} ${styles.foamSpark5}`} />
    </div>
  );
}

function BeerMug({ side }: { side: "left" | "right" }) {
  const cls = `${styles.beerMug} ${side === "left" ? styles.beerMugLeft : styles.beerMugRight}`;
  const flip = side === "right";
  return (
    <svg viewBox="0 0 70 100" className={cls} aria-hidden>
      <defs>
        <linearGradient id={`beer-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <g transform={flip ? "translate(70 0) scale(-1 1)" : undefined}>
        {/* Cuerpo de la jarra */}
        <rect x="14" y="32" width="34" height="58" rx="2" fill={`url(#beer-${side})`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        {/* Asa */}
        <path
          d="M 48 42 Q 64 50 60 65 Q 56 78 48 76"
          fill="none"
          stroke="#fcd34d"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Espuma — domo en la parte superior, sobrepasando */}
        <ellipse cx="31" cy="32" rx="18" ry="8" fill="#fff" />
        <ellipse cx="22" cy="28" rx="6" ry="4" fill="#fff" />
        <ellipse cx="38" cy="27" rx="5" ry="3.5" fill="#fff" />
        <ellipse cx="44" cy="32" rx="4" ry="3" fill="#fff" />
        <ellipse cx="18" cy="33" rx="3.5" ry="2.5" fill="#fff" />
        {/* Goterón derramándose por el borde */}
        <path d="M 14 33 Q 12 38 14 42" fill="#fff" />
        {/* Burbujas dentro de la cerveza */}
        <circle cx="22" cy="55" r="1.8" fill="#fff" opacity="0.65">
          <animate attributeName="cy" values="80;40" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="65" r="1.4" fill="#fff" opacity="0.5">
          <animate attributeName="cy" values="80;38" dur="3.2s" begin="0.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur="3.2s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="38" cy="58" r="1.2" fill="#fff" opacity="0.4">
          <animate attributeName="cy" values="80;40" dur="2.4s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur="2.4s" begin="1s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

// Hotel: campana de recepción con un dedo que la pulsa rítmicamente.
export function HotelBellScene() {
  return (
    <div className={styles.scene}>
      {/* Dedo que baja, pulsa, y vuelve */}
      <svg viewBox="0 0 60 80" className={styles.finger} aria-hidden>
        <defs>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f9a8d4" />
          </linearGradient>
        </defs>
        {/* Dedo índice estilizado: óvalo alargado con punta más clara */}
        <path
          d="M 22 8 Q 22 0 30 0 Q 38 0 38 8 L 38 56 Q 38 64 30 64 Q 22 64 22 56 Z"
          fill="url(#skin)"
          stroke="#be185d"
          strokeOpacity="0.25"
          strokeWidth="0.8"
        />
        {/* Uña */}
        <ellipse cx="30" cy="8" rx="5" ry="3" fill="#fff" opacity="0.7" />
        {/* Línea del nudillo */}
        <path d="M 23 30 Q 30 32 37 30" stroke="#be185d" strokeOpacity="0.3" strokeWidth="0.6" fill="none" />
      </svg>

      {/* Campana SVG */}
      <svg viewBox="0 0 90 70" className={styles.bell} aria-hidden>
        <defs>
          <linearGradient id="bellMetal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="bellBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8a29e" />
            <stop offset="100%" stopColor="#44403c" />
          </linearGradient>
        </defs>
        {/* Plato base de madera/metal */}
        <ellipse cx="45" cy="62" rx="38" ry="5" fill="url(#bellBase)" />
        <ellipse cx="45" cy="60" rx="34" ry="3.5" fill="#1c1917" opacity="0.4" />
        {/* Cuerpo de la campana */}
        <path
          d="M 12 60 L 12 32 Q 12 12 45 12 Q 78 12 78 32 L 78 60 Z"
          fill="url(#bellMetal)"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="0.8"
        />
        {/* Brillo superior */}
        <ellipse cx="30" cy="22" rx="10" ry="4" fill="#fff" opacity="0.45" />
        {/* Botón de la campana */}
        <circle cx="45" cy="12" r="4.5" fill="url(#bellMetal)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
      </svg>

      {/* Ondas de sonido tras el press */}
      <span className={`${styles.bellWave} ${styles.bellWave1}`} />
      <span className={`${styles.bellWave} ${styles.bellWave2}`} />
      {/* Líneas "ding" laterales */}
      <span className={`${styles.bellDing} ${styles.bellDingL}`} />
      <span className={`${styles.bellDing} ${styles.bellDingR}`} />
    </div>
  );
}

// Pub: diana con dardos volando + mesa de billar.
export function PubGamesScene() {
  return (
    <div className={styles.scene}>
      {/* Mesa de billar a la izquierda */}
      <svg viewBox="0 0 90 60" className={styles.poolTable} aria-hidden>
        <defs>
          <linearGradient id="felt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <radialGradient id="ball-w">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#a8a29e" />
          </radialGradient>
        </defs>
        {/* Marco de madera */}
        <rect x="0" y="0" width="90" height="60" rx="6" fill="#78350f" />
        {/* Tapete verde */}
        <rect x="6" y="6" width="78" height="48" rx="3" fill="url(#felt)" />
        {/* Tronera (esquina) */}
        <circle cx="9" cy="9" r="3" fill="#1c1917" />
        <circle cx="81" cy="9" r="3" fill="#1c1917" />
        <circle cx="9" cy="51" r="3" fill="#1c1917" />
        <circle cx="81" cy="51" r="3" fill="#1c1917" />
        {/* Bolas */}
        <circle cx="55" cy="30" r="3" fill="#ef4444" /> {/* 3 */}
        <circle cx="60" cy="26" r="3" fill="#facc15" /> {/* 1 */}
        <circle cx="60" cy="34" r="3" fill="#3b82f6" /> {/* 2 */}
        <circle cx="65" cy="22" r="3" fill="#22c55e" />
        <circle cx="65" cy="30" r="3" fill="#a855f7" />
        <circle cx="65" cy="38" r="3" fill="#f97316" />
        {/* Bola blanca con animación rodando */}
        <circle cx="25" cy="30" r="3.5" fill="url(#ball-w)">
          <animate attributeName="cx" values="25;42;25" dur="3.6s" repeatCount="indefinite" />
        </circle>
        {/* Taco */}
        <line x1="8" y1="33" x2="22" y2="30" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
          <animate attributeName="x2" values="22;39;22" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="x1" values="8;25;8" dur="3.6s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Diana arriba a la derecha */}
      <svg viewBox="0 0 80 80" className={styles.dartboard} aria-hidden>
        <circle cx="40" cy="40" r="38" fill="#0a0a0f" stroke="#92400e" strokeWidth="2" />
        <circle cx="40" cy="40" r="32" fill="#fef3c7" />
        <circle cx="40" cy="40" r="22" fill="#dc2626" opacity="0.85" />
        <circle cx="40" cy="40" r="14" fill="#fef3c7" />
        <circle cx="40" cy="40" r="7" fill="#16a34a" />
        <circle cx="40" cy="40" r="3" fill="#dc2626" />
        {/* Líneas radiales (sectores) */}
        {Array.from({ length: 10 }).map((_, i) => {
          const ang = (i * 36 * Math.PI) / 180;
          const x = 40 + 32 * Math.cos(ang);
          const y = 40 + 32 * Math.sin(ang);
          return (
            <line
              key={i}
              x1="40"
              y1="40"
              x2={x}
              y2={y}
              stroke="#000"
              strokeOpacity="0.25"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {/* Dardos volando con desfase */}
      <span className={`${styles.dart} ${styles.dart1}`}>➤</span>
      <span className={`${styles.dart} ${styles.dart2}`}>➤</span>
      <span className={`${styles.dart} ${styles.dart3}`}>➤</span>
    </div>
  );
}

// Bar / Restaurante: trozo de carne con cuchillo serrándola.
export function MeatCutScene() {
  return (
    <div className={styles.scene}>
      {/* Tabla de madera */}
      <svg viewBox="0 0 120 50" className={styles.board} aria-hidden>
        <rect x="0" y="20" width="120" height="30" rx="3" fill="#a16207" />
        <rect x="0" y="20" width="120" height="3" fill="#78350f" opacity="0.5" />
        <line x1="20" y1="25" x2="20" y2="50" stroke="#78350f" strokeOpacity="0.4" strokeWidth="0.5" />
        <line x1="55" y1="25" x2="55" y2="50" stroke="#78350f" strokeOpacity="0.4" strokeWidth="0.5" />
        <line x1="92" y1="25" x2="92" y2="50" stroke="#78350f" strokeOpacity="0.4" strokeWidth="0.5" />
      </svg>

      {/* Trozo de carne (chuletón con grasa y marbling) */}
      <svg viewBox="0 0 110 60" className={styles.steak} aria-hidden>
        <defs>
          <radialGradient id="meat" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="60%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#7c2d12" />
          </radialGradient>
        </defs>
        <path
          d="M 10 30 Q 5 18 25 12 Q 50 6 80 14 Q 105 22 100 38 Q 90 52 60 50 Q 25 50 10 38 Z"
          fill="url(#meat)"
          stroke="#fbbf24"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        {/* Marbling — vetas de grasa */}
        <path d="M 25 24 Q 45 22 60 26 Q 75 28 85 24" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" fill="none" />
        <path d="M 20 36 Q 40 38 55 36 Q 70 34 90 38" stroke="#fff" strokeOpacity="0.3" strokeWidth="1" fill="none" />
        <path d="M 35 30 Q 50 32 70 30" stroke="#fff" strokeOpacity="0.25" strokeWidth="0.8" fill="none" />
      </svg>

      {/* Cuchillo cortando */}
      <svg viewBox="0 0 100 30" className={styles.knife} aria-hidden>
        <defs>
          <linearGradient id="blade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
        {/* Hoja */}
        <path d="M 5 14 L 70 8 L 72 18 L 5 18 Z" fill="url(#blade)" stroke="#475569" strokeWidth="0.6" />
        {/* Filo brillante */}
        <line x1="5" y1="18" x2="72" y2="18" stroke="#fff" strokeWidth="0.6" opacity="0.6" />
        {/* Mango */}
        <rect x="72" y="10" width="22" height="14" rx="2" fill="#1c1917" />
        <rect x="72" y="11" width="22" height="2" fill="#44403c" />
        <rect x="72" y="22" width="22" height="2" fill="#44403c" />
        {/* Remache */}
        <circle cx="80" cy="17" r="1.2" fill="#a8a29e" />
        <circle cx="86" cy="17" r="1.2" fill="#a8a29e" />
      </svg>
    </div>
  );
}

// Para los sectores restantes usamos emoji animado por CSS (suficientemente
// rico, no necesita SVG dedicado).
export function EmojiScene({ glyph, centered = false }: { glyph: string; centered?: boolean }) {
  return (
    <span
      className={`${styles.demoBg} ${centered ? styles.demoBgCenter : ""}`}
      aria-hidden
    >
      {glyph}
    </span>
  );
}

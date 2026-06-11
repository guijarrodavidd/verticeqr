"use client";

import styles from "../landing.module.css";

// Móvil del hero con la carta REAL de Romanssera, navegable de verdad.
// Recto y centrado; el QR flota al lado sin bloquear la interacción.
export default function HeroPhone() {
  return (
    <div className={styles.heroMockup}>
      <div className={styles.phoneFrame}>
        <div className={styles.phoneScreen}>
          <iframe
            src="/demos/romanssera/index.html"
            title="Carta digital de Romanssera Tapassería"
            className={styles.phoneIframe}
          />
        </div>
      </div>
      <div className={styles.qrFloat} aria-hidden="true">
        <div className={styles.qrFloatInner}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#fff" />
            <g fill="#221b13">
              <rect x="8" y="8" width="22" height="22" rx="2" />
              <rect x="70" y="8" width="22" height="22" rx="2" />
              <rect x="8" y="70" width="22" height="22" rx="2" />
              <rect x="14" y="14" width="10" height="10" fill="#fff" />
              <rect x="76" y="14" width="10" height="10" fill="#fff" />
              <rect x="14" y="76" width="10" height="10" fill="#fff" />
              <rect x="38" y="8" width="6" height="6" />
              <rect x="50" y="14" width="6" height="6" />
              <rect x="38" y="22" width="14" height="6" />
              <rect x="42" y="38" width="6" height="6" />
              <rect x="56" y="42" width="6" height="14" />
              <rect x="38" y="56" width="20" height="6" />
              <rect x="68" y="40" width="6" height="6" />
              <rect x="80" y="56" width="6" height="6" />
              <rect x="44" y="72" width="6" height="6" />
              <rect x="60" y="78" width="14" height="6" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

"use client";

import styles from "../landing.module.css";

// Móvil del hero con la carta REAL incrustada, navegable de verdad.
// QR real al lado + etiqueta para invitar a probar el pedido.
export default function HeroPhone() {
  return (
    <div className={styles.heroMockup}>
      <div className={styles.phoneFrame}>
        <div className={styles.phoneScreen}>
          <iframe
            src="/demos/hamburgueseria/index.html"
            title="Carta digital de Bonfire Burger"
            className={styles.phoneIframe}
          />
        </div>
      </div>

      <div className={styles.qrFloat} aria-hidden="true">
        <div className={styles.qrFloatInner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/qr-hero.png" alt="QR de mesa" />
        </div>
      </div>

      <div className={styles.heroDemoBadge}>
        <span className={styles.heroDemoDot} />
        Demo en vivo · tócala y haz un pedido de prueba
      </div>
    </div>
  );
}

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
            src="/demos/cala-blava/index.html"
            title="Room service digital de Cala Blava"
            className={styles.phoneIframe}
          />
        </div>
      </div>

      <div className={styles.heroDemoBadge}>
        <span className={styles.heroDemoDot} />
        Pruébala
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../landing.module.css";

// Móvil del hero con la carta REAL incrustada, navegable de verdad.
//
// La demo pesa (HTML grande, fotos y vídeo), así que NO entra en la carga
// inicial: primero se pinta un póster de 25 KB — la misma pantalla con la que
// arranca la carta, para que el cambio no se note — y el iframe se monta
// cuando la página ya ha terminado de cargar, o antes si el usuario la toca.
export default function HeroPhone() {
  const [montada, setMontada] = useState(false);
  const [lista, setLista] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (montada) return;
    let cancelado = false;
    const ir = () => !cancelado && setMontada(true);

    // Al tocarla, sin esperar a nada más.
    const nodo = caja.current;
    const eventos = ["pointerenter", "pointerdown", "touchstart"] as const;
    eventos.forEach((e) => nodo?.addEventListener(e, ir, { passive: true, once: true }));

    // Si no, cuando el navegador esté ocioso tras la carga.
    const cuandoOcioso = () => {
      const ric = window.requestIdleCallback;
      if (ric) ric(ir, { timeout: 2500 });
      else setTimeout(ir, 1200);
    };
    if (document.readyState === "complete") cuandoOcioso();
    else window.addEventListener("load", cuandoOcioso, { once: true });

    return () => {
      cancelado = true;
      eventos.forEach((e) => nodo?.removeEventListener(e, ir));
      window.removeEventListener("load", cuandoOcioso);
    };
  }, [montada]);

  return (
    <div className={styles.heroMockup} ref={caja}>
      <div className={styles.phoneFrame}>
        <div className={styles.phoneScreen}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hotel/demo-poster.webp"
            alt="Carta digital de room service en la pantalla del móvil del huésped"
            className={`${styles.phonePoster} ${lista ? styles.phonePosterOff : ""}`}
            width={390}
            height={792}
            fetchPriority="high"
            decoding="async"
          />
          {montada && (
            <iframe
              src="/demos/presidente/index.html?auto=1"
              title="Carta digital de room service, demo real"
              className={styles.phoneIframe}
              loading="lazy"
              onLoad={() => setLista(true)}
            />
          )}
        </div>
      </div>

      <div className={styles.heroDemoBadge}>
        <span className={styles.heroDemoDot} />
        Demo real · toca y pruébala
      </div>
    </div>
  );
}

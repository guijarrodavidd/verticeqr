"use client";

import { useEffect } from "react";

/**
 * Observa todo lo que lleve [data-reveal] y le pone data-in="1" cuando entra
 * en pantalla, salga por abajo o de lado (los carriles horizontales entran por
 * el lateral y el observador por defecto también los detecta).
 * El CSS hace el resto: la foto se descubre y se desescala.
 *
 * OJO con lo que se observa: la foto arranca con clip-path: inset(0 0 100% 0),
 * o sea recortada a cero. Y un elemento recortado a cero NUNCA intersecta con
 * la pantalla, por mucho que esté ahí — así que observarlo a él es pedirle al
 * navegador un aviso que no va a llegar jamás y la foto se queda en blanco
 * para siempre. Se observa su contenedor, que sí tiene caja.
 */
export default function RevealOnView() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => n.setAttribute("data-in", "1"));
      document.querySelectorAll<HTMLElement>("[data-bg]").forEach((n) => {
        if (n.dataset.bg) n.style.backgroundImage = `url(${n.dataset.bg})`;
      });
      return;
    }

    // caja observada -> fotos que hay que revelar cuando entre
    const destino = new Map<Element, HTMLElement[]>();

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          for (const el of destino.get(e.target) ?? []) {
            const d = Number(el.dataset.revealDelay || 0);
            window.setTimeout(() => el.setAttribute("data-in", "1"), d);
          }
          obs.unobserve(e.target);
          destino.delete(e.target);
        }
      },
      // que entre de verdad antes de dispararse: así el movimiento se ve
      { threshold: 0.22, rootMargin: "0px -6% -12% -6%" },
    );

    nodes.forEach((n) => {
      const caja = n.parentElement ?? n;
      const ya = destino.get(caja);
      if (ya) {
        ya.push(n);
        return;
      }
      destino.set(caja, [n]);
      obs.observe(caja);
    });

    // --- Fotos de fondo a sangre, sólo cuando tocan ---
    // Un background-image se descarga en cuanto el elemento existe, esté donde
    // esté la página. Eran ~900 KB de fotos de secciones que el visitante ni ha
    // visto todavía, compitiendo con lo que sí tiene delante. Aquí se piden con
    // margen de sobra para que lleguen mucho antes de asomar.
    const obsFondo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.dataset.bg) el.style.backgroundImage = `url(${el.dataset.bg})`;
          obsFondo.unobserve(el);
        }
      },
      { rootMargin: "600px" },
    );
    document
      .querySelectorAll<HTMLElement>("[data-bg]")
      .forEach((n) => obsFondo.observe(n));

    return () => {
      obs.disconnect();
      obsFondo.disconnect();
    };
  }, []);

  return null;
}

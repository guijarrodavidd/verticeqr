"use client";

import { useEffect } from "react";

/**
 * Observa todo lo que lleve [data-reveal] y le pone data-in="1" cuando entra
 * en pantalla, salga por abajo o de lado (los carriles horizontales entran por
 * el lateral y el observador por defecto también los detecta).
 * El CSS hace el resto: la foto se descubre y se desescala.
 */
export default function RevealOnView() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!nodes.length) return;

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => n.setAttribute("data-in", "1"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const d = Number(el.dataset.revealDelay || 0);
          window.setTimeout(() => el.setAttribute("data-in", "1"), d);
          obs.unobserve(el);
        }
      },
      // que entre de verdad antes de dispararse: así el movimiento se ve
      { threshold: 0.22, rootMargin: "0px -6% -12% -6%" },
    );

    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return null;
}

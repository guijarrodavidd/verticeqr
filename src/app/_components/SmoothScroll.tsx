"use client";

import { useEffect } from "react";

// Smooth scroll premium (Lenis) + parallax sutil de la foto del hero.
// Ligero: Lenis se carga con import dinámico (~4KB) y solo en cliente.
// Se desactiva por completo si el usuario prefiere menos movimiento.
export default function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let lenis: { raf: (t: number) => void; on: (e: string, cb: (a: { scroll: number }) => void) => void; destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });

      // Parallax muy sutil de la foto del hero (con overscan para no dejar huecos)
      const heroBg = document.getElementById("heroBg");
      if (heroBg) {
        lenis.on("scroll", ({ scroll }) => {
          if (scroll < window.innerHeight * 1.3) {
            heroBg.style.transform = `translate3d(0, ${scroll * 0.1}px, 0)`;
          }
        });
      }

      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}

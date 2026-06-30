"use client";

import { useEffect } from "react";

// Smooth scroll premium (Lenis) + parallax sutil de la foto del hero.
// Lenis se carga como ESTÁTICO desde /public/vendor (sin dependencia npm, así el
// build del hosting no la necesita). Se desactiva con prefers-reduced-motion.

declare global {
  interface Window {
    // build autoejecutable de Lenis -> window.Lenis
    Lenis?: new (opts?: Record<string, unknown>) => {
      raf: (t: number) => void;
      on: (e: string, cb: (a: { scroll: number }) => void) => void;
      destroy: () => void;
    };
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let lenis: InstanceType<NonNullable<Window["Lenis"]>> | null = null;
    let raf = 0;
    let cancelled = false;

    function init() {
      if (cancelled || !window.Lenis) return;
      lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });

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
    }

    if (window.Lenis) {
      init();
    } else {
      let s = document.getElementById("lenis-script") as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement("script");
        s.id = "lenis-script";
        s.src = "/vendor/lenis.min.js";
        s.async = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", init);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}

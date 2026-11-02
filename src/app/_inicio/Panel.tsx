"use client";

import { useEffect, useRef } from "react";
import s from "./inicio.module.css";

// El resumen del panel dentro de una tablet: entra inclinada desde abajo y
// se endereza cuando llega al centro de la pantalla.
export default function Panel() {
  const ventana = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = ventana.current;
    if (!v || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let marco = 0;
    const calcula = () => {
      marco = 0;
      const r = v.getBoundingClientRect();
      const alto = window.innerHeight;
      const p = Math.min(1, Math.max(0, (r.top - alto * 0.15) / (alto * 0.65)));
      v.style.setProperty("--p", p.toFixed(3));
    };
    const alMover = () => {
      if (!marco) marco = requestAnimationFrame(calcula);
    };
    calcula();
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    return () => {
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
      if (marco) cancelAnimationFrame(marco);
    };
  }, []);

  return (
    <>
      <div className={s.panelVentana} ref={ventana}>
        <div className={s.tablet}>
          <div className={s.tabletPantalla}>
            {/* En el móvil, la parte que se lee: sin la barra lateral y más grande. */}
            <picture>
              <source media="(max-width: 860px)" srcSet="/inicio/panel-resumen-movil.webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/inicio/panel-resumen.webp" alt="Resumen del panel de análisis de Vértice" loading="lazy" />
            </picture>
          </div>
        </div>
      </div>
    </>
  );
}

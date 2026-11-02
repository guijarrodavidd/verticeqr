"use client";

import { useEffect, useRef } from "react";
import s from "./inicio.module.css";

// El resumen del panel, como foto de producto: entra inclinado desde abajo y
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/inicio/panel-resumen.webp" alt="Resumen del panel de dirección de Vértice" loading="lazy" />
      </div>
      <p className={s.pieFoto}>Panel de dirección con datos de demostración</p>
    </>
  );
}

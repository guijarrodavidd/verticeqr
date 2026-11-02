"use client";

import { useEffect, useRef, useState } from "react";
import s from "./inicio.module.css";

const PASOS = [
  { foto: "/inicio/carta-elegir.webp", t: "Abre la carta", d: "Escanea el QR de su habitación. Sin descargar nada." },
  { foto: "/inicio/carta-pedir.webp", t: "Ve lo que le apetece", d: "Con foto, precio y lo que hay a esa hora." },
  { foto: "/inicio/carta-anadido.webp", t: "Le sugerimos algo más", d: "Una copa para acompañar, en el momento justo." },
  { foto: "/inicio/carta-carrito.webp", t: "Lo carga a su habitación", d: "Elige dónde se lo llevan y lo paga al salir." },
  { foto: "/inicio/carta-ticket.webp", t: "Y sigue su pedido", d: "Recibido, en cocina, en camino. Sin llamar a nadie." },
];

// Un pedido contado al deslizar: el texto avanza a la izquierda y el móvil
// fijo de la derecha cambia de pantalla con cada paso.
export default function Historia() {
  const [activo, setActivo] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setActivo(Number((e.target as HTMLElement).dataset.n));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <div className={s.historia}>
      <div className={s.pasos}>
        {PASOS.map((p, n) => (
          <div
            key={p.t}
            ref={(el) => {
              refs.current[n] = el;
            }}
            data-n={n}
            data-activo={n === activo ? "" : undefined}
            className={s.paso}
          >
            <span className={s.pasoNum}>{n + 1}</span>
            <h3 className={s.pasoTitulo}>{p.t}</h3>
            <p className={s.pasoTexto}>{p.d}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.pasoFoto} src={p.foto} alt="" loading="lazy" />
          </div>
        ))}
      </div>
      <div className={s.escenario} aria-hidden>
        <div className={s.movil}>
          <div className={s.pantalla}>
            <span className={s.isla} />
            {PASOS.map((p, n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.foto} src={p.foto} alt="" loading="lazy" data-activa={n === activo ? "" : undefined} />
            ))}
          </div>
        </div>
        <div className={s.barraPasos}>
          {PASOS.map((p, n) => (
            <i key={p.t} data-activa={n === activo ? "" : undefined} />
          ))}
        </div>
      </div>
    </div>
  );
}

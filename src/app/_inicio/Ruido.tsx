"use client";

import { useEffect, useRef } from "react";
import s from "./inicio.module.css";

// Lo que le llega hoy a recepción un sábado por la noche, en el orden en que
// va apareciendo al deslizar. Luego todo se recoge en el panel.
const PETICIONES = [
  "¿Me subís hielo?", "Toallas en la 305", "¿Hay mesa a las 21:00?", "La 108 quiere salir más tarde",
  "¿Cuánto cuesta el masaje?", "No va el aire en la 412", "¿Qué excursión me recomendáis?", "Cava a la 214",
  "¿Tenéis cargador?", "¿Hasta qué hora abre la piscina?", "Room service, por favor", "¿Me pedís un taxi?",
  "Cuna para la 220", "¿Hay algo sin gluten?", "Almohada extra en la 117", "¿Puedo reservar el spa?",
  "¿Me traéis la carta?", "Desayuno en la habitación", "¿A qué hora es el check-out?", "Falta papel en la 309",
];
const TONOS = ["tonoCarbon", "tonoBlanco", "tonoSalvia", "tonoPiedra", "tonoCielo", "tonoBlanco", "tonoSol"];

// Un giro pequeño y fijo para cada una: se nota el agobio sin que se pisen.
const giro = (n: number) => ((n * 29) % 7) - 3;

const AVISOS = [
  { hab: "Hab. 214", que: "Cava · 2 copas", cuanto: "34 €" },
  { hab: "Hab. 305", que: "Toallas extra", cuanto: "en 10 min" },
  { hab: "Hab. 108", que: "Salida tardía hasta las 15:00", cuanto: "40 €" },
  { hab: "Hab. 412", que: "No va el aire · avisado a mantenimiento", cuanto: "" },
];

// El deslizar solo decide cuántas peticiones están encendidas y si ya se han
// recogido; cada cambio lo anima una transición. Así se ve igual en iPhone y
// en Android aunque el dedo vaya rápido o el navegador no avise de cada píxel.
export default function Ruido() {
  const zona = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = zona.current;
    if (!el) return;
    const etiquetas = Array.from(el.querySelectorAll<HTMLElement>("[data-etiqueta]"));
    let encendidas = -1;
    let recogido: boolean | null = null;
    let marco = 0;
    const calcula = () => {
      marco = 0;
      const r = el.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, recorrido)));
      const n = Math.round(Math.min(1, p / 0.5) * etiquetas.length);
      if (n !== encendidas) {
        etiquetas.forEach((e, k) => e.toggleAttribute("data-on", k < n));
        encendidas = n;
      }
      const ahora = p > 0.6;
      if (ahora !== recogido) {
        el.toggleAttribute("data-recoge", ahora);
        recogido = ahora;
      }
    };
    const alMover = () => {
      if (!marco) marco = requestAnimationFrame(calcula);
    };
    calcula();
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    window.addEventListener("touchmove", alMover, { passive: true });
    return () => {
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
      window.removeEventListener("touchmove", alMover);
      if (marco) cancelAnimationFrame(marco);
    };
  }, []);

  return (
    <section ref={zona} className={s.ruido} aria-label="Lo que le llega a recepción y cómo queda ordenado">
      <div className={s.ruidoFijo}>
        <div className={s.ruidoTitulos}>
          <h2 className={`${s.ruidoTitulo} ${s.ruidoAntes}`}>Así suena la recepción un sábado a las 22:40</h2>
          <h2 className={`${s.ruidoTitulo} ${s.ruidoDespues}`}>Con Vértice, cada petición llega sola y en orden</h2>
        </div>

        {/* Una nube ordenada debajo del título: se amontonan sin taparse. */}
        <div className={s.nube} aria-hidden>
          {PETICIONES.map((t, n) => (
            <span
              key={t}
              data-etiqueta=""
              className={`${s.etiqueta} ${s[TONOS[n % TONOS.length]]}`}
              style={{ ["--r" as string]: giro(n), ["--i" as string]: n }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className={`${s.bandeja} ${s.cristal} ${s.iris}`}>
          <div className={s.bandejaCabeza}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/vertice-wordmark-dark.png" alt="Vértice" />
            <span>Panel · ahora</span>
          </div>
          {AVISOS.map((a) => (
            <div key={a.hab} className={s.bandejaFila}>
              <span className={s.avisoIcono}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/inicio/v-blanca.png" alt="" />
              </span>
              <span>
                <small>{a.hab}</small>
                <b>{a.que}</b>
              </span>
              {a.cuanto && <em>{a.cuanto}</em>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

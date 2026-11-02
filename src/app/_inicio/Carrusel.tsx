"use client";

import { useRef } from "react";
import s from "./inicio.module.css";

const TARJETAS = [
  { foto: "/inicio/vende-comida.webp", t: "Comida a la habitación", d: "La cena a las 23:00, sin llamar a nadie." },
  { foto: "/inicio/vende-spa.webp", t: "Spa y masajes", d: "Con día y hora, reservado en dos toques." },
  { foto: "/inicio/vende-excursiones.webp", t: "Excursiones", d: "Se reservan el primer día, cuando aún hay tiempo." },
  { foto: "/inicio/vende-cenas.webp", t: "Cenas especiales", d: "Para la noche que quieren recordar." },
  { foto: "/inicio/vende-salida.webp", t: "Salida tardía y mejoras", d: "Se ofrece la noche antes de irse." },
  { foto: "/inicio/vende-detalles.webp", t: "Lo que le falta", d: "Toallas o un cargador, sin bajar a recepción." },
];

// Tarjetas que se arrastran con el ratón o se deslizan con el dedo.
export function Flechas({ objetivo }: { objetivo: string }) {
  const mueve = (dir: number) => {
    const el = document.getElementById(objetivo);
    if (el) el.scrollBy({ left: dir * Math.min(400, el.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <div className={s.flechas}>
      <button type="button" className={`${s.flecha} ${s.cristal}`} onClick={() => mueve(-1)} aria-label="Anterior">←</button>
      <button type="button" className={`${s.flecha} ${s.cristal}`} onClick={() => mueve(1)} aria-label="Siguiente">→</button>
    </div>
  );
}

export default function Carrusel({ id }: { id: string }) {
  const pista = useRef<HTMLDivElement>(null);
  const arrastre = useRef<{ x: number; izq: number } | null>(null);

  return (
    <div
      id={id}
      ref={pista}
      className={s.carrusel}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || !pista.current) return;
        arrastre.current = { x: e.clientX, izq: pista.current.scrollLeft };
        pista.current.setAttribute("data-arrastrando", "");
      }}
      onPointerMove={(e) => {
        if (!arrastre.current || !pista.current) return;
        pista.current.scrollLeft = arrastre.current.izq - (e.clientX - arrastre.current.x);
      }}
      onPointerUp={() => {
        arrastre.current = null;
        pista.current?.removeAttribute("data-arrastrando");
      }}
      onPointerLeave={() => {
        arrastre.current = null;
        pista.current?.removeAttribute("data-arrastrando");
      }}
    >
      {TARJETAS.map((t, n) => (
        <article key={t.t} className={s.tarjeta} data-aparece="" style={{ ["--d" as string]: n }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.foto} alt="" loading="lazy" draggable={false} />
          <div className={s.tarjetaTexto}>
            <b>{t.t}</b>
            <span>{t.d}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import s from "./inicio.module.css";

const COSAS = [
  "la cena a la habitación",
  "un masaje con hora",
  "la salida tardía",
  "la excursión de mañana",
  "una botella de vino",
];

// El final del titular cambia solo, como en el vídeo de Virio: cada cosa que
// el hotel puede vender entra desenfocada y se va por arriba.
export default function Titular() {
  const [i, setI] = useState(0);
  const [antes, setAntes] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setI((v) => {
        setAntes(v);
        return (v + 1) % COSAS.length;
      });
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <h1 className={s.h1}>
      <span className={s.h1Fija}>Que cada huésped pida</span>
      <span className={s.rota} aria-live="polite">
        {COSAS.map((c, n) => (
          <span key={c} data-activa={n === i ? "" : undefined} data-sale={n === antes ? "" : undefined} aria-hidden={n !== i}>
            {c}
          </span>
        ))}
      </span>
    </h1>
  );
}

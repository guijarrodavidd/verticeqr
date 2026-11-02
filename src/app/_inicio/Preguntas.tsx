"use client";

import { useState } from "react";
import s from "./inicio.module.css";

const PREGUNTAS = [
  { q: "¿Tengo que tocar el PMS?", a: "No hace falta para empezar. El pedido se carga a la habitación y tu equipo lo pasa a la cuenta como hace hoy." },
  { q: "¿Quién lo monta?", a: "Nosotros. Tu carta, tus fotos y tus precios, con la marca de tu hotel. Tú lo revisas y das el visto bueno." },
  { q: "¿Le da más trabajo a mi equipo?", a: "Los pedidos llegan al panel con la habitación y la hora. Nadie coge el teléfono para tomar nota." },
  { q: "¿El huésped tiene que descargar algo?", a: "Nada. Escanea el QR de la habitación con la cámara y ya está dentro, en su idioma." },
  { q: "¿Me ata a algo?", a: "Sin permanencia. Si no te compensa, lo dejas cuando quieras." },
];

// Como «Our Philosophies» de Virio: la pregunta a la izquierda y la
// respuesta a la derecha, que cambia al tocar.
export default function Preguntas() {
  const [i, setI] = useState(0);
  return (
    <div className={s.preguntas}>
      <div className={s.preguntasLista} role="tablist" aria-orientation="vertical">
        {PREGUNTAS.map((p, n) => (
          <button key={p.q} type="button" role="tab" aria-selected={n === i} className={s.pregunta} onClick={() => setI(n)} onMouseEnter={() => setI(n)}>
            <span className={s.preguntaFlecha} aria-hidden>→</span>
            {p.q}
          </button>
        ))}
      </div>
      <div className={`${s.respuesta} ${s.cristal}`} role="tabpanel" aria-live="polite">
        <span className={s.respuestaNum}>{String(i + 1).padStart(2, "0")} / {String(PREGUNTAS.length).padStart(2, "0")}</span>
        <p key={i} data-cambia="">{PREGUNTAS[i].a}</p>
      </div>
    </div>
  );
}

"use client";

import { Fragment, useState } from "react";
import s from "./inicio.module.css";

const PREGUNTAS = [
  { q: "¿Tengo que tocar el PMS?", a: "Para empezar no hace falta. El pedido se carga a la habitación y tu equipo lo pasa a la cuenta como hace hoy." },
  { q: "¿Quién lo monta?", a: "Nosotros. Tu carta, tus fotos y tus precios, con la marca de tu hotel. Tú lo revisas y das el visto bueno." },
  { q: "¿Le da más trabajo a mi equipo?", a: "Los pedidos llegan al panel con la habitación y la hora. Nadie coge el teléfono para tomar nota." },
  { q: "¿El huésped tiene que descargar algo?", a: "Nada. Escanea el QR de la habitación con la cámara y ya está dentro, en su idioma." },
  { q: "¿Me ata a algo?", a: "Sin permanencia. Si no te compensa, lo dejas cuando quieras." },
];

// La pregunta a la izquierda y la respuesta a la derecha, como en Virio.
// En el móvil la respuesta se abre debajo de su pregunta.
export default function Preguntas() {
  const [i, setI] = useState(0);
  return (
    <div className={s.preguntas}>
      <div className={s.preguntasLista} role="tablist" aria-orientation="vertical">
        {PREGUNTAS.map((p, n) => (
          <Fragment key={p.q}>
            <button type="button" role="tab" aria-selected={n === i} className={s.pregunta} onClick={() => setI(n)}>
              {p.q}
            </button>
            {n === i && <p className={s.respuestaMovil}>{p.a}</p>}
          </Fragment>
        ))}
      </div>
      <div className={s.respuesta} role="tabpanel" aria-live="polite">
        <p key={i} data-cambia="">{PREGUNTAS[i].a}</p>
      </div>
    </div>
  );
}

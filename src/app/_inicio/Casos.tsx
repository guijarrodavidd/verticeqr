"use client";

import { useState } from "react";
import s from "./inicio.module.css";

// Un mes en el panel, contado como los casos de Virio. Son los datos del
// hotel de demostración del panel, no de un cliente, y así se dice: cuando un
// piloto tenga sus números medidos, se cambian por esos.
//   Ingreso por habitación ocupada: 5,46 € → 8,40 € (+54 %)
//   Horas: 1.866 pedidos × 4,5 min = 140 h · 3.674 consultas × 2 min = 122 h · total 262 h ≈ 33 jornadas
const VISTAS = {
  ingreso: {
    nombre: "Ingreso",
    grande: "+54 %",
    grandeTxt: "de ingreso por habitación ocupada",
    antes: "5,46 € → 8,40 €",
    cifras: [
      { b: "27.053 €", t: "extra en comida y bebida en 30 días", c: "9,8 % más que el mes anterior" },
      { b: "24,20 €", t: "de ingreso extra por huésped", c: "1.118 huéspedes atendidos" },
      { b: "116", t: "experiencias reservadas desde la carta", c: "Spa, excursiones y cenas" },
    ],
  },
  operacion: {
    nombre: "Operación",
    grande: "262 h",
    grandeTxt: "de trabajo que se ahorra el equipo en un mes",
    antes: "≈ 33 jornadas de 8 horas",
    cifras: [
      { b: "1.866", t: "pedidos sin coger el teléfono", c: "× 4,5 min = 140 h" },
      { b: "3.674", t: "consultas que no pasan por recepción", c: "× 2 min = 122 h" },
      { b: "4,6", t: "valoración del servicio", c: "18 min de entrega de media" },
    ],
  },
} as const;
type Vista = keyof typeof VISTAS;

const ALTURAS = Array.from({ length: 30 }, (_, n) => Math.round(22 + n * 2.4 + ((n * 37) % 9) - 4));

export default function Casos() {
  const [v, setV] = useState<Vista>("ingreso");
  const vista = VISTAS[v];
  return (
    <div className={s.caso} data-aparece="">
      <div className={s.casoArriba}>
        <div>
          <div className={s.selector} role="tablist">
            {(Object.keys(VISTAS) as Vista[]).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={k === v} onClick={() => setV(k)}>
                {VISTAS[k].nombre}
              </button>
            ))}
          </div>
          <h3 className={s.casoTitulo} style={{ marginTop: 22 }}>Un hotel de 118 habitaciones, después de un mes con Vértice</h3>
          <p className={s.casoTexto}>El huésped pide desde su móvil y el panel lo cuenta todo: lo que entra de más y las horas que recepción deja de pasar al teléfono.</p>
          <span className={s.etiquetaDemo}>Hotel de demostración</span>
        </div>
        <div className={s.casoGrande} key={`g-${v}`} data-cambia="">
          <b>{vista.grande}</b>
          <span>{vista.grandeTxt}</span>
          <small className={s.antes}>{vista.antes}</small>
        </div>
      </div>
      <div className={s.puntos} data-aparece="" aria-hidden>
        {ALTURAS.map((h, n) => (
          <i key={n} style={{ ["--h" as string]: h, ["--n" as string]: n }} />
        ))}
      </div>
      <div className={s.cifras}>
        {vista.cifras.map((c) => (
          <div key={`${v}-${c.t}`} className={s.cifra} data-cambia="">
            <b>{c.b}</b>
            <span>{c.t}</span>
            <small className={s.antes}>{c.c}</small>
          </div>
        ))}
      </div>
      <p className={s.casoPie}>Datos de demostración del panel de Vértice. Los de tu hotel los vemos en la llamada.</p>
    </div>
  );
}

"use client";

import { useState } from "react";
import s from "./inicio.module.css";

// Un caso calculado, no un cliente: todavía no hay resultados publicables.
// Las cuentas cuadran al céntimo:
//   160 hab × 63 % × 30 noches = 3.024 noches ocupadas
//   antes 1 de cada 100: 3.024 ÷ 100 = 30 masajes × 70 € = 2.100 € · 25.200 € al año
//   con Vértice 1 de cada 50: 3.024 ÷ 50 = 60 masajes × 70 € = 4.200 € · 50.400 € al año
//   3.024 peticiones × 4 min = 12.096 min = 201 h · 25 jornadas de 8 h
//   201 h × 15,94 € = 3.203,94 € al mes
//   4.200 + 3.203,94 = 7.403,94 € al mes
const VISTAS = {
  ingreso: {
    nombre: "Ingreso",
    grande: "4.200 €",
    grandeTxt: "al mes en masajes reservados desde la habitación",
    cifras: [
      { b: "×2", t: "más masajes al mes", a: "30", d: "60" },
      { b: "50.400 €", t: "al año en el spa", a: "25.200 €", d: "50.400 €" },
      { b: "1 de cada 50", t: "huéspedes reserva un masaje", nota: "Antes, 1 de cada 100" },
    ],
  },
  equipo: {
    nombre: "Equipo",
    grande: "201 h",
    grandeTxt: "al mes que recepción deja de pasar al teléfono",
    cifras: [
      { b: "25", t: "jornadas de 8 horas al mes", nota: "201 h ÷ 8 h" },
      { b: "3.203,94 €", t: "al mes en horas de recepción", nota: "201 h × 15,94 €" },
      { b: "0", t: "personas más en plantilla", nota: "Lo lleva el equipo que ya tienes" },
    ],
  },
} as const;
type Vista = keyof typeof VISTAS;

// Treinta días de un mes que va a más: cada columna es lo que se ha vendido.
const ALTURAS = Array.from({ length: 30 }, (_, n) => Math.round(18 + n * 2.6 + ((n * 37) % 9) - 4));

export default function Caso() {
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
          <h3 className={s.casoTitulo} style={{ marginTop: 22 }}>Un resort de 160 habitaciones que vende el spa desde la habitación</h3>
          <p className={s.casoTexto}>Sin sumar a nadie al equipo. Entre lo que se vende y lo que se ahorra, 7.403,94 € al mes.</p>
        </div>
        <div className={s.casoGrande} key={`g-${v}`} data-cambia="">
          <b>{vista.grande}</b>
          <span>{vista.grandeTxt}</span>
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
            {"a" in c ? (
              <small className={s.antes}>
                {c.a} <i aria-label="pasa a">→</i> {c.d}
              </small>
            ) : (
              <small className={s.antes}>{c.nota}</small>
            )}
          </div>
        ))}
      </div>
      <p className={s.casoPie}>
        Cálculo de ejemplo con 160 habitaciones al 63 % de ocupación, un masaje de 70 € y la hora de recepción a 15,94 € según el convenio de hostelería. Supuestos: hoy reserva el spa 1 de cada 100 huéspedes y con Vértice 1 de cada 50, y cada petición por teléfono lleva 4 minutos. En la llamada lo hacemos con los números de tu hotel.
      </p>
    </div>
  );
}

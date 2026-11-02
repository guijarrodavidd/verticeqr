"use client";

import { useState } from "react";
import s from "./inicio.module.css";

// Calculadora con los números del propio hotel. No damos una tasa de subida
// porque todavía no hay una medida en un cliente: cada director pone la suya.
// Todo es aritmética a la vista, con 30 noches al mes y sin guardar nada.

// En es-ES los números de cuatro cifras salen sin punto (3780); de-DE escribe
// igual que en España pero con el punto siempre (3.780).
const eur = (n: number, dec = 0) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + " €";
const num = (n: number) => n.toLocaleString("de-DE");

type Campo = { id: string; t: string; min: number; max: number; paso: number; v: number; set: (n: number) => void; fmt: (n: number) => string };

function Deslizador({ c }: { c: Campo }) {
  const pct = ((c.v - c.min) / (c.max - c.min)) * 100;
  return (
    <label className={s.deslizador} htmlFor={c.id}>
      <span className={s.deslizadorFila}>
        <span>{c.t}</span>
        <b>{c.fmt(c.v)}</b>
      </span>
      <input
        id={c.id}
        type="range"
        min={c.min}
        max={c.max}
        step={c.paso}
        value={c.v}
        onChange={(e) => c.set(Number(e.target.value))}
        style={{ ["--pct" as string]: `${pct}%` }}
      />
    </label>
  );
}

export default function Caso() {
  const [vista, setVista] = useState<"ingreso" | "equipo">("ingreso");
  const [hab, setHab] = useState(120);
  const [ocu, setOcu] = useState(70);
  const [gasto, setGasto] = useState(30);
  const [mas, setMas] = useState(5);
  const [pet, setPet] = useState(1);
  const [min, setMin] = useState(4);
  const [coste, setCoste] = useState(16);

  const noches = Math.round(hab * (ocu / 100) * 30);
  const compras = Math.round((noches * mas) / 100);
  const ingreso = compras * gasto;
  const minutos = noches * pet * min;
  const horas = Math.floor(minutos / 60);
  const jornadas = Math.floor(horas / 8);
  const ahorro = Math.round(horas * coste * 100) / 100;

  const comunes: Campo[] = [
    { id: "c-hab", t: "Habitaciones", min: 20, max: 500, paso: 5, v: hab, set: setHab, fmt: num },
    { id: "c-ocu", t: "Ocupación media", min: 30, max: 100, paso: 1, v: ocu, set: setOcu, fmt: (n) => `${n} %` },
  ];
  const campos: Campo[] =
    vista === "ingreso"
      ? [
          ...comunes,
          { id: "c-gasto", t: "Lo que gasta un huésped cuando compra", min: 5, max: 150, paso: 1, v: gasto, set: setGasto, fmt: (n) => eur(n) },
          { id: "c-mas", t: "De cada 100 huéspedes, cuántos más compran", min: 1, max: 30, paso: 1, v: mas, set: setMas, fmt: (n) => `${n}` },
        ]
      : [
          ...comunes,
          { id: "c-pet", t: "Peticiones por teléfono cada noche", min: 0.5, max: 4, paso: 0.5, v: pet, set: setPet, fmt: (n) => n.toLocaleString("de-DE") },
          { id: "c-min", t: "Minutos de cada petición", min: 1, max: 10, paso: 1, v: min, set: setMin, fmt: (n) => `${n} min` },
          { id: "c-coste", t: "Coste de una hora de recepción", min: 10, max: 30, paso: 0.5, v: coste, set: setCoste, fmt: (n) => eur(n, 2) },
        ];

  const grande = vista === "ingreso" ? { b: eur(ingreso), t: "al mes que hoy se queda sin vender" } : { b: `${num(horas)} h`, t: "al mes que recepción deja de pasar al teléfono" };
  const cifras =
    vista === "ingreso"
      ? [
          { b: num(compras), t: "compras más al mes", c: `${num(noches)} noches × ${mas} de cada 100` },
          { b: eur(ingreso * 12), t: "al año", c: `${eur(ingreso)} × 12 meses` },
          { b: eur(Math.round((ingreso / Math.max(1, noches)) * 100) / 100, 2), t: "más por cada noche ocupada", c: `${eur(ingreso)} ÷ ${num(noches)} noches` },
        ]
      : [
          { b: num(jornadas), t: "jornadas de 8 horas al mes", c: `${num(horas)} h ÷ 8 h` },
          { b: eur(ahorro, 2), t: "al mes en horas de recepción", c: `${num(horas)} h × ${eur(coste, 2)}` },
          { b: "0", t: "personas más en plantilla", c: "Lo lleva el equipo que ya tienes" },
        ];

  return (
    <div className={s.caso} data-aparece="">
      <div className={s.casoArriba}>
        <div>
          <div className={s.selector} role="tablist">
            <button type="button" role="tab" aria-selected={vista === "ingreso"} onClick={() => setVista("ingreso")}>Ingreso</button>
            <button type="button" role="tab" aria-selected={vista === "equipo"} onClick={() => setVista("equipo")}>Equipo</button>
          </div>
          <div className={s.deslizadores}>
            {campos.map((c) => (
              <Deslizador key={c.id} c={c} />
            ))}
          </div>
        </div>
        <div className={s.casoGrande} aria-live="polite">
          <b>{grande.b}</b>
          <span>{grande.t}</span>
          <small className={s.antes}>{num(noches)} noches ocupadas al mes</small>
        </div>
      </div>
      <div className={s.cifras}>
        {cifras.map((c) => (
          <div key={`${vista}-${c.t}`} className={s.cifra}>
            <b>{c.b}</b>
            <span>{c.t}</span>
            <small className={s.antes}>{c.c}</small>
          </div>
        ))}
      </div>
      <p className={s.casoPie}>Pon los números de tu hotel. Se calcula con 30 noches al mes y no se guarda nada. En la llamada lo afinamos con tus datos reales.</p>
    </div>
  );
}

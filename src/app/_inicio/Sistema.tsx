"use client";

import { useEffect, useRef, useState } from "react";
import s from "./inicio.module.css";

// Cómo viaja cada cosa que pide el huésped: de su móvil a tu equipo y de ahí
// al panel. La carta ya sale en la portada; aquí se ve el sistema por dentro.
const MODULOS = [
  {
    t: "Pedir a la habitación",
    huesped: { hab: "Hab. 214", que: "Pizza y dos cervezas", dato: "31 €" },
    equipo: { quien: "Cocina", que: "Hab. 214 · sale en 20 min", dato: "En cocina" },
    panel: { cifra: "+31 €", que: "Room service, 22:40" },
  },
  {
    t: "Reservar el spa",
    huesped: { hab: "Hab. 305", que: "Masaje de 55 min · hoy 18:00", dato: "70 €" },
    equipo: { quien: "Spa", que: "Cabina 2 · 18:00 · Hab. 305", dato: "Reservado" },
    panel: { cifra: "+70 €", que: "Spa, reservado desde la habitación" },
  },
  {
    t: "Reservar mesa",
    huesped: { hab: "Hab. 112", que: "Mesa para 2 · 21:00 · terraza", dato: "2 pers." },
    equipo: { quien: "Restaurante", que: "Reserva de la Hab. 112", dato: "21:00" },
    panel: { cifra: "+2", que: "Cubiertos de huéspedes alojados" },
  },
  {
    t: "Salida tardía",
    huesped: { hab: "Hab. 108", que: "Salir a las 15:00", dato: "40 €" },
    equipo: { quien: "Recepción", que: "Confirmar salida de la 108", dato: "Hecho" },
    panel: { cifra: "+40 €", que: "Mejoras y salidas tardías" },
  },
  {
    t: "Avisar de un problema",
    huesped: { hab: "Hab. 412", que: "No va el aire", dato: "Aviso" },
    equipo: { quien: "Mantenimiento", que: "Hab. 412 · aire acondicionado", dato: "En 10 min" },
    panel: { cifra: "12 min", que: "Resuelto antes de la reseña" },
  },
  {
    t: "Excursiones",
    huesped: { hab: "Hab. 220", que: "Barco al atardecer · mañana", dato: "2 pers." },
    equipo: { quien: "Recepción", que: "Plazas confirmadas con el operador", dato: "Listo" },
    panel: { cifra: "+190 €", que: "Experiencias de la zona" },
  },
];
const DURACION = 5200;

export default function Sistema() {
  const [i, setI] = useState(0);
  const [etapa, setEtapa] = useState(0);
  const [quieta, setQuieta] = useState(false);
  const [visible, setVisible] = useState(false);
  const zona = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = zona.current;
    if (!nodo || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  // El punto sale del huésped, llega al equipo y termina en el panel.
  useEffect(() => {
    if (!visible) return;
    setEtapa(0);
    const a = setTimeout(() => setEtapa(1), 750);
    const b = setTimeout(() => setEtapa(2), 1500);
    const c = quieta ? undefined : setTimeout(() => setI((v) => (v + 1) % MODULOS.length), DURACION);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      if (c) clearTimeout(c);
    };
  }, [i, visible, quieta]);

  useEffect(() => {
    const b = lista.current?.children[i] as HTMLElement | undefined;
    const l = lista.current;
    if (!b || !l || l.scrollWidth <= l.clientWidth) return;
    l.scrollTo({ left: b.offsetLeft - l.clientWidth / 2 + b.clientWidth / 2, behavior: "smooth" });
  }, [i]);

  const m = MODULOS[i];
  return (
    <div ref={zona} className={s.sistema}>
      <div ref={lista} className={s.modulos} role="tablist" data-quieta={quieta || !visible ? "" : undefined} style={{ ["--dur" as string]: `${DURACION}ms` }}>
        {MODULOS.map((x, n) => (
          <button
            key={x.t}
            type="button"
            role="tab"
            aria-selected={n === i}
            className={s.modulo}
            onClick={() => {
              setI(n);
              setQuieta(true);
            }}
          >
            {x.t}
          </button>
        ))}
      </div>

      <div className={s.flujo} aria-live="polite">
        <div className={s.nodo} data-on={etapa >= 0 ? "" : undefined}>
          <span className={s.nodoQuien}>El huésped</span>
          <div className={`${s.nodoCaja} ${s.cristal}`} key={`h-${i}`} data-cambia="">
            <span className={s.avisoIcono}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/inicio/v-blanca.png" alt="" />
            </span>
            <span>
              <small>{m.huesped.hab}</small>
              <b>{m.huesped.que}</b>
            </span>
            <em>{m.huesped.dato}</em>
          </div>
        </div>
        <div className={s.nodo} data-on={etapa >= 1 ? "" : undefined}>
          <i className={s.conector} aria-hidden />
          <span className={s.nodoQuien}>Tu equipo</span>
          <div className={s.nodoTicket} key={`e-${i}`} data-cambia="">
            <small>{m.equipo.quien}</small>
            <b>{m.equipo.que}</b>
            <em>{m.equipo.dato}</em>
          </div>
        </div>
        <div className={s.nodo} data-on={etapa >= 2 ? "" : undefined}>
          <i className={s.conector} aria-hidden />
          <span className={s.nodoQuien}>Tu panel</span>
          <div className={s.nodoPanel} key={`p-${i}`} data-cambia="">
            <b>{m.panel.cifra}</b>
            <span>{m.panel.que}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

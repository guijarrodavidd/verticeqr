"use client";

import { useEffect, useRef, useState } from "react";
import s from "./inicio.module.css";

// Cada módulo con sus pantallas reales de la carta de NOOE. «Pedir» enseña el
// pedido entero, de la carta al pedido confirmado.
const MODULOS = [
  { t: "Pedir a la habitación", d: "Con foto y precio, y una sugerencia en el momento justo.", fotos: ["pedir", "anadido", "carrito", "ticket"] },
  { t: "Reservar el spa", d: "Con día y hora, sin llamar a nadie.", fotos: ["spa"] },
  { t: "Reservar mesa", d: "El turno y la zona, en dos toques.", fotos: ["mesa"] },
  { t: "Salida tardía y mejoras", d: "Se ofrecen la noche antes de irse.", fotos: ["salida"] },
  { t: "Avisar de un problema", d: "Lo recibe el turno y se arregla durante la estancia.", fotos: ["aviso"] },
  { t: "Descubrir la zona", d: "Rutas y excursiones que se reservan desde aquí.", fotos: ["guia"] },
];
const POR_FOTO = 2200;
const durDe = (n: number) => Math.max(5200, MODULOS[n].fotos.length * POR_FOTO);

export default function Sistema() {
  const [i, setI] = useState(0);
  const [foto, setFoto] = useState(0);
  const [quieta, setQuieta] = useState(false);
  const [visible, setVisible] = useState(false);
  const zona = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = zona.current;
    if (!nodo || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  // Las pantallas de un módulo pasan solas; al acabar, el siguiente módulo.
  useEffect(() => {
    if (!visible) return;
    const fotos = MODULOS[i].fotos.length;
    const t = setTimeout(() => {
      if (foto < fotos - 1) setFoto(foto + 1);
      else if (!quieta) {
        setI((i + 1) % MODULOS.length);
        setFoto(0);
      } else setFoto(0);
    }, fotos > 1 ? POR_FOTO : durDe(i));
    return () => clearTimeout(t);
  }, [i, foto, quieta, visible]);

  // En el móvil, la píldora activa se queda a la vista.
  useEffect(() => {
    const b = lista.current?.children[i] as HTMLElement | undefined;
    const l = lista.current;
    if (!b || !l || l.scrollWidth <= l.clientWidth) return;
    l.scrollTo({ left: b.offsetLeft - l.clientWidth / 2 + b.clientWidth / 2, behavior: "smooth" });
  }, [i]);

  const elige = (n: number) => {
    setI(n);
    setFoto(0);
    setQuieta(true);
  };

  return (
    <div className={s.sistema} ref={zona}>
      <div>
        <div
          ref={lista}
          className={s.modulos}
          role="tablist"
          aria-orientation="vertical"
          data-quieta={quieta || !visible ? "" : undefined}
          style={{ ["--dur" as string]: `${durDe(i)}ms` }}
        >
          {MODULOS.map((m, n) => (
            <button key={m.t} type="button" role="tab" aria-selected={n === i} className={s.modulo} onClick={() => elige(n)}>
              <b>{m.t}</b>
              <span>{m.d}</span>
            </button>
          ))}
        </div>
        <p className={s.sistemaTexto} aria-live="polite">{MODULOS[i].d}</p>
      </div>
      <div className={s.sistemaMovil} aria-hidden>
        <span className={s.sistemaHalo} />
        <div className={s.movil}>
          <div className={s.pantalla}>
            <span className={s.isla} />
            {MODULOS.flatMap((m, n) =>
              m.fotos.map((f, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={`${n}-${f}`} src={`/inicio/carta-${f}.webp`} alt="" loading="lazy" data-activa={n === i && k === foto ? "" : undefined} />
              )),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

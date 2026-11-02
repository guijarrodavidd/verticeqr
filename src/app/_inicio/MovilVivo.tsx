"use client";

import { useEffect, useRef, useState } from "react";
import s from "./inicio.module.css";

export const CARTA_NOOE = "/d/nooe-a332/nooe-maldives/carta?hab=214&idioma=es";

const AVISOS = [
  { cls: s.aviso1, hab: "Hab. 214", que: "Pizza y dos cervezas", cuanto: "31 €" },
  { cls: s.aviso2, hab: "Hab. 305", que: "Masaje de 55 min", cuanto: "70 €" },
  { cls: s.aviso3, hab: "Hab. 108", que: "Salida tardía hasta las 15:00", cuanto: "40 €" },
];

// El producto de la portada: el panel del director detrás y la carta de NOOE
// de verdad en el móvil. En un ordenador la carta se toca dentro del móvil.
// En un teléfono no se monta: el dedo movería la carta y no la página, así
// que se ve la pantalla de entrada y un botón la abre a pantalla completa.
export default function MovilVivo() {
  const [montada, setMontada] = useState(false);
  const [lista, setLista] = useState(false);
  const [grande, setGrande] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 861px) and (pointer: fine)");
    const mira = () => setGrande(mq.matches);
    mira();
    mq.addEventListener?.("change", mira);
    return () => mq.removeEventListener?.("change", mira);
  }, []);

  useEffect(() => {
    if (!grande || montada) return;
    let cancelado = false;
    const ir = () => !cancelado && setMontada(true);
    const nodo = caja.current;
    nodo?.addEventListener("pointerenter", ir, { passive: true, once: true });
    const ocioso = () => {
      const ric = window.requestIdleCallback;
      if (ric) ric(ir, { timeout: 2500 });
      else setTimeout(ir, 1200);
    };
    if (document.readyState === "complete") ocioso();
    else window.addEventListener("load", ocioso, { once: true });
    return () => {
      cancelado = true;
      nodo?.removeEventListener("pointerenter", ir);
      window.removeEventListener("load", ocioso);
    };
  }, [grande, montada]);

  return (
    <div className={s.producto} data-aparece="" style={{ ["--d" as string]: 3 }}>
      <div className={s.productoPanel} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/inicio/panel-resumen.webp" alt="" />
      </div>
      <div className={s.productoMovil} ref={caja}>
        <div className={s.movil}>
          <div className={s.pantalla}>
            <span className={s.isla} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hotel/demo-poster-nooe.webp"
              alt="Carta de NOOE Maldivas en el móvil del huésped"
              className={`${s.poster} ${lista ? s.posterFuera : ""}`}
              fetchPriority="high"
              decoding="async"
            />
            {grande && montada && (
              <iframe src={CARTA_NOOE} title="Carta de NOOE Maldivas, demo real" className={s.marco} loading="lazy" onLoad={() => setLista(true)} />
            )}
            {!grande && (
              <a href={CARTA_NOOE} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonCristal} ${s.cristal} ${s.abrirCarta}`}>
                Abrir la carta <span>→</span>
              </a>
            )}
          </div>
        </div>
      </div>
      {AVISOS.map((a, n) => (
        <div key={a.hab} className={`${s.aviso} ${s.cristal} ${a.cls}`} style={{ ["--n" as string]: n }} aria-hidden>
          <span className={s.avisoIcono}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/inicio/v-blanca.png" alt="" />
          </span>
          <span>
            <small>{a.hab}</small>
            <b>{a.que}</b>
          </span>
          <em>{a.cuanto}</em>
        </div>
      ))}
    </div>
  );
}

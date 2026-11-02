"use client";

import { useEffect, useRef, useState } from "react";
import s from "./inicio.module.css";

export const CARTA_NOOE = "/d/nooe-a332/nooe-maldives/carta?hab=214&idioma=es";

const AVISOS = [
  { cls: s.aviso1, hab: "Hab. 214", que: "Pizza y dos cervezas", cuanto: "31 €" },
  { cls: s.aviso2, hab: "Hab. 108", que: "Salida tardía hasta las 15:00", cuanto: "40 €" },
  { cls: s.aviso3, hab: "Hab. 305", que: "Masaje de 55 min", cuanto: "70 €" },
  { cls: s.aviso4, hab: "Hab. 112", que: "Mesa a las 21:00 · 2 pers.", cuanto: "" },
];

// El móvil de la portada lleva la carta de NOOE de verdad, navegable.
// Pesa, así que primero se ve un póster con su misma pantalla de entrada y la
// carta se monta cuando la página ya ha cargado o en cuanto alguien la toca.
export default function MovilVivo() {
  const [montada, setMontada] = useState(false);
  const [lista, setLista] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (montada) return;
    let cancelado = false;
    const ir = () => !cancelado && setMontada(true);
    const nodo = caja.current;
    const eventos = ["pointerenter", "pointerdown", "touchstart"] as const;
    eventos.forEach((e) => nodo?.addEventListener(e, ir, { passive: true, once: true }));
    const ocioso = () => {
      const ric = window.requestIdleCallback;
      if (ric) ric(ir, { timeout: 2500 });
      else setTimeout(ir, 1200);
    };
    if (document.readyState === "complete") ocioso();
    else window.addEventListener("load", ocioso, { once: true });
    return () => {
      cancelado = true;
      eventos.forEach((e) => nodo?.removeEventListener(e, ir));
      window.removeEventListener("load", ocioso);
    };
  }, [montada]);

  return (
    <div className={s.movilZona} ref={caja}>
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
          {montada && (
            <iframe src={CARTA_NOOE} title="Carta de NOOE Maldivas, demo real" className={s.marco} loading="lazy" onLoad={() => setLista(true)} />
          )}
        </div>
        <span className={`${s.pildora} ${s.iris} ${s.sello}`}>
          <span className={s.punto} /> Carta real · tócala
        </span>
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
          {a.cuanto && <em>{a.cuanto}</em>}
        </div>
      ))}
    </div>
  );
}

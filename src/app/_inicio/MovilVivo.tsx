"use client";

import s from "./inicio.module.css";
import { BotonCarta } from "./VisorCarta";

const AVISOS = [
  { cls: s.aviso1, hab: "Hab. 214", que: "Pizza y dos cervezas", cuanto: "31 €" },
  { cls: s.aviso2, hab: "Hab. 305", que: "Masaje de 55 min", cuanto: "70 €" },
  { cls: s.aviso3, hab: "Hab. 108", que: "Salida tardía hasta las 15:00", cuanto: "40 €" },
];

// El producto de la portada: el panel de análisis en una tablet, de
// protagonista, y la carta del huésped en un móvil pequeño delante. Al tocar
// el móvil, la carta se abre dentro de la misma web.
export default function MovilVivo() {
  return (
    <div className={s.producto} data-aparece="" style={{ ["--d" as string]: 3 }}>
      <div className={`${s.tablet} ${s.productoTablet}`}>
        <div className={s.tabletPantalla}>
          <picture>
            <source media="(max-width: 860px)" srcSet="/inicio/panel-resumen-movil.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/inicio/panel-resumen.webp" alt="Resumen del panel de análisis de Vértice" fetchPriority="high" />
          </picture>
        </div>
      </div>
      <div className={s.productoMovil}>
        <div className={s.movil}>
          <div className={s.pantalla}>
            <span className={s.isla} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hotel/demo-poster-nooe.webp" alt="" className={s.poster} decoding="async" />
            <BotonCarta className={s.tocaCarta}>
              <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Abrir la carta de NOOE Maldivas</span>
            </BotonCarta>
          </div>
        </div>
        <span className={`${s.sello} ${s.cristal} ${s.iris}`}>Tócala</span>
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

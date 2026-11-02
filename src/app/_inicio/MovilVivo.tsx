"use client";

import s from "./inicio.module.css";

const AVISOS = [
  { cls: s.aviso1, hab: "Hab. 214", que: "Pizza y dos cervezas", cuanto: "31 €" },
  { cls: s.aviso2, hab: "Hab. 305", que: "Masaje de 55 min", cuanto: "70 €" },
  { cls: s.aviso3, hab: "Hab. 108", que: "Salida tardía hasta las 15:00", cuanto: "40 €" },
];

// El producto de la portada: el panel de análisis en una tablet, con los
// pedidos que van llegando alrededor. Sin la carta de ningún hotel real: su
// material es suyo y solo puede ir en la demo privada que se le enseña a él.
export default function MovilVivo() {
  return (
    <div className={`${s.producto} ${s.productoSolo}`} data-aparece="" style={{ ["--d" as string]: 3 }}>
      <div className={`${s.tablet} ${s.productoTablet}`}>
        <div className={s.tabletPantalla}>
          <picture>
            <source media="(max-width: 860px)" srcSet="/inicio/panel-resumen-movil.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/inicio/panel-resumen.webp" alt="Resumen del panel de análisis de Vértice" fetchPriority="high" />
          </picture>
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

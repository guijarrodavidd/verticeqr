import type { ReactNode } from "react";
import { CALENDLY_URL } from "@/lib/site";
import Aparecer from "./_inicio/Aparecer";
import Cabecera from "./_inicio/Cabecera";
import Titular from "./_inicio/Titular";
import MovilVivo, { CARTA_NOOE } from "./_inicio/MovilVivo";
import Ruido from "./_inicio/Ruido";
import Historia from "./_inicio/Historia";
import Panel from "./_inicio/Panel";
import Carrusel, { Flechas } from "./_inicio/Carrusel";
import Preguntas from "./_inicio/Preguntas";
import s from "./_inicio/inicio.module.css";

// Portada de Vértice desde noviembre de 2026. Poco texto: cada bloque se
// entiende tocándolo o viéndolo moverse al deslizar.

const CINTA = ["Room service", "Spa y masajes", "Mesas", "Salida tardía", "Excursiones", "Traslados", "Minibar", "Guía de la ciudad", "Avisos de quejas", "Reseñas"];

const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const CAPACIDADES: { t: string; icono: ReactNode }[] = [
  { t: "Pedidos a la habitación", icono: <svg viewBox="0 0 24 24" {...trazo}><path d="M4 16h16M5 16a7 7 0 0 1 14 0M12 9V7M10 7h4M3 19h18" /></svg> },
  { t: "Spa y masajes con hora", icono: <svg viewBox="0 0 24 24" {...trazo}><path d="M12 20c-4.5 0-8-2.6-8-6.5 2.7 0 5.3 1.1 8 3.6 2.7-2.5 5.3-3.6 8-3.6 0 3.9-3.5 6.5-8 6.5Z" /><path d="M12 17.1c-2-2.3-2.6-5.4-1.4-8.6.4-1 .9-1.9 1.4-2.5.5.6 1 1.5 1.4 2.5 1.2 3.2.6 6.3-1.4 8.6Z" /></svg> },
  { t: "Mesa en el restaurante", icono: <svg viewBox="0 0 24 24" {...trazo}><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10" /><path d="M17 21V3c-2.2 1.2-3.5 3.6-3.5 6.5V13H17" /></svg> },
  { t: "Salida tardía y mejoras", icono: <svg viewBox="0 0 24 24" {...trazo}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg> },
  { t: "Excursiones de la zona", icono: <svg viewBox="0 0 24 24" {...trazo}><path d="M12 21s-6.5-5.4-6.5-11a6.5 6.5 0 0 1 13 0c0 5.6-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></svg> },
  { t: "Guía de la ciudad", icono: <svg viewBox="0 0 24 24" {...trazo}><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" /><path d="M9 4v14M15 6v14" /></svg> },
  { t: "Avisos de quejas al momento", icono: <svg viewBox="0 0 24 24" {...trazo}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M12 7v4M12 14h.01" /></svg> },
  { t: "En el idioma del huésped", icono: <svg viewBox="0 0 24 24" {...trazo}><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5S9.7 5.9 12 3.5Z" /></svg> },
];

const vuelta = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 12a8 8 0 1 1-2.4-5.7" /><path d="M20 4v4.5h-4.5" /></svg>;

function Cabeza({ pildora, titulo, texto, centro }: { pildora: string; titulo: ReactNode; texto?: string; centro?: boolean }) {
  return (
    <div className={`${s.cabezaSeccion} ${centro ? s.cabezaCentro : ""}`}>
      <span className={`${s.pildora} ${s.iris}`} data-aparece="">
        <span className={s.punto} /> {pildora}
      </span>
      <h2 className={s.titulo} data-aparece="" style={{ ["--d" as string]: 1 }}>{titulo}</h2>
      {texto && <p className={s.entradilla} data-aparece="" style={{ ["--d" as string]: 2 }}>{texto}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <div className={s.pagina} data-pagina="">
      <Aparecer />
      <Cabecera />

      {/* ============ PORTADA ============ */}
      <section className={s.portada}>
        <div className={`${s.envoltura} ${s.portadaRejilla}`}>
          <div className={s.portadaTexto}>
            <span className={`${s.pildora} ${s.iris}`}>
              <span className={s.punto} /> Hecho para hoteles
            </span>
            <Titular />
            <p className={s.portadaSub}>Desde su móvil, sin descargar nada y sin llamar a recepción.</p>
            <div className={s.botones}>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonOscuro}`}>
                Reserva una llamada <span>→</span>
              </a>
              <a href={CARTA_NOOE} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonCristal} ${s.cristal} ${s.iris}`}>
                Prueba una carta real
              </a>
            </div>
            <p className={s.nota}>20 minutos, con los números de tu hotel.</p>
          </div>
          <MovilVivo />
        </div>
      </section>

      <div className={s.cinta} aria-hidden>
        <div className={s.cintaPista}>
          {[...CINTA, ...CINTA].map((c, n) => (
            <span key={n}>{c}</span>
          ))}
        </div>
      </div>

      {/* ============ EL RUIDO DE RECEPCIÓN ============ */}
      <Ruido />

      {/* ============ TODO EN UN QR ============ */}
      <section className={s.seccion} id="todo">
        <div className={s.envoltura}>
          <Cabeza pildora="Un solo QR" titulo="Todo lo que vende tu hotel, en el móvil del huésped." />
          <div className={s.capacidades}>
            {CAPACIDADES.map((c, n) => (
              <div key={c.t} className={s.capacidad} data-aparece="" style={{ ["--d" as string]: n }}>
                <span className={s.capIcono}>{c.icono}</span>
                <span className={s.capNombre}>{c.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <div className={s.marquesina} aria-hidden>
        <div className={s.marquesinaPista}>
          {[0, 1, 2, 3].map((n) => (
            <span key={n}>Cómo funciona {vuelta}</span>
          ))}
        </div>
      </div>
      <section className={s.seccion} id="como" style={{ paddingTop: 40 }}>
        <div className={s.envoltura}>
          <Cabeza pildora="Un pedido de verdad" titulo="Así pide un huésped a las 22:40" />
          <Historia />
        </div>
      </section>

      {/* ============ EL PANEL ============ */}
      <section className={`${s.seccion} ${s.panelSeccion}`} id="panel">
        <div className={s.envoltura}>
          <Cabeza
            centro
            pildora="Panel de dirección"
            titulo="Dos hoteles igual de llenos pueden ganar muy distinto."
            texto="El panel te enseña dónde está la diferencia en el tuyo."
          />
          <Panel />
        </div>
      </section>

      {/* ============ LO QUE SE VENDE ============ */}
      <section className={s.seccion} id="vende" style={{ paddingBottom: 60 }}>
        <div className={`${s.envoltura} ${s.cabezaFila}`}>
          <Cabeza pildora="Qué se vende" titulo="Lo que tu huésped compraría si se lo pones delante." />
          <Flechas objetivo="carrusel-vende" />
        </div>
        <Carrusel id="carrusel-vende" />
      </section>

      {/* ============ PREGUNTAS ============ */}
      <section className={s.seccion} id="preguntas">
        <div className={s.envoltura}>
          <Cabeza pildora="Preguntas" titulo="Lo que nos preguntan los directores" />
          <Preguntas />
        </div>
      </section>

      {/* ============ CIERRE ============ */}
      <section className={`${s.seccion} ${s.cierre}`}>
        <div className={s.envoltura}>
          <div className={`${s.cierreLogo} ${s.cristal} ${s.iris}`} data-aparece="">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/vertice-wordmark-dark.png" alt="Vértice" />
          </div>
          <h2 className={s.titulo} data-aparece="" style={{ ["--d" as string]: 1 }}>
            Tu huésped ya está dentro del hotel. Ponle el botón delante.
          </h2>
          <div className={s.botones} data-aparece="" style={{ ["--d" as string]: 2 }}>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonOscuro}`}>
              Reserva una llamada <span>→</span>
            </a>
            <a href={CARTA_NOOE} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonCristal} ${s.cristal} ${s.iris}`}>
              Prueba una carta real
            </a>
          </div>
          <p className={s.cierreNota}>20 minutos, con los números de tu hotel.</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.logoGigante} src="/vertice-wordmark-dark.png" alt="" aria-hidden />
      </section>

      {/* ============ PIE ============ */}
      <footer className={s.pie}>
        <div className={`${s.envoltura} ${s.pieDentro}`}>
          <div className={s.pieMarca}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.logo} src="/vertice-wordmark-dark.png" alt="Vértice" />
            <p>Más ingreso por cada huésped, con el mismo equipo.</p>
          </div>
          <nav className={s.pieEnlaces}>
            <a href={CARTA_NOOE} target="_blank" rel="noopener noreferrer">Prueba una carta</a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">Reserva una llamada</a>
            <a href="/privacidad">Privacidad</a>
            <a href="/cookies">Cookies</a>
            <a href="/terminos">Términos</a>
            <a href="/login">Acceder</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

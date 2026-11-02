import { CALENDLY_URL } from "@/lib/site";
import Aparecer from "./_inicio/Aparecer";
import Cabecera from "./_inicio/Cabecera";
import MovilVivo, { CARTA_NOOE } from "./_inicio/MovilVivo";
import Ruido from "./_inicio/Ruido";
import Sistema from "./_inicio/Sistema";
import Panel from "./_inicio/Panel";
import Caso from "./_inicio/Caso";
import Preguntas from "./_inicio/Preguntas";
import s from "./_inicio/inicio.module.css";

// Portada de Vértice desde noviembre de 2026, limpia como una página de
// producto de Apple: una idea por pantalla y el producto de protagonista.

const VENTAJAS = [
  { b: "Las horas que ahorra tu equipo", t: "Cada pedido y cada consulta que ya no pasan por el teléfono." },
  { b: "Lo que entra de más", t: "Día a día, comparado con el mes anterior." },
  { b: "El dinero sin recoger", t: "Dónde se queda la venta y qué activar para cogerla." },
  { b: "El informe para la propiedad", t: "En PDF o por WhatsApp, listo para el cierre de mes." },
];

const vuelta = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M20 12a8 8 0 1 1-2.4-5.7" />
    <path d="M20 4v4.5h-4.5" />
  </svg>
);

export default function Home() {
  return (
    <div className={s.pagina} data-pagina="">
      <Aparecer />
      <Cabecera />

      {/* ============ PORTADA ============ */}
      <section className={s.portada}>
        <div className={s.envoltura}>
          <h1 className={s.h1} data-aparece="">
            Tu hotel está lleno. <span>Y se le escapa dinero en cada habitación.</span>
          </h1>
          <p className={s.portadaSub} data-aparece="" style={{ ["--d" as string]: 1 }}>
            Vértice vende desde el móvil del huésped lo que hoy se queda sin pedir. Y tú lo ves todo en un panel.
          </p>
          <div className={s.botones} data-aparece="" style={{ ["--d" as string]: 2 }}>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonOscuro}`}>
              Reserva una llamada <span>→</span>
            </a>
            <a href={CARTA_NOOE} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonCristal} ${s.cristal} ${s.iris}`}>
              Prueba una carta real
            </a>
          </div>
          <MovilVivo />
        </div>
      </section>

      {/* ============ LA RECEPCIÓN A LAS 22:40 ============ */}
      <Ruido />

      {/* ============ EL SISTEMA ============ */}
      <section className={s.seccion} id="sistema" style={{ paddingTop: 0 }}>
        <div className={s.marquesina} aria-hidden>
          <div className={s.marquesinaPista}>
            {[0, 1, 2, 3].map((n) => (
              <span key={n}>Cómo funciona {vuelta}</span>
            ))}
          </div>
        </div>
        <div className={s.envoltura} style={{ marginTop: "clamp(50px, 7vw, 90px)" }}>
          <h2 className={s.titulo} data-aparece="">
            Del móvil del huésped a tu panel, sin pasar por el teléfono. <span>Toca cada parte.</span>
          </h2>
          <Sistema />
        </div>
      </section>

      {/* ============ EL PANEL ============ */}
      <section className={`${s.seccion} ${s.gris}`} id="panel">
        <div className={`${s.envoltura} ${s.centro}`}>
          <h2 className={s.titulo} data-aparece="">Dos hoteles igual de llenos pueden ganar muy distinto.</h2>
          <p className={s.entradilla} data-aparece="" style={{ ["--d" as string]: 1 }}>
            El panel te enseña dónde está la diferencia en el tuyo.
          </p>
        </div>
        <div className={s.envoltura}>
          <Panel />
          <div className={s.ventajas}>
            {VENTAJAS.map((v, n) => (
              <div key={v.b} className={s.ventaja} data-aparece="" style={{ ["--d" as string]: n }}>
                <b>{v.b}</b>
                <span>{v.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EL CASO ============ */}
      <section className={s.seccion} id="caso">
        <div className={s.envoltura}>
          <h2 className={s.titulo} data-aparece="">
            Lo que puede dejar en un mes. <span>Con números.</span>
          </h2>
          <Caso />
        </div>
      </section>

      {/* ============ PREGUNTAS ============ */}
      <section className={`${s.seccion} ${s.gris}`} id="preguntas">
        <div className={s.envoltura}>
          <h2 className={s.titulo} data-aparece="">Lo que nos preguntan los directores</h2>
          <Preguntas />
        </div>
      </section>

      {/* ============ CIERRE ============ */}
      <section className={`${s.seccion} ${s.cierre}`}>
        <div className={s.envoltura}>
          <h2 className={s.titulo} data-aparece="">
            Tu huésped ya está dentro del hotel. <span>Ponle el botón delante.</span>
          </h2>
          <div className={s.botones} data-aparece="" style={{ ["--d" as string]: 1 }}>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonOscuro}`}>
              Reserva una llamada <span>→</span>
            </a>
            <a href={CARTA_NOOE} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonCristal} ${s.cristal} ${s.iris}`}>
              Prueba una carta real
            </a>
          </div>
          <p className={s.nota}>20 minutos, con los números de tu hotel.</p>
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

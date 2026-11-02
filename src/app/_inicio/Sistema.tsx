"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./inicio.module.css";

// Cada parte del sistema con su propia escena animada. Las escenas se
// vuelven a montar al cambiar de parte, así que su animación empieza de cero.

const Pedido = () => (
  <div className={s.ui}>
    <div className={s.uiCab}>
      <span>
        <small>Hab. 214 · 22:40</small>
        <b>Tu pedido</b>
      </span>
    </div>
    <ul className={s.lineas}>
      <li className={s.aparece} style={{ ["--t" as string]: "0.3s" }}><span>1×</span>Pizza margarita <em>18 €</em></li>
      <li className={s.aparece} style={{ ["--t" as string]: "0.75s" }}><span>2×</span>Cerveza <em>13 €</em></li>
    </ul>
    <div className={`${s.uiTotal} ${s.aparece}`} style={{ ["--t" as string]: "1.2s" }}>
      <span>Total</span>
      <b>31 €</b>
    </div>
    <div className={s.estados}>
      <div className={s.estado}><i style={{ ["--t" as string]: "1.7s" }} />Recibido</div>
      <div className={s.estado}><i style={{ ["--t" as string]: "2.4s" }} />En cocina</div>
      <div className={s.estado}><i style={{ ["--t" as string]: "3.2s" }} />En camino</div>
    </div>
  </div>
);

const Spa = () => (
  <div className={s.ui}>
    <div className={s.uiCab}>
      <span>
        <small>Spa · 55 min</small>
        <b>Masaje relajante</b>
      </span>
      <em>70 €</em>
    </div>
    <div className={s.dias}>
      <span>Hoy</span><span>Mañ.</span><span>Jue</span><span>Vie</span><span>Sáb</span>
    </div>
    <div className={s.horas}>
      <span>10:00</span><span className={s.llena}>12:00</span><span>16:00</span>
      <span className={s.elige}>18:00</span><span className={s.llena}>19:00</span><span>20:00</span>
    </div>
    <div className={`${s.confirma} ${s.aparece}`} style={{ ["--t" as string]: "1.9s" }}>
      <i>✓</i> Cabina 2 · hoy a las 18:00
    </div>
  </div>
);

const Mesa = () => (
  <div className={s.ui}>
    <div className={s.uiCab}>
      <span>
        <small>Restaurante</small>
        <b>Reservar mesa</b>
      </span>
    </div>
    <div className={s.mesaDatos}>
      <span>2 personas</span>
      <span>Hoy · 21:00</span>
    </div>
    <div className={s.plano}>
      {["libre", "ocupada", "libre", "ocupada", "ocupada", "elegida", "libre", "ocupada"].map((m, n) => (
        <span key={n} className={`${s.mesaR} ${m === "ocupada" ? s.ocupada : m === "elegida" ? s.elegida : ""}`}>2</span>
      ))}
    </div>
    <div className={`${s.confirma} ${s.aparece}`} style={{ ["--t" as string]: "2s" }}>
      <i>✓</i> Mesa en la terraza · 21:00
    </div>
  </div>
);

const Salida = () => (
  <div className={s.ui}>
    <div className={s.uiCab}>
      <span>
        <small>Hab. 108 · último día</small>
        <b>Salida tardía</b>
      </span>
    </div>
    <div className={s.reloj}>
      <span className={s.relleno} />
      <span className={s.tirador}><b>15:00</b></span>
    </div>
    <div className={s.marcas}>
      <span>12:00</span><span>13:00</span><span>14:00</span><span>15:00</span><span>16:00</span><span>17:00</span><span>18:00</span>
    </div>
    <div className={`${s.precioSalta} ${s.aparece}`} style={{ ["--t" as string]: "2s" }}>
      <span>Sale a las 15:00</span>
      <b>+40 €</b>
    </div>
  </div>
);

const Aviso = () => (
  <div className={s.ui}>
    <div className={s.uiCab}>
      <span>
        <small>Hab. 412</small>
        <b>¿Algo no va bien?</b>
      </span>
    </div>
    <div className={s.tipos}>
      <span className={s.elige}>Aire</span><span>Agua caliente</span><span>Ruido</span><span>Wifi</span><span>Limpieza</span>
    </div>
    <div className={`${s.cuenta} ${s.aparece}`} style={{ ["--t" as string]: "1.2s" }}>
      <svg className={s.anilloReloj} viewBox="0 0 58 58" aria-hidden>
        <circle className={s.fondoAnillo} cx="29" cy="29" r="24" />
        <circle className={s.avance} cx="29" cy="29" r="24" />
      </svg>
      <div className={s.cuentaTexto}>
        <span className={s.antesTxt}>Mantenimiento en camino<small>Llega en 10 minutos</small></span>
        <span className={s.despuesTxt}>Resuelto en 12 minutos<small>Antes de que llegue a la reseña</small></span>
      </div>
    </div>
  </div>
);

const Excursion = () => (
  <div className={s.ui}>
    <div className={s.uiCab}>
      <span>
        <small>Guía de la zona</small>
        <b>Barco al atardecer</b>
      </span>
      <em>190 €</em>
    </div>
    <div className={s.mapa}>
      <svg viewBox="0 0 340 200" aria-hidden>
        <path className={s.tierra} d="M0 120 C 40 110, 70 150, 110 160 C 150 170, 170 200, 0 200 Z" />
        <path className={s.tierra} d="M260 40 C 290 20, 330 30, 340 50 L 340 110 C 320 120, 280 100, 262 80 Z" />
        <path className={s.ruta} d="M 52 150 C 120 60, 220 190, 300 70" />
        <circle className={s.pin} cx="52" cy="150" r="6" />
        <circle className={s.pin} cx="300" cy="70" r="6" />
      </svg>
    </div>
    <div className={`${s.billete} ${s.aparece}`} style={{ ["--t" as string]: "2.1s" }}>
      <span>
        <b>Mañana · 17:30</b>
        <small>2 plazas · recepción las confirma</small>
      </span>
      <span>✓</span>
    </div>
  </div>
);

const MODULOS: { t: string; d: string; panel: string; fin: string; Escena: () => ReactNode }[] = [
  { t: "Pedir a la habitación", d: "El pedido llega a cocina con la habitación y la hora. Nadie coge el teléfono.", panel: "+31 € en tu panel", fin: "3.5s", Escena: Pedido },
  { t: "Reservar el spa", d: "Elige día y hora, y la cabina queda reservada.", panel: "+70 € en tu panel", fin: "2.5s", Escena: Spa },
  { t: "Reservar mesa", d: "Personas, hora y zona, sin pasar por recepción.", panel: "2 cubiertos más en tu panel", fin: "2.6s", Escena: Mesa },
  { t: "Salida tardía", d: "Se ofrece la noche antes de irse y se cobra con la cuenta.", panel: "+40 € en tu panel", fin: "2.5s", Escena: Salida },
  { t: "Avisar de un problema", d: "Lo recibe el turno y se arregla mientras el huésped sigue en el hotel.", panel: "Resuelto antes de la reseña", fin: "3.8s", Escena: Aviso },
  { t: "Excursiones", d: "Reserva la salida desde la guía y recepción confirma las plazas.", panel: "+190 € en tu panel", fin: "2.7s", Escena: Excursion },
];
const DURACION = 6200;

export default function Sistema() {
  const [i, setI] = useState(0);
  const [quieta, setQuieta] = useState(false);
  const [visible, setVisible] = useState(false);
  const [vuelta, setVuelta] = useState(0);
  const zona = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = zona.current;
    if (!nodo || typeof IntersectionObserver === "undefined") return;
    // Solo para y arranca el paso automático. La escena no se desmonta al salir
    // de la pantalla: si lo hacía, la sección cambiaba de alto y en el móvil
    // todo lo de debajo daba un salto mientras se deslizaba.
    const obs = new IntersectionObserver(([e]) => {
      setVisible((antes) => {
        if (e.isIntersecting && !antes) setVuelta((v) => v + 1);
        return e.isIntersecting;
      });
    }, { threshold: 0.3 });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  // El portátil entra inclinado desde abajo y se endereza al llegar al centro.
  const portatil = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const v = portatil.current;
    if (!v || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let marco = 0;
    const calcula = () => {
      marco = 0;
      const r = v.getBoundingClientRect();
      const alto = window.innerHeight;
      const p = Math.min(1, Math.max(0, (r.top - alto * 0.12) / (alto * 0.6)));
      v.style.setProperty("--p", p.toFixed(3));
    };
    const alMover = () => {
      if (!marco) marco = requestAnimationFrame(calcula);
    };
    calcula();
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    return () => {
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
      if (marco) cancelAnimationFrame(marco);
    };
  }, []);

  useEffect(() => {
    if (!visible || quieta) return;
    const t = setTimeout(() => setI((v) => (v + 1) % MODULOS.length), DURACION);
    return () => clearTimeout(t);
  }, [i, visible, quieta]);

  // Al tocar una parte se queda quieta para mirarla; si en 10 segundos no se
  // toca nada más, vuelve a pasar sola.
  useEffect(() => {
    if (!quieta) return;
    const t = setTimeout(() => setQuieta(false), 10000);
    return () => clearTimeout(t);
  }, [quieta, i]);

  useEffect(() => {
    const b = lista.current?.children[i] as HTMLElement | undefined;
    const l = lista.current;
    if (!b || !l || l.scrollWidth <= l.clientWidth) return;
    l.scrollTo({ left: b.offsetLeft - l.clientWidth / 2 + b.clientWidth / 2, behavior: "smooth" });
  }, [i]);

  const m = MODULOS[i];
  const Escena = m.Escena;
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
              setVuelta((v) => v + 1);
            }}
          >
            {x.t}
          </button>
        ))}
      </div>

      <div className={s.portatil} ref={portatil}>
      <div className={s.portatilPantalla}>
      <div className={s.escenario} key={`${i}-${vuelta}`}>
        <div className={s.escenaTexto} aria-live="polite">
          <h3 className={s.aparece}>{m.t}</h3>
          <p className={s.aparece} style={{ ["--t" as string]: "0.1s" }}>{m.d}</p>
          <span className={s.escenaPanel} style={{ ["--fin" as string]: m.fin }}>
            <i>↗</i>
            <b>{m.panel}</b>
          </span>
        </div>
        <div className={s.escenaVista} aria-hidden>
          <Escena />
        </div>
      </div>
      </div>
      <div className={s.portatilBase} aria-hidden />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import s from "./inicio.module.css";

const VISTAS = [
  { id: "resumen", nombre: "Resumen", t: "El mes de un vistazo", d: "Las horas que se ahorra tu equipo y lo que ha entrado de más." },
  { id: "oportunidades", nombre: "Oportunidades", t: "El dinero que se queda sin recoger", d: "Cada señal con su cifra y lo que puedes activar en un toque." },
  { id: "ingresos", nombre: "Ingresos", t: "Qué se vende y a qué hora", d: "Ticket medio, ingreso por huésped y las horas punta de cada día." },
  { id: "resenas", nombre: "Reseñas", t: "Lo que opina el huésped mientras sigue aquí", d: "Valoración del servicio, tiempos de entrega y avisos resueltos." },
  { id: "huespedes", nombre: "Huéspedes", t: "Qué habitaciones compran y cuáles no", d: "Planta por planta, con los idiomas de tus huéspedes." },
  { id: "informe", nombre: "Informe", t: "El informe para la propiedad, hecho", d: "En PDF, por WhatsApp o por correo, cada lunes." },
];
const DURACION = 6000;

// El panel, que es lo que más valoran los directores en las demos.
// Las pestañas pasan solas mientras se ve la sección; al tocar una, se para.
// La ventana entra inclinada y se endereza al bajar.
export default function Panel() {
  const [i, setI] = useState(0);
  const [quieta, setQuieta] = useState(false);
  const [visible, setVisible] = useState(false);
  const zona = useRef<HTMLDivElement>(null);
  const ventana = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = zona.current;
    if (!nodo || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (quieta || !visible) return;
    const t = setTimeout(() => setI((v) => (v + 1) % VISTAS.length), DURACION);
    return () => clearTimeout(t);
  }, [i, quieta, visible]);

  useEffect(() => {
    const v = ventana.current;
    if (!v || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let marco = 0;
    const calcula = () => {
      marco = 0;
      const r = v.getBoundingClientRect();
      const alto = window.innerHeight;
      // 1 cuando la ventana asoma por abajo, 0 cuando ya está en el centro.
      const p = Math.min(1, Math.max(0, (r.top - alto * 0.18) / (alto * 0.62)));
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

  const vista = VISTAS[i];
  return (
    <div ref={zona}>
      <div className={`${s.pestanas} ${s.cristal}`} role="tablist" data-quieta={quieta || !visible ? "" : undefined} style={{ ["--dur" as string]: `${DURACION}ms` }}>
        {VISTAS.map((v, n) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={n === i}
            className={s.pestana}
            onClick={() => {
              setI(n);
              setQuieta(true);
            }}
          >
            {v.nombre}
          </button>
        ))}
      </div>
      <div className={s.panelEscena}>
        <div className={s.beneficio} aria-live="polite">
          <h3 key={`t-${vista.id}`} data-cambia="">{vista.t}</h3>
          <p key={`d-${vista.id}`} data-cambia="">{vista.d}</p>
        </div>
        <div className={s.ventana} ref={ventana}>
          <div className={s.ventanaBarra}>
            <i /><i /><i />
            <span>Panel de dirección · {vista.nombre}</span>
          </div>
          <div className={s.ventanaFotos}>
            {VISTAS.map((v, n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={v.id} src={`/inicio/panel-${v.id}.webp`} alt={n === i ? `Panel de dirección, vista ${v.nombre}` : ""} loading="lazy" data-activa={n === i ? "" : undefined} />
            ))}
            <span className={`${s.pildora} ${s.datosDemo}`}>Datos de demostración</span>
          </div>
        </div>
      </div>
    </div>
  );
}

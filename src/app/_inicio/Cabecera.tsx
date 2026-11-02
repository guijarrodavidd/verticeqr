"use client";

import { useEffect, useRef, useState } from "react";
import { CALENDLY_URL } from "@/lib/site";
import s from "./inicio.module.css";

// Barra de arriba: transparente sobre la portada y de cristal al bajar.
// El aviso llega de un testigo de 1px, no de escuchar el scroll.
export default function Cabecera() {
  const [fija, setFija] = useState(false);
  const testigo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = testigo.current;
    if (!nodo || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setFija(!e.isIntersecting), { threshold: 0 });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div ref={testigo} aria-hidden style={{ position: "absolute", top: 12, height: 1, width: 1 }} />
      <header className={`${s.cabecera} ${fija ? s.cabeceraFija : ""}`}>
        <div className={`${s.envoltura} ${s.cabeceraDentro}`}>
          <a href="/" aria-label="Vértice, inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.logo} src="/vertice-wordmark-dark.png" alt="Vértice" />
          </a>
          <nav className={s.menu}>
            <a href="#como">Cómo funciona</a>
            <a href="#panel">El panel</a>
            <a href="#vende">Qué se vende</a>
            <a href="/login">Acceder</a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonOscuro}`}>
              Reserva una llamada
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}

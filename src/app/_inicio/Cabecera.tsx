"use client";

import { useEffect, useRef, useState } from "react";
import { CALENDLY_URL } from "@/lib/site";
import s from "./inicio.module.css";

const ENLACES = [
  { href: "#sistema", t: "El sistema" },
  { href: "#panel", t: "El panel" },
  { href: "#casos", t: "Números" },
  { href: "#preguntas", t: "Preguntas" },
];

// Barra de arriba: transparente sobre la portada y de cristal al bajar.
// En el móvil, un botón abre la lista entera con letras grandes.
export default function Cabecera() {
  const [fija, setFija] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const testigo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = testigo.current;
    if (!nodo || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setFija(!e.isIntersecting), { threshold: 0 });
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const cierra = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", cierra);
    return () => window.removeEventListener("keydown", cierra);
  }, [abierto]);

  return (
    <>
      <div ref={testigo} aria-hidden style={{ position: "absolute", top: 12, height: 1, width: 1 }} />
      <header className={`${s.cabecera} ${fija || abierto ? s.cabeceraFija : ""}`}>
        <div className={`${s.envoltura} ${s.cabeceraDentro}`}>
          <a href="/" aria-label="Vértice, inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.logo} src="/vertice-wordmark-dark.png" alt="Vértice" />
          </a>
          <nav className={s.menu}>
            {ENLACES.map((e) => (
              <a key={e.href} href={e.href}>{e.t}</a>
            ))}
            <a href="/login">Acceder</a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonOscuro}`}>
              Reserva una llamada
            </a>
          </nav>
          <button type="button" className={s.botonMenu} aria-expanded={abierto} aria-label={abierto ? "Cerrar menú" : "Abrir menú"} onClick={() => setAbierto((v) => !v)}>
            {abierto ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 9h16M4 15h16" /></svg>
            )}
          </button>
        </div>
      </header>
      {abierto && (
        <nav className={s.hoja} onClick={() => setAbierto(false)}>
          {ENLACES.map((e) => (
            <a key={e.href} href={e.href}>{e.t}</a>
          ))}
          <a href="/login">Acceder</a>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={`${s.boton} ${s.botonOscuro}`}>
            Reserva una llamada <span>→</span>
          </a>
        </nav>
      )}
    </>
  );
}

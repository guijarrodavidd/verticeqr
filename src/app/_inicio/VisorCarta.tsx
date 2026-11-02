"use client";

import { useEffect, useState, type ReactNode } from "react";
import s from "./inicio.module.css";

export const CARTA_NOOE = "/d/nooe-a332/nooe-maldives/carta?hab=214&idioma=es";
const EVENTO = "vertice:abrir-carta";

// Cualquier botón de la página abre la carta sin salir de la web.
export function BotonCarta({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(EVENTO))}>
      {children}
    </button>
  );
}

// La carta de NOOE en una ventana encima de la página: en el ordenador con
// forma de móvil y en el teléfono a pantalla completa, con su botón de cerrar.
export default function VisorCarta() {
  const [abierta, setAbierta] = useState(false);

  useEffect(() => {
    const abre = () => setAbierta(true);
    window.addEventListener(EVENTO, abre);
    return () => window.removeEventListener(EVENTO, abre);
  }, []);

  useEffect(() => {
    if (!abierta) return;
    const raiz = document.documentElement;
    const antes = raiz.style.overflow;
    raiz.style.overflow = "hidden";
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierta(false);
    window.addEventListener("keydown", tecla);
    return () => {
      raiz.style.overflow = antes;
      window.removeEventListener("keydown", tecla);
    };
  }, [abierta]);

  if (!abierta) return null;
  return (
    <div className={s.visor} role="dialog" aria-modal="true" aria-label="Carta de NOOE Maldivas" onClick={() => setAbierta(false)}>
      <div className={s.visorCaja} onClick={(e) => e.stopPropagation()}>
        <div className={s.visorBarra}>
          <span>Carta de NOOE Maldivas · demo real</span>
          <button type="button" className={s.visorCerrar} onClick={() => setAbierta(false)} autoFocus>
            Cerrar
          </button>
        </div>
        <iframe src={CARTA_NOOE} title="Carta de NOOE Maldivas, demo real" />
      </div>
    </div>
  );
}

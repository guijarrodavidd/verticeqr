"use client";

import { useState, type CSSProperties } from "react";

// Copia el prompt al portapapeles. Si el navegador no deja, selecciona el texto.
export function Copiar({ texto, destino, style }: { texto: string; destino: string; style?: CSSProperties }) {
  const [hecho, setHecho] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setHecho(true);
      setTimeout(() => setHecho(false), 1800);
    } catch {
      const el = document.getElementById(destino);
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  };
  return (
    <button type="button" onClick={copiar} style={style}>
      {hecho ? "Copiado" : "Copiar"}
    </button>
  );
}

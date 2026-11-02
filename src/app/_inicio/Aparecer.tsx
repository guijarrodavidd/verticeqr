"use client";

import { useEffect } from "react";

// Hace aparecer lo marcado con data-aparece cuando entra en pantalla.
// Sin JavaScript todo se ve desde el principio: el atributo data-anim que
// esconde los elementos solo se pone aquí, cuando ya hay quien los enseñe.
export default function Aparecer() {
  useEffect(() => {
    const raiz = document.querySelector<HTMLElement>("[data-pagina]");
    if (!raiz || typeof IntersectionObserver === "undefined") return;
    const elementos = Array.from(raiz.querySelectorAll<HTMLElement>("[data-aparece]"));
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-visto", "");
          obs.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    raiz.setAttribute("data-anim", "");
    elementos.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "../landing.module.css";

// Envoltura que aplica un fade-up cuando el contenido entra en el viewport.
// Acepta className extra (útil para que el wrapper sea el item de un grid).
export default function Reveal({
  children,
  delay = 0,
  className: extraClass = "",
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** "up" = fade hacia arriba · "wipe" = la foto se descubre de abajo a arriba */
  variant?: "up" | "wipe";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  // El "wipe" arranca con clip-path: inset(0 0 100% 0) — recortado a cero. Un
  // elemento recortado a cero no intersecta NUNCA con la pantalla, así que si
  // el observador mirase a ese mismo div el aviso no llegaría jamás y la foto
  // se quedaría invisible para siempre. Por eso el observador va en una caja
  // de fuera, sin recorte, y el recorte en la de dentro.
  if (variant === "wipe") {
    const wipeCls = `${styles.wipe} ${visible ? styles.wipeVisible : ""}`.trim();
    return (
      <div ref={ref} className={extraClass || undefined}>
        <div className={wipeCls} style={style}>
          {children}
        </div>
      </div>
    );
  }

  const cls = `${styles.reveal} ${visible ? styles.revealVisible : ""} ${extraClass}`
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div ref={ref} className={cls} style={style}>
      {children}
    </div>
  );
}

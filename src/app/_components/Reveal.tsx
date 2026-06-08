"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "../landing.module.css";

// Envoltura que aplica un fade-up cuando el contenido entra en el viewport.
// Una sola vez (no se "desactiva" al salir).
export default function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
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

  const className = `${styles.reveal} ${visible ? styles.revealVisible : ""}`.trim();
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

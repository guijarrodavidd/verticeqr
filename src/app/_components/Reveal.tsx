"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "../landing.module.css";

// Envoltura que aplica un fade-up cuando el contenido entra en el viewport.
// Acepta className extra (útil para que el wrapper sea el item de un grid).
export default function Reveal({
  children,
  delay = 0,
  className: extraClass = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
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

  const cls = `${styles.reveal} ${visible ? styles.revealVisible : ""} ${extraClass}`
    .replace(/\s+/g, " ")
    .trim();
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <div ref={ref} className={cls} style={style}>
      {children}
    </div>
  );
}

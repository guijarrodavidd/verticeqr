"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "../landing.module.css";

/**
 * Capítulo a sangre: la imagen entra con un zoom largo y el texto se escalona
 * encima. Mientras la sección está en pantalla la imagen se desplaza despacio
 * (parallax), que es lo que da la sensación de recorrido en vez de scroll.
 *
 * El parallax lo lleva el CSS (animation-timeline: view()), no JavaScript.
 * Antes cada capítulo dejaba puesto un listener de scroll que medía la página
 * entera en cada fotograma, y eso es justo lo que hace que el scroll vaya a
 * tirones. Donde el navegador no lo soporte, la foto se queda quieta.
 */
export default function Chapter({
  id,
  img,
  eyebrow,
  title,
  children,
  align = "left",
  height = "tall",
  tone = "dark",
}: {
  id?: string;
  img: string;
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  height?: "tall" | "mid";
  tone?: "dark" | "light";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);

  // Revelado
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return setOn(true);
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (setOn(true), obs.disconnect())),
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={[
        styles.chapter,
        height === "mid" ? styles.chapterMid : "",
        tone === "light" ? styles.chapterLight : "",
        on ? styles.chapterOn : "",
      ].join(" ")}
    >
      <div ref={bgRef} className={styles.chapterBg} data-bg={img} aria-hidden />
      <div className={styles.chapterScrim} aria-hidden />
      <div
        className={[
          styles.chapterInner,
          align === "center" ? styles.chapterCenter : "",
        ].join(" ")}
      >
        {eyebrow && <div className={styles.chapterEyebrow}>{eyebrow}</div>}
        <h2 className={styles.chapterTitle}>{title}</h2>
        {children && <div className={styles.chapterBody}>{children}</div>}
      </div>
    </section>
  );
}

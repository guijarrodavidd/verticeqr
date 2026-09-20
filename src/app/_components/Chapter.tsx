"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "../landing.module.css";

/**
 * Capítulo a sangre: la imagen entra con un zoom largo y el texto se escalona
 * encima. Mientras la sección está en pantalla la imagen se desplaza despacio
 * (parallax), que es lo que da la sensación de recorrido en vez de scroll.
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

  // Parallax suave, sólo si el usuario no pide menos movimiento
  useEffect(() => {
    const node = ref.current;
    const bg = bgRef.current;
    if (!node || !bg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = node.getBoundingClientRect();
        const vh = window.innerHeight;
        if (r.bottom < -200 || r.top > vh + 200) return;
        // -1 arriba del todo, 1 abajo del todo
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        bg.style.setProperty("--shift", `${(p * 6).toFixed(2)}%`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
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
      <div
        ref={bgRef}
        className={styles.chapterBg}
        style={{ backgroundImage: `url(${img})` }}
        aria-hidden
      />
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

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../landing.module.css";
import Logo from "./Logo";
import { CALENDLY_URL } from "@/lib/site";

// Nav que se vuelve opaco al hacer scroll.
//
// El aviso NO viene de escuchar el scroll: un listener de scroll dispara
// decenas de veces por segundo y obliga a React a repasar el componente en
// cada una. En su lugar hay un testigo de 1px pegado arriba del todo; cuando
// se sale de pantalla, el navegador nos avisa UNA vez. Coste en scroll: cero.
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const testigo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = testigo.current;
    if (!nodo || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([e]) => setScrolled(!e.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(nodo);
    return () => obs.disconnect();
  }, []);

  return (
    <>
    <div ref={testigo} aria-hidden style={{ position: "absolute", top: 12, height: 1, width: 1 }} />
    <header className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
      <div className={styles.navInner}>
        <a href="/" className={styles.brand} aria-label="Vértice — inicio">
          <Logo />
        </a>
        <nav className={styles.navLinks}>
          <a href="#momento" className={styles.navLink}>El momento</a>
          <a href="#formas" className={styles.navLink}>Qué se vende</a>
          <a href="#panel" className={styles.navLink}>El panel</a>
          <a href="#empezar" className={styles.navLink}>Por dónde empiezas</a>
          <a href="/login" className={styles.navLink}>Acceder</a>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.navCta}>Reservar reunión</a>
        </nav>
      </div>
    </header>
    </>
  );
}

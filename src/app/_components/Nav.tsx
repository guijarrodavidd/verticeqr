"use client";

import { useEffect, useState } from "react";
import styles from "../landing.module.css";

// Nav que añade fondo opaco con blur al hacer scroll.
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
      <div className={styles.navInner}>
        <a href="/" className={styles.brand}>
          <span className={styles.brandMark}>▲</span> VerticeQR
        </a>
        <nav className={styles.navLinks}>
          <a href="#como-funciona" className={styles.navLink}>Cómo funciona</a>
          <a href="#producto" className={styles.navLink}>Producto</a>
          <a href="#clientes" className={styles.navLink}>Clientes</a>
          <a href="#planes" className={styles.navLink}>Precios</a>
          <a href="/login" className={styles.navLink}>Acceder</a>
          <a href="#contacto" className={styles.navCta}>Solicitar demo</a>
        </nav>
      </div>
    </header>
  );
}

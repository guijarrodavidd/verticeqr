"use client";

import { useEffect, useState } from "react";
import styles from "../landing.module.css";
import Logo from "./Logo";
import { CALENDLY_URL } from "@/lib/site";

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
        <a href="/" className={styles.brand} aria-label="Vértice — inicio">
          <Logo />
        </a>
        <nav className={styles.navLinks}>
          <a href="#como-funciona" className={styles.navLink}>Cómo funciona</a>
          <a href="#producto" className={styles.navLink}>Producto</a>
          <a href="#planes" className={styles.navLink}>Precios</a>
          <a href="/login" className={styles.navLink}>Acceder</a>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.navCta}>Reservar reunión</a>
        </nav>
      </div>
    </header>
  );
}

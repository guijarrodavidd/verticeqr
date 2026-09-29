import Link from "next/link";
import styles from "./recurso.module.css";

// Vértice + Método Fricción 0, arriba y abajo en todas las páginas de recursos.
export function Cabecera({ centrada = false }: { centrada?: boolean }) {
  return (
    <header className={`${styles.header} ${centrada ? styles.headerCenter : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.logo} src="/vertice-wordmark-light.png" alt="Vértice" />
      <span className={styles.metodo}>Método Fricción 0</span>
    </header>
  );
}

export function Pie() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.footerLogo} src="/vertice-wordmark-light.png" alt="Vértice" />
          <span className={styles.metodo}>Método Fricción 0</span>
        </div>
        <nav className={styles.footerLinks} aria-label="Legal">
          <Link href="/">verticeqr.com</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/terminos">Términos</Link>
        </nav>
      </div>
    </footer>
  );
}

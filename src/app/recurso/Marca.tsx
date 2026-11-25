import Link from "next/link";
import styles from "./recurso.module.css";

// Vértice + Método Fricción 0, arriba y abajo en las páginas de recursos.
// Los recursos de Héctor (marca "hector") llevan su nombre y van de aprender a montarlo.
export function Cabecera({ centrada = false, hector = false }: { centrada?: boolean; hector?: boolean }) {
  if (hector)
    return (
      <header className={`${styles.header} ${centrada ? styles.headerCenter : ""}`}>
        <span className={styles.nombre}>Héctor García</span>
        <span className={styles.metodo}>Claude para directores de hotel</span>
      </header>
    );
  return (
    <header className={`${styles.header} ${centrada ? styles.headerCenter : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.logo} src="/vertice-wordmark-dark.png" alt="Vértice" />
      <span className={styles.metodo}>Método Fricción 0</span>
    </header>
  );
}

export function Pie({ hector = false }: { hector?: boolean }) {
  if (hector)
    return (
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={`${styles.nombre} ${styles.nombreClaro}`}>Héctor García</span>
            <span className={styles.metodo}>Claude para directores de hotel</span>
          </div>
          <nav className={styles.footerLinks} aria-label="Legal">
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/terminos">Términos</Link>
          </nav>
        </div>
      </footer>
    );
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

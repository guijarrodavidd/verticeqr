import styles from "../landing.module.css";

// Logo VÉRTICE recreado en SVG (V geométrica con tilde + wordmark).
// Monocromo (usa currentColor) con la tilde en el acento de marca.
// Escala con el font-size del contenedor padre.
export default function Logo() {
  return (
    <span className={styles.logo}>
      <svg className={styles.logoMark} viewBox="0 0 42 46" aria-hidden="true">
        <path d="M2 4 L15 4 L21 30 L27 4 L40 4 L23 45 L19 45 Z" fill="currentColor" />
        <path className={styles.logoTick} d="M30 0 L39.5 3 L38 7.4 L28.5 4 Z" />
      </svg>
      <span className={styles.logoWord}>értice</span>
    </span>
  );
}

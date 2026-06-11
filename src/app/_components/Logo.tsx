import styles from "../landing.module.css";

// Wordmark VÉRTICE: V geométrica (pesada a la izquierda, fina a la derecha)
// con tilde flotante + "ÉRTICE" en sans. Monocromo (currentColor).
export default function Logo() {
  return (
    <span className={styles.logo} aria-label="Vértice">
      <svg className={styles.logoV} viewBox="0 -8 96 128" aria-hidden="true" fill="currentColor">
        {/* V asimétrica */}
        <path d="M8 12 L42 12 L50 80 L78 12 L90 12 L49 118 Z" />
        {/* tilde flotante (´) */}
        <path d="M63 9 L81 -4 L85 1.5 L67 14.5 Z" />
      </svg>
      <span className={styles.logoWord}>ertice</span>
    </span>
  );
}

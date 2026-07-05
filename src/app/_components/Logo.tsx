import styles from "../landing.module.css";

// Logotipo VÉRTICE real (imagen). Dos versiones que se alternan según el fondo
// del nav: blanca sobre el hero, oscura al hacer scroll (fondo claro).
export default function Logo() {
  return (
    <span className={styles.logo} aria-label="Vértice">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${styles.logoImg} ${styles.logoImgLight}`} src="/vertice-wordmark-light.png" alt="Vértice" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`${styles.logoImg} ${styles.logoImgDark}`} src="/vertice-wordmark-dark.png" alt="" aria-hidden="true" />
    </span>
  );
}

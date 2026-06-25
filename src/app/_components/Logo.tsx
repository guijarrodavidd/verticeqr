import styles from "../landing.module.css";

// Logo real de Vértice (monograma VE), tal cual el archivo.
export default function Logo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/vertice-logo.png" alt="Vértice" className={styles.logoImg} />
  );
}

import type { Metadata } from "next";
import styles from "../../recurso/recurso.module.css";
import { Cabecera, Pie } from "../../recurso/Marca";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function GraciasConectarPage() {
  return (
    <main className={styles.page}>
      <section className={`${styles.hero} ${styles.heroShort}`}>
        <Cabecera centrada />
        <div className={styles.wrapNarrow}>
          <div className={styles.ok} aria-hidden="true">✓</div>
          <h1 className={styles.titleCenter}>Recibido. Gracias.</h1>
          <p className={styles.subtitleCenter}>
            Revisamos lo que nos cuentas y te escribimos con lo que se puede conectar o automatizar en tu hotel y cuánto tarda.
          </p>
        </div>
      </section>
      <Pie />
    </main>
  );
}

import type { Metadata } from "next";
import styles from "../../recurso.module.css";
import { Cabecera, Pie } from "../../Marca";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function GraciasHotelPage() {
  return (
    <main className={styles.page}>
      <section className={`${styles.hero} ${styles.heroShort}`}>
        <Cabecera centrada />
        <div className={styles.wrapNarrow}>
          <div className={styles.ok} aria-hidden="true">✓</div>
          <h1 className={styles.titleCenter}>Hecho. Ya tengo tu hotel.</h1>
          <p className={styles.subtitleCenter}>
            Reviso tus respuestas y empiezo a montarlo con tu marca. Te escribo por LinkedIn cuando lo tenga listo
            para enseñártelo.
          </p>
        </div>
      </section>
      <Pie />
    </main>
  );
}

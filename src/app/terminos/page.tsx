import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Términos y condiciones — VerticeQR",
  description: "Condiciones de uso del sitio web de VerticeQR.",
};

export default function TerminosPage() {
  return (
    <div className={styles.legal}>
      <div className={styles.wrap}>
        <Link href="/" className={styles.back}>← Volver al inicio</Link>
        <div className={styles.eyebrow}>Legal</div>
        <h1 className={styles.title}>Términos y condiciones</h1>
        <p className={styles.updated}>Última actualización: junio de 2026</p>

        <h2>1. Titular del sitio</h2>
        <p>
          Este sitio web corresponde a <strong>VerticeQR</strong> (en adelante,
          “VerticeQR”), proyecto en fase de lanzamiento. Medio de contacto
          directo: <a href="mailto:vertice605@gmail.com">vertice605@gmail.com</a>.
        </p>
        {/* TODO legal: al darte de alta, añade titular, NIF y domicilio fiscal. */}

        <h2>2. Objeto</h2>
        <p>
          Esta web tiene como finalidad presentar los servicios de VerticeQR —
          sistemas de pedido digital (room service y F&amp;B) a medida para
          hoteles— y permitir solicitar información, una demo o un presupuesto.
        </p>

        <h2>3. Uso del sitio</h2>
        <p>
          Al navegar por esta web aceptas estos términos. Te comprometes a hacer
          un uso lícito del sitio y a no realizar acciones que puedan dañarlo,
          inutilizarlo o impedir su normal funcionamiento.
        </p>

        <h2>4. Demos y contenidos</h2>
        <p>
          Las demos accesibles desde la web son ejemplos de demostración con
          nombres y datos ficticios. Las cifras y referencias del sector que
          aparecen en la web son orientativas y proceden de estudios
          públicos del sector; no constituyen una garantía de resultados
          concretos para un hotel determinado.
        </p>

        <h2>5. Propiedad intelectual</h2>
        <p>
          Los contenidos, marca, diseño y código de esta web pertenecen a
          VerticeQR o a sus titulares legítimos. No está permitida su reproducción
          o uso sin autorización previa.
        </p>

        <h2>6. Responsabilidad</h2>
        <p>
          VerticeQR procura mantener la web actualizada y libre de errores, pero
          no garantiza la disponibilidad continua del servicio ni se responsabiliza
          de los daños derivados de un uso indebido del sitio.
        </p>

        <h2>7. Protección de datos</h2>
        <p>
          El tratamiento de los datos personales facilitados a través de la web se
          rige por nuestra <Link href="/privacidad">política de privacidad</Link> y
          la <Link href="/cookies">política de cookies</Link>.
        </p>

        <h2>8. Legislación aplicable</h2>
        <p>
          Estos términos se rigen por la legislación española. Para cualquier
          controversia, las partes se someten a los juzgados y tribunales que
          correspondan conforme a la normativa aplicable.
        </p>

        <div className={styles.footer}>
          <Link href="/">Inicio</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/privacidad">Privacidad</Link>
          <a href="mailto:vertice605@gmail.com">Contacto</a>
        </div>
      </div>
    </div>
  );
}

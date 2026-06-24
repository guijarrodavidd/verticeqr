import type { Metadata } from "next";
import Link from "next/link";
import CookiePreferencesButton from "../_components/CookiePreferencesButton";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Política de cookies — VerticeQR",
  description: "Qué cookies usa VerticeQR y cómo gestionarlas.",
};

export default function CookiesPage() {
  return (
    <div className={styles.legal}>
      <div className={styles.wrap}>
        <Link href="/" className={styles.back}>← Volver al inicio</Link>
        <div className={styles.eyebrow}>Legal</div>
        <h1 className={styles.title}>Política de cookies</h1>
        <p className={styles.updated}>Última actualización: junio de 2026</p>

        <h2>¿Qué son las cookies?</h2>
        <p>
          Una cookie es un pequeño archivo de texto que un sitio web guarda en
          tu navegador cuando lo visitas. Sirven para que la web funcione, para
          recordar tus preferencias y, si lo autorizas, para medir cómo se usa.
        </p>

        <h2>¿Qué cookies usamos?</h2>
        <p>
          Hoy por hoy, en VerticeQR solo usamos cookies y almacenamiento{" "}
          <strong>técnicos y necesarios</strong>. No usamos cookies de publicidad
          ni cedemos datos a terceros con fines comerciales.
        </p>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cookie / dato</th>
              <th>Tipo</th>
              <th>Finalidad</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>vqr_cookie_consent</td>
              <td>Técnica (necesaria)</td>
              <td>Recordar tu decisión sobre las cookies para no volver a preguntártelo.</td>
              <td>Persistente</td>
            </tr>
            <tr>
              <td>Sesión / seguridad</td>
              <td>Técnica (necesaria)</td>
              <td>Permitir el envío seguro del formulario de contacto y el funcionamiento de la web.</td>
              <td>Sesión</td>
            </tr>
          </tbody>
        </table>

        <h3>Cookies de analítica (no activas)</h3>
        <p>
          Actualmente <strong>no</strong> cargamos herramientas de analítica
          (como Google Analytics). Si en el futuro las activáramos, solo se
          cargarían <strong>después de que des tu consentimiento</strong> en el
          banner de cookies, y actualizaríamos esta página con el detalle.
        </p>

        <h2>¿Cómo gestionar o retirar tu consentimiento?</h2>
        <p>
          Puedes cambiar tu elección en cualquier momento desde aquí:
        </p>
        <CookiePreferencesButton />
        <p>
          También puedes bloquear o eliminar las cookies desde la configuración
          de tu navegador (Chrome, Safari, Firefox, Edge…). Ten en cuenta que
          desactivar las cookies técnicas puede afectar al funcionamiento de la
          web.
        </p>

        <h2>Responsable</h2>
        <p>
          VerticeQR es un proyecto en fase de lanzamiento. Para cualquier duda
          sobre cookies o privacidad puedes escribirnos a{" "}
          <a href="mailto:vertice605@gmail.com">vertice605@gmail.com</a>.
        </p>
        {/* TODO legal: al darte de alta (autónomo/SL), añade aquí nombre o razón
            social, NIF y domicilio fiscal del responsable. */}

        <h2>Cambios en esta política</h2>
        <p>
          Podemos actualizar esta política para adaptarla a cambios legales o
          técnicos. Publicaremos siempre la versión vigente en esta misma página.
        </p>

        <div className={styles.footer}>
          <Link href="/">Inicio</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/terminos">Términos</Link>
          <a href="mailto:vertice605@gmail.com">Contacto</a>
        </div>
      </div>
    </div>
  );
}

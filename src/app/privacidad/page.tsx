import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Política de privacidad — VerticeQR",
  description: "Cómo trata VerticeQR los datos personales que nos facilitas.",
};

export default function PrivacidadPage() {
  return (
    <div className={styles.legal}>
      <div className={styles.wrap}>
        <Link href="/" className={styles.back}>← Volver al inicio</Link>
        <div className={styles.eyebrow}>Legal</div>
        <h1 className={styles.title}>Política de privacidad</h1>
        <p className={styles.updated}>Última actualización: junio de 2026</p>

        <p>
          En VerticeQR nos tomamos en serio tu privacidad. Aquí te explicamos qué
          datos recogemos cuando usas esta web, para qué y qué derechos tienes,
          conforme al Reglamento (UE) 2016/679 (RGPD) y la LOPDGDD.
        </p>

        <h2>Responsable del tratamiento</h2>
        <p>
          VerticeQR, proyecto en fase de lanzamiento. Medio de contacto directo:{" "}
          <a href="mailto:vertice605@gmail.com">vertice605@gmail.com</a>.
        </p>
        {/* TODO legal: al darte de alta, sustituye por Titular + NIF + domicilio fiscal. */}

        <h2>¿Qué datos recogemos?</h2>
        <p>
          Únicamente los que nos facilitas voluntariamente a través del
          formulario de contacto: <strong>nombre, email</strong> y, opcionalmente,{" "}
          <strong>teléfono, nombre del hotel, tipo de hotel, número de
          habitaciones y el mensaje</strong> que nos escribas.
        </p>

        <h2>¿Con qué finalidad?</h2>
        <ul>
          <li>Atender tu solicitud y prepararte una demo o presupuesto a medida.</li>
          <li>Ponernos en contacto contigo para darte respuesta.</li>
          <li>Gestionar la relación comercial si decides avanzar.</li>
        </ul>

        <h2>Legitimación</h2>
        <p>
          La base legal es tu <strong>consentimiento</strong>, que prestas al
          enviar el formulario, y, en su caso, la aplicación de medidas
          precontractuales a petición tuya.
        </p>

        <h2>¿Durante cuánto tiempo?</h2>
        <p>
          Conservamos tus datos el tiempo necesario para atender tu solicitud y,
          si surge relación comercial, durante la vigencia de la misma y los
          plazos legales aplicables. Después se suprimen.
        </p>

        <h2>¿A quién se los comunicamos?</h2>
        <p>
          No vendemos ni cedemos tus datos a terceros con fines comerciales. Solo
          acceden, como encargados de tratamiento, los proveedores tecnológicos
          que necesitamos para operar (alojamiento web y correo), con las debidas
          garantías y sin destinarlos a otros fines.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de <strong>acceso, rectificación,
          supresión, oposición, limitación y portabilidad</strong> escribiéndonos
          a <a href="mailto:vertice605@gmail.com">vertice605@gmail.com</a>. Si
          consideras que no hemos atendido bien tu solicitud, puedes reclamar ante
          la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).
        </p>

        <h2>Cookies</h2>
        <p>
          El uso de cookies en esta web se detalla en nuestra{" "}
          <Link href="/cookies">política de cookies</Link>.
        </p>

        <div className={styles.footer}>
          <Link href="/">Inicio</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/terminos">Términos</Link>
          <a href="mailto:vertice605@gmail.com">Contacto</a>
        </div>
      </div>
    </div>
  );
}

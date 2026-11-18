import type { Metadata } from "next";
import styles from "../recurso/recurso.module.css";
import q from "../recurso/hotel/hotel.module.css";
import { Cabecera, Pie } from "../recurso/Marca";
import { PREGUNTAS } from "./preguntas";
import { enviarConexiones } from "./actions";

// El enlace se puede mandar con el hotel ya puesto: /conectar?hotel=Punta%20Blanca&ciudad=...
type Props = { searchParams: Promise<{ error?: string; hotel?: string; ciudad?: string }> };

const TITULO = "Qué hay que conectar en tu hotel";
const SUBTITULO = "Siete preguntas sobre los programas que usáis. Con tus respuestas vemos qué se conecta desde el primer día y qué lleva más tiempo.";

const ERRORES: Record<string, string> = {
  hotel: "Escribe el nombre del hotel.",
  ciudad: "Dime en qué ciudad está el hotel.",
  nombre: "Escribe tu nombre.",
  telefono: "Pon un teléfono válido (con prefijo si no es de España).",
  campos: "Te falta alguna pregunta por contestar.",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://verticeqr.com"),
  title: `${TITULO} — Vértice`,
  description: SUBTITULO,
  robots: { index: false, follow: false },
  openGraph: { title: TITULO, description: SUBTITULO, type: "website", siteName: "Vértice" },
  twitter: { card: "summary_large_image", title: TITULO, description: SUBTITULO },
};

export default async function ConectarPage({ searchParams }: Props) {
  const { error, hotel = "", ciudad = "" } = await searchParams;
  const n0 = 2;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Cabecera />
        <div className={q.heroCopy}>
          <h1 className={styles.title}>{TITULO}</h1>
          <p className={styles.subtitle}>{SUBTITULO}</p>
        </div>
      </section>

      <section className={q.quiz} id="formulario">
        <form action={enviarConexiones} className={q.form}>
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden="true" />

          {error && ERRORES[error] && (
            <div className={styles.error} role="alert">{ERRORES[error]}</div>
          )}

          <fieldset className={q.q}>
            <legend>
              <div className={q.qHead}>
                <span className={q.qNum}>1</span>
                <label htmlFor="hotel" className={q.qText}>Nombre del hotel</label>
              </div>
            </legend>
            <input id="hotel" name="hotel" type="text" required defaultValue={hotel} className={q.text} placeholder="Ej.: Hotel Mirador del Puerto" autoComplete="organization" />
            <input id="ciudad" name="ciudad" type="text" required defaultValue={ciudad} className={q.text} placeholder="Ciudad del hotel (ej.: Valencia)" aria-label="Ciudad del hotel" autoComplete="address-level2" style={{ marginTop: 10 }} />
          </fieldset>

          {PREGUNTAS.map((p, i) => (
            <fieldset key={p.id} className={q.q}>
              <legend>
                <div className={q.qHead}>
                  <span className={q.qNum}>{i + n0}</span>
                  <span className={q.qText}>
                    {p.texto}
                    {p.ayuda && <span className={q.qHelp}>{p.ayuda}</span>}
                  </span>
                </div>
              </legend>
              <div className={q.opts}>
                {p.opciones.map((o, j) => (
                  <label key={o} className={q.opt}>
                    <input type={p.multiple ? "checkbox" : "radio"} name={p.id} value={o} required={!p.multiple && j === 0} />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
              {p.otro && (
                <input name={`${p.id}_otro`} type="text" className={q.text} placeholder={p.otro} aria-label={p.otro} style={{ marginTop: 10 }} />
              )}
            </fieldset>
          ))}

          <fieldset className={q.q}>
            <legend>
              <div className={q.qHead}>
                <span className={q.qNum}>{PREGUNTAS.length + n0}</span>
                <label htmlFor="mano" className={q.qText}>
                  ¿Qué pasáis hoy a mano de un programa a otro?
                  <span className={q.qHelp}>Opcional. Por ejemplo: «recepción apunta en Cloudbeds lo que se pide por WhatsApp».</span>
                </label>
              </div>
            </legend>
            <textarea id="mano" name="mano" rows={3} maxLength={2000} className={q.text} style={{ resize: "vertical", minHeight: 96 }} />
          </fieldset>

          <fieldset className={q.q}>
            <legend>
              <div className={q.qHead}>
                <span className={q.qNum}>{PREGUNTAS.length + n0 + 1}</span>
                <label htmlFor="nombre" className={q.qText}>
                  ¿Con quién hablamos?
                  <span className={q.qHelp}>Para contarte qué se puede conectar y en cuánto tiempo.</span>
                </label>
              </div>
            </legend>
            <input id="nombre" name="nombre" type="text" required className={q.text} placeholder="Tu nombre" autoComplete="name" />
            <input id="telefono" name="telefono" type="tel" required minLength={9} pattern="[+0-9 ()\-]{9,}" className={q.text} placeholder="Teléfono o WhatsApp" aria-label="Teléfono o WhatsApp" autoComplete="tel" inputMode="tel" style={{ marginTop: 10 }} />
            <input id="email" name="email" type="email" className={q.text} placeholder="Email (opcional)" aria-label="Email (opcional)" autoComplete="email" style={{ marginTop: 10 }} />
          </fieldset>

          <button type="submit" className={q.submit}>Enviar respuestas →</button>
          <p className={q.note}>Las revisamos y te decimos qué se conecta y cuánto tarda cada cosa.</p>
        </form>
      </section>
      <Pie />
    </main>
  );
}

import type { Metadata } from "next";
import styles from "../recurso.module.css";
import q from "./hotel.module.css";
import { Cabecera, Pie } from "../Marca";
import { PREGUNTAS } from "./preguntas";
import { pedirHotel } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

const TITULO = "Así quedaría tu hotel vendiendo.";
const SUBTITULO = "Contesta 10 preguntas y te monto tu sistema de venta, con tu marca y tu hotel dentro.";

const ERRORES: Record<string, string> = {
  hotel: "Escribe el nombre del hotel o de la cadena.",
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

export default async function HotelPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Cabecera />
        <div className={q.heroCopy}>
          <h1 className={styles.title}>{TITULO}</h1>
          <p className={styles.subtitle}>{SUBTITULO}</p>
        </div>
      </section>

      <section className={q.quiz} id="cuestionario">
        <form action={pedirHotel} className={q.form}>
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden="true" />

          {error && ERRORES[error] && (
            <div className={styles.error} role="alert">{ERRORES[error]}</div>
          )}

          <fieldset className={q.q}>
            <legend>
              <div className={q.qHead}>
                <span className={q.qNum}>1</span>
                <label htmlFor="hotel" className={q.qText}>Nombre del hotel o de la cadena</label>
              </div>
            </legend>
            <input id="hotel" name="hotel" type="text" required className={q.text} placeholder="Ej.: Hotel Mirador del Puerto" autoComplete="organization" />
            <input id="ciudad" name="ciudad" type="text" required className={q.text} placeholder="Ciudad del hotel (ej.: Valencia)" aria-label="Ciudad del hotel" autoComplete="address-level2" style={{ marginTop: 10 }} />
          </fieldset>

          {PREGUNTAS.map((p, i) => (
            <fieldset key={p.id} className={q.q}>
              <legend>
                <div className={q.qHead}>
                  <span className={q.qNum}>{i + 2}</span>
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
            </fieldset>
          ))}

          <fieldset className={q.q}>
            <legend>
              <div className={q.qHead}>
                <span className={q.qNum}>{PREGUNTAS.length + 2}</span>
                <label htmlFor="nombre" className={q.qText}>
                  ¿A quién se lo mando?
                  <span className={q.qHelp}>Para avisarte cuando tu hotel esté montado.</span>
                </label>
              </div>
            </legend>
            <input id="nombre" name="nombre" type="text" required className={q.text} placeholder="Tu nombre" autoComplete="name" />
            <input id="telefono" name="telefono" type="tel" required minLength={9} pattern="[+0-9 ()\-]{9,}" className={q.text} placeholder="Teléfono o WhatsApp" aria-label="Teléfono o WhatsApp" autoComplete="tel" inputMode="tel" style={{ marginTop: 10 }} />
            <input id="email" name="email" type="email" className={q.text} placeholder="Email (opcional)" aria-label="Email (opcional)" autoComplete="email" style={{ marginTop: 10 }} />
          </fieldset>

          <button type="submit" className={q.submit}>Quiero ver mi hotel →</button>
          <p className={q.note}>Reviso cada petición y te escribo cuando lo tenga montado.</p>
        </form>
      </section>
      <Pie />
    </main>
  );
}

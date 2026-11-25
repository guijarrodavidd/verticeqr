import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CALENDLY_URL } from "@/lib/site";
import { esDeHector, getRecurso, normalizarSlug, RECURSOS } from "@/lib/recursos";
import { pedirRecurso } from "./actions";
import styles from "../recurso.module.css";
import { Cabecera, Pie } from "../Marca";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
};

const ERRORES: Record<string, string> = {
  campos: "Rellena el email y el teléfono.",
  email: "El email no parece válido.",
  telefono: "El teléfono no parece válido.",
};

export function generateStaticParams() {
  return RECURSOS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recurso = getRecurso(normalizarSlug((await params).slug));
  const marca = esDeHector(recurso) ? "Héctor García" : "Vértice";
  const title = recurso ? `${recurso.titulo} — ${marca}` : `Recurso — ${marca}`;
  return {
    metadataBase: new URL("https://verticeqr.com"),
    title,
    description: recurso?.subtitulo,
    robots: { index: false, follow: false },
    // La imagen la genera opengraph-image.tsx: es la portada que sale al
    // pegar el enlace en LinkedIn, WhatsApp o un email.
    openGraph: { title, description: recurso?.subtitulo, type: "website", siteName: marca },
    twitter: { card: "summary_large_image", title, description: recurso?.subtitulo },
  };
}

export default async function RecursoPage({ params, searchParams }: Props) {
  const { slug } = await params;
  // «/recurso/GM» o «/recurso/hotel.» llevan a su página en vez de a un error.
  const limpio = normalizarSlug(slug);
  if (limpio !== slug && (getRecurso(limpio) || limpio === "hotel")) redirect(`/recurso/${limpio}`);
  const recurso = getRecurso(slug);
  if (!recurso) notFound();
  const { error } = await searchParams;
  const hector = esDeHector(recurso);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Cabecera hector={hector} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>

            <div className={styles.badge}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <div>
                <div className={styles.badgeTitle}>{recurso.etiqueta}</div>
                <div className={styles.badgeSub}>{hector ? "De Héctor García" : "Del Método Fricción 0 · Vértice"}</div>
              </div>
            </div>

            <h1 className={styles.title}>{recurso.titulo}</h1>
            <p className={styles.subtitle}>{recurso.subtitulo}</p>

            {recurso.incluye && (
              <ul className={styles.incluye}>
                {recurso.incluye.map((linea) => (
                  <li key={linea}>{linea}</li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.cardCol}>
            <div className={styles.card} id="formulario">
              <h2 className={styles.cardTitle}>Recibe el recurso ahora</h2>
              <p className={styles.cardSub}>Lo tienes en la página siguiente. Sin esperas.</p>

              <form action={pedirRecurso} className={styles.form}>
                <input type="hidden" name="slug" value={recurso.slug} />
                <input type="text" name="hp" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden="true" />

                {error && ERRORES[error] && (
                  <div className={styles.error} role="alert">{ERRORES[error]}</div>
                )}

                <label className={styles.field}>
                  <span>Nombre y Apellido</span>
                  <input name="nombre" type="text" autoComplete="name" placeholder="Nombre completo" />
                </label>
                <label className={styles.field}>
                  <span>Email *</span>
                  <span className={styles.inputIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input name="email" type="email" required autoComplete="email" placeholder="ejemplo@email.com" />
                  </span>
                </label>
                <label className={styles.field}>
                  <span>Teléfono *</span>
                  <input name="telefono" type="tel" required autoComplete="tel" placeholder="+1 (555) 000-0000" pattern="[+0-9 ()-]{9,}" />
                </label>

                <label className={styles.check}>
                  <input name="acepta" type="checkbox" />
                  <span>Acepto recibir información relativa al recurso que solicito</span>
                </label>

                <button type="submit" className={styles.submit}>Obtener recurso</button>
              </form>
            </div>
            <p className={styles.noSpam}>Nada de spam. Puedes darte de baja en cualquier momento.</p>
          </div>
        </div>
      </section>

      {hector ? (
        <>
          <section className={styles.dark}>
            <div className={styles.wrap}>
              <div className={styles.eyebrowNum}>( 01 )</div>
              <div className={styles.eyebrow}>Quién está detrás</div>
              <p className={styles.lead}>
                Soy Héctor García. Enseño a directores de hotel a montar sus propios agentes con Claude para quitarse de
                encima el trabajo de oficina: el cierre de mes, los informes para la propiedad, los turnos y las reseñas.
              </p>
              <div className={styles.pilares}>
                <div>
                  <div className={styles.pilarTitle}>Con tus datos</div>
                  <p>Trabajas con los informes que ya sacas del programa de recepción y de la caja. Nada de datos de huéspedes.</p>
                </div>
                <div>
                  <div className={styles.pilarTitle}>Lo montas tú</div>
                  <p>Cada rutina acaba siendo un agente tuyo, que lanzas cuando toca y revisas antes de mandar nada.</p>
                </div>
                <div>
                  <div className={styles.pilarTitle}>Sin programar</div>
                  <p>Si sabes escribir un correo, sabes pedirle las cosas a Claude. El resto se aprende con tu hotel delante.</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.final}>
            <div className={styles.wrapNarrow}>
              <div className={styles.eyebrowNum}>( 02 )</div>
              <div className={styles.eyebrow}>Y esto es solo el principio</div>
              <h2 className={styles.finalTitle}>¿Quieres aprender a montarlo con tu hotel?</h2>
              <p className={styles.finalText}>
                En una llamada de 15 minutos me cuentas tu semana y te digo qué montarías primero y cómo aprender a
                hacerlo. Si veo que no te compensa, te lo digo igual.
              </p>
              <a className={styles.finalCta} href={`${CALENDLY_URL}?utm_source=recurso&utm_campaign=${recurso.slug}`} target="_blank" rel="noopener noreferrer">
                Reservar mi llamada <span aria-hidden="true">↗</span>
              </a>
              <p className={styles.finalNote}>Sin coste y sin compromiso.</p>
            </div>
          </section>
        </>
      ) : (
        <>
        <section className={styles.dark}>
          <div className={styles.wrap}>
            <div className={styles.eyebrowNum}>( 01 )</div>
            <div className={styles.eyebrow}>Quién está detrás</div>
            <p className={styles.lead}>
              Este recurso sale del Método Fricción 0: el sistema con el que Vértice ayuda a directores de hotel a
              sacar más de lo que el huésped gasta dentro, sin sumar una persona a la plantilla.
            </p>
            <div className={styles.pilares}>
              <div>
                <div className={styles.pilarTitle}>Métricas Claras</div>
                <p>Ves lo que el huésped quiso comprar y no pudo. Ese dato no está en tu PMS ni en tu TPV.</p>
              </div>
              <div>
                <div className={styles.pilarTitle}>Motor de Venta</div>
                <p>Cada cosa que ofrece el hotel le llega al huésped justo cuando la está pensando, en su móvil.</p>
              </div>
              <div>
                <div className={styles.pilarTitle}>Escala sin Fricción</div>
                <p>Lo montamos nosotros. Tu equipo no suma tareas y tú no tocas nada.</p>
              </div>
            </div>
          </div>
        </section>
  
        <section className={styles.final}>
          <div className={styles.wrapNarrow}>
            <div className={styles.eyebrowNum}>( 02 )</div>
            <div className={styles.eyebrow}>Y esto es solo una pieza</div>
            <h2 className={styles.finalTitle}>¿Quieres verlo con tu hotel delante?</h2>
            <p className={styles.finalText}>
              En una llamada de 15 minutos me cuentas cómo pide hoy tu huésped y te digo qué se escapa y qué se
              tapa sin sumar personal. Si no veo nada, te lo digo igual.
            </p>
            <a className={styles.finalCta} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Reservar mi diagnóstico <span aria-hidden="true">↗</span>
            </a>
            <p className={styles.finalNote}>Sin coste y sin compromiso.</p>
          </div>
        </section>
        </>
      )}
      <Pie hector={hector} />
    </main>
  );
}

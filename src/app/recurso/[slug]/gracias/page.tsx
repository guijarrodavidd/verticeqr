import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CALENDLY_URL } from "@/lib/site";
import { getRecurso } from "@/lib/recursos";
import styles from "../../recurso.module.css";
import { Cabecera, Pie } from "../../Marca";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function GraciasPage({ params }: Props) {
  const { slug } = await params;
  const recurso = getRecurso(slug);
  if (!recurso) notFound();

  // Sin la cookie del formulario no hay recurso.
  if ((await cookies()).get(`rec_${slug}`)?.value !== "1") redirect(`/recurso/${slug}#formulario`);

  const externo = recurso.destino.startsWith("http");

  return (
    <main className={styles.page}>
      <section className={`${styles.hero} ${styles.heroShort}`}>
        <Cabecera centrada />
        <div className={styles.wrapNarrow}>
          <div className={styles.ok} aria-hidden="true">✓</div>
          <h1 className={styles.titleCenter}>Aquí lo tienes</h1>
          <p className={styles.subtitleCenter}>{recurso.titulo}</p>

          {recurso.destino ? (
            <a
              className={styles.deliver}
              href={recurso.destino}
              {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {recurso.cta} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <p className={styles.subtitleCenter}>Te lo envío por email en las próximas horas.</p>
          )}
          <p className={styles.finalNote}>Guárdate esta página: el enlace sigue funcionando.</p>
        </div>
      </section>

      <section className={styles.final}>
        <div className={styles.wrapNarrow}>
          <div className={styles.eyebrow}>Siguiente paso</div>
          <h2 className={styles.finalTitle}>¿Lo miramos con tu hotel delante?</h2>
          <p className={styles.finalText}>
            15 minutos: me cuentas cómo pide hoy tu huésped y te digo qué se escapa y qué se tapa sin sumar
            personal. Si no veo nada, te lo digo igual.
          </p>
          <a className={styles.finalCta} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            Reservar mi diagnóstico <span aria-hidden="true">↗</span>
          </a>
          <p className={styles.finalNote}>Sin coste y sin compromiso.</p>
        </div>
      </section>
      <Pie />
    </main>
  );
}

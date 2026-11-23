import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import s from "../aula.module.css";
import { Marca } from "../../Marca";
import { Bot, trajeDe } from "../Bot";
import { Contenido } from "../Contenido";
import { CONTENIDOS } from "../lecciones";
import { Auditoria } from "../Auditoria";
import { alumnoActual, leccionesHechas, marcarLeccion, progresoDe } from "@/lib/programa";
import { buscarLeccion, leccionesAbiertas, puedeVer } from "@/lib/programa-curriculo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lección · Director con Claude", robots: { index: false, follow: false } };

type Props = { params: Promise<{ leccion: string }>; searchParams: Promise<{ hecha?: string }> };

// Loom: de https://www.loom.com/share/<id> a su versión para incrustar.
const aEmbed = (url: string) => url.replace("/share/", "/embed/");

export default async function LeccionPage({ params, searchParams }: Props) {
  const { leccion: slug } = await params;
  const { hecha: recienHecha } = await searchParams;
  const alumno = await alumnoActual();
  if (!alumno) redirect("/programa/aula");

  const encontrada = buscarLeccion(slug);
  if (!encontrada || !puedeVer(encontrada.modulo, alumno.plan)) notFound();
  const { modulo, leccion } = encontrada;
  const esAuditoria = leccion.tipo === "auditoria";
  const contenido = CONTENIDOS[slug];

  // Solo se entra en lo que ya está abierto y escrito. Lo demás no existe para
  // el alumno: vuelve a su aula sin ver fechas ni «en preparación».
  const orden = leccionesAbiertas(alumno.fecha_alta, alumno.plan).map((x) => x.leccion);
  const pos = orden.findIndex((l) => l.slug === slug);
  if (pos < 0 || (!esAuditoria && !contenido)) redirect("/programa/aula");

  const hechas = await progresoDe(alumno);
  const hecha = hechas.has(slug);
  const anterior = pos > 0 ? orden[pos - 1] : undefined;
  const siguiente = pos < orden.length - 1 ? orden[pos + 1] : undefined;

  async function cambiar() {
    "use server";
    const a = await alumnoActual();
    if (!a) redirect("/programa/aula");
    const ya = (await leccionesHechas(a.id)).has(slug);
    await marcarLeccion(a.id, slug, !ya);
    revalidatePath("/programa/aula");
    // Al marcarla, el agente lo celebra una vez.
    redirect(`/programa/aula/${slug}${ya ? "" : "?hecha=1"}#hecha`);
  }

  const semanaTxt = modulo.titulo.split(" · ")[0];
  const pildora = leccion.numero ? `${semanaTxt} · Día ${leccion.numero}` : semanaTxt;
  const volverA = modulo.id.startsWith("dia-") ? "/programa/aula" : `/programa/aula/modulo/${modulo.id}`;
  const traje = trajeDe(slug, modulo.id);

  return (
    <main className={s.pagina}>
      <Marca derecha={<a href="/programa/salir">Salir</a>} />

      <section className={s.portada}>
        <div className={`${s.wrap} ${s.portadaGrid}`}>
          <div className={s.portadaTexto}>
            <Link className={`${s.volver} ${s.aparece}`} href={volverA}>
              ← {volverA === "/programa/aula" ? "Tu aula" : semanaTxt}
            </Link>
            <span className={`${s.pildora} ${s.aparece}`}>{pildora}</span>
            <h1 className={`${s.titulo} ${s.aparece}`} style={{ ["--d" as string]: 1 }}>
              {leccion.titulo}
            </h1>
            {contenido && (
              <p className={`${s.consigues} ${s.aparece}`} style={{ ["--d" as string]: 2 }}>
                <b>Lo que consigues hoy.</b> {contenido.consigues}
                {contenido.tiempo && ` Te lleva unos ${contenido.tiempo}.`}
              </p>
            )}
            {esAuditoria && (
              <p className={`${s.consigues} ${s.aparece}`} style={{ ["--d" as string]: 2 }}>
                Ahora solo toca esto. Siéntate con calma y cuéntame tu semana, lo que buscas y las tareas que te quieres quitar
                de encima. Con ella preparo por dónde empezamos.
              </p>
            )}
          </div>
          <div className={`${s.aparece} ${s.botPortada}`} style={{ ["--d" as string]: 2 }}>
            <Bot traje={traje} tam={220} />
          </div>
        </div>
      </section>

      <div className={s.wrap}>
        <div className={s.leccion}>
          {esAuditoria ? (
            <Auditoria alumno={alumno} />
          ) : (
            <>
              {leccion.video && (
                <div className={s.video}>
                  <iframe src={aEmbed(leccion.video)} title={leccion.titulo} allowFullScreen />
                </div>
              )}

              {contenido && <Contenido c={contenido} />}

              <form action={cambiar} className={s.marcar} id="hecha">
                <div className={s.marcarTexto}>
                  {hecha && <Bot traje={traje} tam={104} estado={recienHecha ? "celebra" : "despierto"} />}
                  <p>{hecha ? (recienHecha ? "¡Hecha! Una menos." : "La tienes hecha.") : "¿Ya la has hecho con tu hotel?"}</p>
                </div>
                <button type="submit" className={`${s.boton} ${hecha ? s.botonBorde : ""}`}>
                  {hecha ? "Desmarcar" : "Marcar como hecha"}
                </button>
              </form>
            </>
          )}

          <nav className={s.navegacion} aria-label="Lecciones">
            {anterior ? (
              <Link href={`/programa/aula/${anterior.slug}`}>
                ← Anterior
                <span>{anterior.titulo}</span>
              </Link>
            ) : (
              <span />
            )}
            {siguiente && (
              <Link href={`/programa/aula/${siguiente.slug}`} style={{ textAlign: "right" }}>
                Siguiente →<span>{siguiente.titulo}</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </main>
  );
}

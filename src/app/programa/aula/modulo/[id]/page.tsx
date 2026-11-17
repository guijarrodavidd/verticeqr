import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import s from "../../aula.module.css";
import { Marca } from "../../../Marca";
import { Bot, CheckPixel, TRAJE_SEMANA } from "../../Bot";
import { alumnoActual, progresoDe } from "@/lib/programa";
import { MODULOS, leccionVisible, moduloVisible } from "@/lib/programa-curriculo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Módulo · Director con Claude", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string }> };

// Un módulo con su agente y las lecciones que ya tiene listas. Si aún no se ha
// abierto o no tiene nada listo, el alumno vuelve a su aula.
export default async function ModuloPage({ params }: Props) {
  const { id } = await params;
  const alumno = await alumnoActual();
  if (!alumno) redirect("/programa/aula");
  const m = MODULOS.find((x) => x.id === id);
  if (!m) notFound();
  if (!moduloVisible(m, alumno.fecha_alta, alumno.plan)) redirect("/programa/aula");

  const hechas = await progresoDe(alumno);
  const [arriba, titulo] = m.titulo.includes(" · ") ? m.titulo.split(" · ") : [m.titulo, m.titulo];
  const visibles = m.lecciones.filter(leccionVisible);
  // Las que aún no están listas salen bloqueadas, sin enlace.
  const dias = (m.compacto ? visibles : m.lecciones).filter((l) => l.tipo !== "documento");
  const doc = m.lecciones.find((l) => l.tipo === "documento");
  const hechasM = visibles.filter((l) => hechas.has(l.slug)).length;

  return (
    <main className={s.pagina}>
      <Marca derecha={<a href="/programa/salir">Salir</a>} />

      <section className={s.portada}>
        <div className={`${s.wrap} ${s.portadaGrid}`}>
          <div className={s.portadaTexto}>
            <Link className={`${s.volver} ${s.aparece}`} href="/programa/aula">
              ← Tu aula
            </Link>
            <span className={`${s.pildora} ${s.aparece}`}>{arriba}</span>
            <h1 className={`${s.titulo} ${s.aparece}`} style={{ ["--d" as string]: 1 }}>
              {titulo}
            </h1>
            <p className={`${s.consigues} ${s.aparece}`} style={{ ["--d" as string]: 2 }}>
              {m.subtitulo}
              {!m.compacto && ` Llevas ${hechasM} de ${visibles.length}.`}
            </p>
          </div>
          <div className={`${s.aparece} ${s.botPortada}`} style={{ ["--d" as string]: 2 }}>
            <Bot traje={TRAJE_SEMANA[m.id] ?? "botones"} tam={220} />
          </div>
        </div>
      </section>

      <div className={s.wrap}>
        <div className={s.leccion}>
          {m.compacto ? (
            <div className={s.biblioteca}>
              {visibles.map((l, i) => (
                <Link key={l.slug} href={`/programa/aula/${l.slug}`} className={`${s.d2} ${s.aparece}`} style={{ ["--d" as string]: i }}>
                  <span className={s.num}>{i + 1}</span>
                  <div>
                    <h4>{l.titulo}</h4>
                    <p>{l.resumen}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={`${s.semana} ${s.panel}`}>
              <div className={s.filas}>
                {dias.map((l, i) => {
                  const hecha = hechas.has(l.slug);
                  if (!leccionVisible(l)) {
                    return (
                      <div key={l.slug} className={`${s.d2} ${s.aparece} ${s.d2Cerrada}`} style={{ ["--d" as string]: i }}>
                        <span className={s.num}>{l.numero ?? i + 1}</span>
                        <div>
                          <h4>{l.titulo}</h4>
                          {l.resumen && <p>{l.resumen}</p>}
                          <span className={s.estado}>Bloqueada</span>
                        </div>
                      </div>
                    );
                  }
                  const etiqueta = hecha ? "Hecha" : "";
                  return (
                    <Link
                      key={l.slug}
                      href={`/programa/aula/${l.slug}`}
                      className={`${s.d2} ${s.aparece} ${hecha ? s.d2Hecha : ""}`}
                      style={{ ["--d" as string]: i }}
                    >
                      <span className={s.num}>{l.numero ?? i + 1}</span>
                      <div>
                        <h4>{l.titulo}</h4>
                        {l.resumen && <p>{l.resumen}</p>}
                        {etiqueta && (
                          <span className={s.estado}>
                            {hecha && <CheckPixel tam={14} />}
                            {etiqueta}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
              {doc &&
                (leccionVisible(doc) ? (
                  <Link className={s.cierre} href={`/programa/aula/${doc.slug}`}>
                    <b>Revisión de la semana</b>
                    <span>{doc.resumen}</span>
                  </Link>
                ) : (
                  <div className={`${s.cierre} ${s.d2Cerrada}`}>
                    <b>Revisión de la semana</b>
                    <span>Bloqueada</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

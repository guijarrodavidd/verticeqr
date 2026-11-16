import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import s from "../../aula.module.css";
import { Marca } from "../../../Marca";
import { Bot, CheckPixel, TRAJE_SEMANA } from "../../Bot";
import { alumnoActual, progresoDe } from "@/lib/programa";
import { MODULOS, estaAbierto, fechaApertura, fechaLarga, puedeVer, sumarDias } from "@/lib/programa-curriculo";
import { DIAS_POR_TAREA } from "@/lib/programa-a-medida";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Módulo · Director con Claude", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string }> };

// Un módulo con su agente, las fechas reales de esa semana y sus lecciones.
export default async function ModuloPage({ params }: Props) {
  const { id } = await params;
  const alumno = await alumnoActual();
  if (!alumno) redirect("/programa/aula");
  const m = MODULOS.find((x) => x.id === id);
  if (!m || !puedeVer(m, alumno.plan)) notFound();

  const abierto = estaAbierto(alumno.fecha_alta, m.abre);
  const hechas = await progresoDe(alumno);
  const paraTi = alumno.punto_partida ? (DIAS_POR_TAREA[alumno.punto_partida.principal] ?? []) : [];
  const [arriba, titulo] = m.titulo.includes(" · ") ? m.titulo.split(" · ") : [m.titulo, m.titulo];
  const inicio = fechaApertura(alumno.fecha_alta, m.abre);
  const esSemana = m.id.startsWith("semana-");
  const dias = m.lecciones.filter((l) => !l.tipo);
  const doc = m.lecciones.find((l) => l.tipo === "documento");
  const hechasM = m.lecciones.filter((l) => hechas.has(l.slug)).length;

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
              {esSemana ? `Del ${fechaLarga(inicio)} al ${fechaLarga(sumarDias(inicio, 6))}. ` : ""}
              {m.subtitulo}
              {abierto && !m.compacto && ` Llevas ${hechasM} de ${m.lecciones.length}.`}
            </p>
          </div>
          <div className={`${s.aparece} ${s.botPortada}`} style={{ ["--d" as string]: 2 }}>
            <Bot traje={TRAJE_SEMANA[m.id] ?? "botones"} tam={220} estado={abierto ? "despierto" : "duerme"} />
          </div>
        </div>
      </section>

      <div className={s.wrap}>
        <div className={s.leccion}>
          {!abierto ? (
            <p className={s.aviso}>Se abre el {fechaLarga(inicio)}. Su agente está dormido hasta entonces.</p>
          ) : m.compacto ? (
            <div className={s.biblioteca}>
              {m.lecciones.map((l, i) => {
                const dentro = (
                  <>
                    <span className={s.num}>{i + 1}</span>
                    <div>
                      <h4>{l.titulo}</h4>
                      <p>{l.resumen}</p>
                      {!l.listo && <span className={s.estado}>En preparación</span>}
                    </div>
                  </>
                );
                return l.listo ? (
                  <Link key={l.slug} href={`/programa/aula/${l.slug}`} className={`${s.d2} ${s.aparece}`} style={{ ["--d" as string]: i }}>
                    {dentro}
                  </Link>
                ) : (
                  <div key={l.slug} className={`${s.d2} ${s.aparece}`} style={{ ["--d" as string]: i }}>
                    {dentro}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`${s.semana} ${s.panel}`}>
              <div className={s.filas}>
                {dias.map((l, i) => {
                  const hecha = hechas.has(l.slug);
                  const para = !!l.numero && paraTi.includes(l.numero);
                  const etiqueta = hecha ? "Hecha" : para ? "Para ti, por tu auditoría" : !l.listo ? "En preparación" : "";
                  return (
                    <Link
                      key={l.slug}
                      href={`/programa/aula/${l.slug}`}
                      className={`${s.d2} ${s.aparece} ${hecha ? s.d2Hecha : ""} ${para ? s.d2ParaTi : ""}`}
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
              {doc && (
                <Link className={s.cierre} href={`/programa/aula/${doc.slug}`}>
                  <b>Revisión de la semana</b>
                  <span>{doc.resumen}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

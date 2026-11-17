import type { Metadata } from "next";
import Link from "next/link";
import s from "./aula.module.css";
import { Marca } from "../Marca";
import { Bot, TRAJE_SEMANA, trajeDe } from "./Bot";
import { Planning, type FilaPlanning, type SemanaPlanning } from "./Planning";
import { alumnoActual, progresoDe } from "@/lib/programa";
import {
  RECORRIDO,
  RECURSOS,
  diaDelPrograma,
  estaAbierto,
  fechaApertura,
  fechaLarga,
  hoyMadrid,
  leccionVisible,
  leccionesAbiertas,
  moduloVisible,
  proximoModulo,
  sumarDias,
} from "@/lib/programa-curriculo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tu aula · Director con Claude", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ enlace?: string }> };


// Portada del aula, con el lenguaje de la landing del programa: halo, titular
// en fino y negrita, el agente en 8 bits, lo que toca ahora en azul noche y
// lo que ya tiene abierto en pestañas. Lo que aún no toca no se enseña.
export default async function AulaPage({ searchParams }: Props) {
  const { enlace } = await searchParams;
  const alumno = await alumnoActual();

  if (!alumno) {
    return (
      <main className={s.pagina}>
        <Marca />
        <section className={s.portada}>
          <div className={`${s.wrap} ${s.portadaGrid}`}>
            <div className={s.portadaTexto}>
              <h1 className={`${s.h1} ${s.aparece}`}>
                Tu <b>aula</b> del programa
              </h1>
              {enlace === "no" && <p className={s.aviso}>Ese enlace ya no funciona. Pídeme uno nuevo por WhatsApp.</p>}
              <p className={`${s.entradilla} ${s.aparece}`} style={{ ["--d" as string]: 1 }}>
                Se entra con tu enlace personal, el que te mandé por WhatsApp al apuntarte. Ábrelo desde el ordenador o el
                móvil donde vayas a hacer el programa. Si no lo encuentras, pídemelo por WhatsApp.
              </p>
            </div>
            <Bot traje="botones" estado="duerme" tam={220} />
          </div>
        </section>
      </main>
    );
  }

  const hechas = await progresoDe(alumno);
  const nombre = alumno.nombre.split(" ")[0];
  const hoy = hoyMadrid();
  const dia = diaDelPrograma(alumno.fecha_alta, hoy);
  const abiertas = leccionesAbiertas(alumno.fecha_alta, alumno.plan, hoy);
  const hechasYa = abiertas.filter((x) => hechas.has(x.leccion.slug)).length;
  const siguiente = abiertas.find((x) => !hechas.has(x.leccion.slug) && x.leccion.tipo !== "documento");
  const proximo = proximoModulo(alumno.fecha_alta, alumno.plan, hoy);
  const abreProximo = proximo ? fechaApertura(alumno.fecha_alta, proximo.abre) : "";
  const cuandoProximo = !abreProximo ? "" : abreProximo === sumarDias(hoy, 1) ? "mañana" : `el ${fechaLarga(abreProximo)}`;
  const hayRecursos = RECURSOS.some((r) => r.archivo && estaAbierto(alumno.fecha_alta, r.abre, hoy));

  const semanas: SemanaPlanning[] = RECORRIDO.filter((m) => moduloVisible(m, alumno.fecha_alta, alumno.plan, hoy)).map((m): SemanaPlanning => {
    const [pestana, titulo] = m.titulo.split(" · ");
    const visibles = m.lecciones.filter(leccionVisible);
    const doc = visibles.find((l) => l.tipo === "documento");
    return {
      id: m.id,
      pestana,
      titulo: titulo ?? pestana,
      nivel: m.subtitulo,
      traje: TRAJE_SEMANA[m.id] ?? "botones",
      abierta: true,
      abreEl: "",
      noche: m.id === "final",
      filas: visibles
        .filter((l) => l.tipo !== "documento")
        .map((l, i) => ({
          slug: l.slug,
          num: String(l.numero ?? i + 1),
          titulo: l.titulo,
          resumen: l.resumen,
          estado: (hechas.has(l.slug) ? "hecha" : "abierta") as FilaPlanning["estado"],
          paraTi: false,
          toca: siguiente?.leccion.slug === l.slug,
        })),
      cierre: doc
        ? { slug: doc.slug, estado: (hechas.has(doc.slug) ? "hecha" : "abierta") as FilaPlanning["estado"], texto: "Lo que has dejado funcionando y las horas que te devuelve." }
        : undefined,
    };
  });
  const inicial = siguiente?.modulo.id ?? semanas[semanas.length - 1]?.id ?? "dia-1";
  const trajeHoy = siguiente ? trajeDe(siguiente.leccion.slug, siguiente.modulo.id) : "graduado";

  return (
    <main className={s.pagina}>
      <Marca derecha={<a href="/programa/salir">Salir</a>} />

      <section className={s.portada}>
        <div className={`${s.wrap} ${s.portadaGrid}`}>
          <div className={s.portadaTexto}>
            <span className={`${s.pildora} ${s.aparece}`}>Día {dia}</span>
            <h1 className={`${s.h1} ${s.aparece}`} style={{ ["--d" as string]: 1 }}>
              Hola, <b>{nombre}</b>.
            </h1>
            <div className={`${s.contador} ${s.aparece}`} style={{ ["--d" as string]: 2 }}>
              <b className={s.grad}>{hechasYa}</b>
              <span>
                de {abiertas.length} {abiertas.length === 1 ? "hecha" : "hechas"} · empezaste el {fechaLarga(alumno.fecha_alta)}
              </span>
            </div>
            <div className={`${s.barra} ${s.aparece}`} style={{ ["--d" as string]: 2 }}>
              <i style={{ width: `${Math.max((hechasYa / Math.max(abiertas.length, 1)) * 100, 1.5)}%` }} />
            </div>
          </div>
          <div className={`${s.aparece} ${s.botPortada}`} style={{ ["--d" as string]: 2 }}>
            <Bot traje={trajeHoy} tam={240} />
          </div>
        </div>
      </section>

      {siguiente ? (
        <div className={s.wrap}>
          <section className={`${s.noche} ${s.aparece}`} style={{ ["--d" as string]: 3 }}>
            <div className={s.nocheTexto}>
              <span className={s.pildora}>Te toca ahora · {siguiente.modulo.titulo.split(" · ")[0]}</span>
              <h2>
                {siguiente.leccion.numero ? <span className={s.fino}>Día {siguiente.leccion.numero} · </span> : null}
                <b>{siguiente.leccion.titulo}</b>
              </h2>
              {siguiente.leccion.resumen && <p>{siguiente.leccion.resumen}</p>}
              <Link className={`${s.boton} ${s.botonClaro}`} href={`/programa/aula/${siguiente.leccion.slug}`}>
                Abrir
              </Link>
            </div>
            <div className={s.botCamina}>
              <Bot traje={trajeDe(siguiente.leccion.slug, siguiente.modulo.id)} tam={170} oscuro retraso={0.6} />
            </div>
          </section>
        </div>
      ) : proximo ? (
        <div className={s.wrap}>
          <section className={`${s.noche} ${s.aparece}`} style={{ ["--d" as string]: 3 }}>
            <div className={s.nocheTexto}>
              <span className={s.pildora}>Lo tienes todo hecho</span>
              <h2>
                <span className={s.fino}>Se abre {cuandoProximo} · </span>
                <b>{proximo.titulo.split(" · ")[1] ?? proximo.titulo}</b>
              </h2>
            </div>
            <div className={s.botCamina}>
              <Bot traje={TRAJE_SEMANA[proximo.id] ?? "botones"} tam={170} oscuro estado="duerme" />
            </div>
          </section>
        </div>
      ) : null}

      <section className={s.seccion}>
        <div className={s.wrap}>
          <div className={s.cabeza}>
            <h2 className={`${s.h2} ${s.aparece}`}>
              <span className={s.fino}>Tu</span> programa
            </h2>
            <p className={`${s.entradilla} ${s.aparece}`} style={{ ["--d" as string]: 1 }}>
              {proximo && siguiente
                ? `Esto es lo que tienes abierto. Lo siguiente se abre ${cuandoProximo}.`
                : "Esto es lo que tienes abierto. Lo siguiente se abre solo cuando toca."}
            </p>
          </div>
          <Planning semanas={semanas} inicial={inicial} />
        </div>
      </section>

      {(alumno.auditoria || hayRecursos) && (
        <section className={s.seccion}>
          <div className={s.wrap}>
            <div className={s.mano}>
              {alumno.auditoria && (
                <Link href="/programa/aula/auditoria" className={s.tarjeta}>
                  <Bot traje="auditor" tam={92} retraso={0.3} />
                  <b>Tu auditoría</b>
                  <span>Entregada. Con ella preparo el plano de tu sistema.</span>
                </Link>
              )}
              {hayRecursos && (
                <Link href="/programa/aula/recursos" className={s.tarjeta}>
                  <Bot traje="carpeta" tam={92} retraso={1.1} />
                  <b>Recursos</b>
                  <span>Las plantillas para quedártelas.</span>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

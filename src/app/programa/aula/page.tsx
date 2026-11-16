import type { Metadata } from "next";
import Link from "next/link";
import s from "./aula.module.css";
import { Marca } from "../Marca";
import { Bot, TRAJE_SEMANA, trajeDe } from "./Bot";
import { Planning, type FilaPlanning, type SemanaPlanning } from "./Planning";
import { alumnoActual, progresoDe } from "@/lib/programa";
import {
  MODULOS,
  TOTAL_DIAS,
  estaAbierto,
  fechaApertura,
  fechaLarga,
  leccionesEnOrden,
  puedeVer,
  semanaActual,
  type Leccion,
  type Modulo,
} from "@/lib/programa-curriculo";
import { DIAS_POR_TAREA } from "@/lib/programa-a-medida";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tu aula · Director con Claude", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ enlace?: string }> };


// Portada del aula, con el lenguaje de la landing del programa: halo, titular
// en fino y negrita, el agente en 8 bits, lo que toca ahora en azul noche y
// las semanas en pestañas.
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
  const diasHechos = [...hechas].filter((l) => l.startsWith("dia-")).length;
  const semana = Math.max(semanaActual(alumno.fecha_alta), 1);
  const nombre = alumno.nombre.split(" ")[0];
  const p = alumno.punto_partida;
  const paraTi = p ? (DIAS_POR_TAREA[p.principal] ?? []) : [];

  const moduloDe = (l: Leccion) => MODULOS.find((m) => m.lecciones.includes(l))!;
  const abierto = (m: Modulo) => estaAbierto(alumno.fecha_alta, m.abre);
  const siguiente = leccionesEnOrden(alumno.plan).find(
    (l) => abierto(moduloDe(l)) && !hechas.has(l.slug) && l.tipo !== "documento",
  );
  const estadoDe = (l: Leccion, m: Modulo): FilaPlanning["estado"] =>
    !abierto(m) ? "cerrada" : hechas.has(l.slug) ? "hecha" : !l.listo ? "prep" : "abierta";

  const inicio = MODULOS.find((m) => m.id === "inicio")!;
  const semanas: SemanaPlanning[] = MODULOS.filter(
    (m) => (m.id.startsWith("semana-") || m.id === "final" || m.id === "avanzado") && puedeVer(m, alumno.plan),
  ).map((m) => {
    const [pestana, titulo] = m.titulo.split(" · ");
    const dias = m.lecciones.filter((l) => !l.tipo);
    const doc = m.lecciones.find((l) => l.tipo === "documento");
    const auditoria = m.lecciones.find((l) => l.tipo === "auditoria");
    return {
      id: m.id,
      pestana,
      titulo: titulo ?? pestana,
      nivel: m.subtitulo,
      traje: TRAJE_SEMANA[m.id] ?? "botones",
      abierta: abierto(m),
      abreEl: fechaLarga(fechaApertura(alumno.fecha_alta, m.abre)),
      noche: m.id === "final",
      antes:
        m.id === "semana-1"
          ? [...inicio.lecciones, ...(auditoria ? [auditoria] : [])].map((l) => ({
              slug: l.slug,
              titulo: l.tipo === "auditoria" ? "Tu auditoría" : l.titulo,
              texto: l.tipo === "auditoria" ? "3 minutos. Con ella te preparo tu hoja de ruta." : "Cómo funciona el programa.",
              estado: estadoDe(l, moduloDe(l)),
              toca: siguiente?.slug === l.slug,
            }))
          : undefined,
      filas: dias.map((l, i) => ({
        slug: l.slug,
        num: String(l.numero ?? i + 1),
        titulo: l.titulo,
        resumen: l.resumen,
        estado: estadoDe(l, m),
        paraTi: !!l.numero && paraTi.includes(l.numero),
        toca: siguiente?.slug === l.slug,
      })),
      cierre: doc ? { slug: doc.slug, estado: estadoDe(doc, m), texto: "Lo que has dejado funcionando y las horas que te devuelve." } : undefined,
    };
  });
  const semanaInicial = `semana-${Math.min(semana, 4)}`;
  const trajeHoy = semana >= 5 ? "graduado" : TRAJE_SEMANA[semanaInicial];
  const moduloSiguiente = siguiente ? moduloDe(siguiente) : undefined;

  return (
    <main className={s.pagina}>
      <Marca derecha={<a href="/programa/salir">Salir</a>} />

      <section className={s.portada}>
        <div className={`${s.wrap} ${s.portadaGrid}`}>
          <div className={s.portadaTexto}>
            <span className={`${s.pildora} ${s.aparece}`}>
              {semana >= 5 ? "Día 21 abierto" : `Semana ${semana} de 4`}
            </span>
            <h1 className={`${s.h1} ${s.aparece}`} style={{ ["--d" as string]: 1 }}>
              Hola, <b>{nombre}</b>.
            </h1>
            <div className={`${s.contador} ${s.aparece}`} style={{ ["--d" as string]: 2 }}>
              <b className={s.grad}>{diasHechos}</b>
              <span>de {TOTAL_DIAS} días hechos · empezaste el {fechaLarga(alumno.fecha_alta)}</span>
            </div>
            <div className={`${s.barra} ${s.aparece}`} style={{ ["--d" as string]: 2 }}>
              <i style={{ width: `${Math.max((diasHechos / TOTAL_DIAS) * 100, 1.5)}%` }} />
            </div>
          </div>
          <div className={`${s.aparece} ${s.botPortada}`} style={{ ["--d" as string]: 2 }}>
            <Bot traje={trajeHoy} tam={240} />
          </div>
        </div>
      </section>

      {siguiente && moduloSiguiente && (
        <div className={s.wrap}>
          <section className={`${s.noche} ${s.aparece}`} style={{ ["--d" as string]: 3 }}>
            <div className={s.nocheTexto}>
              <span className={s.pildora}>
                Te toca ahora · {moduloSiguiente.id === "inicio" ? "antes de empezar" : moduloSiguiente.titulo.split(" · ")[0]}
              </span>
              <h2>
                {siguiente.numero ? <span className={s.fino}>Día {siguiente.numero} · </span> : null}
                <b>{siguiente.tipo === "auditoria" ? "Tu auditoría" : siguiente.titulo}</b>
              </h2>
              {siguiente.resumen && <p>{siguiente.resumen}</p>}
              <Link className={`${s.boton} ${s.botonClaro}`} href={`/programa/aula/${siguiente.slug}`}>
                Abrir
              </Link>
            </div>
            <div className={s.botCamina}>
              <Bot traje={trajeDe(siguiente.slug, moduloSiguiente.id)} tam={170} oscuro retraso={0.6} />
            </div>
          </section>
        </div>
      )}

      <section className={s.seccion}>
        <div className={s.wrap}>
          <div className={s.cabeza}>
            <h2 className={`${s.h2} ${s.aparece}`}>
              <span className={s.fino}>Tus</span> <span className={s.grad}>21</span> días
            </h2>
            <p className={`${s.entradilla} ${s.aparece}`} style={{ ["--d" as string]: 1 }}>
              Cada semana se abre sola a los 7 días de la anterior. Su agente te espera despierto.
            </p>
          </div>
          <Planning semanas={semanas} inicial={semanaInicial} />
        </div>
      </section>

      <section className={s.seccion}>
        <div className={s.wrap}>
          <div className={s.mano}>
            <Link href="/programa/aula/auditoria" className={s.tarjeta}>
              <Bot traje="auditor" tam={92} retraso={0.3} />
              <b>Tu auditoría</b>
              <span>{p ? `Tu primer agente: ${p.principal.toLowerCase()}.` : "Pendiente. Son 3 minutos."}</span>
            </Link>
            <Link href="/programa/aula/modulo/biblioteca" className={s.tarjeta}>
              <Bot traje="libro" tam={92} retraso={1.1} />
              <b>Biblioteca de Claude</b>
              <span>Lo básico de Claude, pensado para el día a día de un hotel.</span>
            </Link>
            <Link href="/programa/aula/recursos" className={s.tarjeta}>
              <Bot traje="carpeta" tam={92} retraso={1.8} />
              <b>Recursos</b>
              <span>Las plantillas y los documentos del programa.</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

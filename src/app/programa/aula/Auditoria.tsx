import Link from "next/link";
import s from "./aula.module.css";
import { Bot } from "./Bot";
import type { Alumno } from "@/lib/programa";
import { MODULOS } from "@/lib/programa-curriculo";
import { DIAS_POR_TAREA } from "@/lib/programa-a-medida";

// La auditoría, primera pieza de la semana 1. Antes de entregarla: qué incluye
// y el formulario. Después: lo que le devuelve Héctor (su hoja de ruta, su
// primer agente, los días que más le sirven) y lo que contó, con sus palabras.

const sinContestar = (v?: string) => !v || v === "(sin contestar)";

export function Auditoria({ alumno }: { alumno: Alumno }) {
  const p = alumno.punto_partida;
  const formulario = `/programa/punto-de-partida?email=${encodeURIComponent(alumno.email)}`;

  if (!p) {
    return (
      <div className={s.cuerpo}>
        <div className={s.recibes}>
          <div>
            <h3>Lo que me entregas</h3>
            <p>Diez preguntas cortas, unos 5 minutos. Lo básico se marca de un toque y en cuatro me lo cuentas con tus palabras, escrito o dictado.</p>
            <ul className={s.puntos}>
              <li>Tu hotel y tu puesto.</li>
              <li>La tarea que más te pesa y cómo la haces hoy, paso a paso.</li>
              <li>Cómo es el resto de tu semana en el despacho.</li>
              <li>Lo que quieres tener funcionando al acabar y lo que te frena.</li>
            </ul>
          </div>
          <div>
            <h3>Lo que te devuelvo</h3>
            <ul className={s.puntos}>
              <li>Tu primer agente, la tarea que dejas funcionando sola en la semana 4.</li>
              <li>Los días del programa que más te sirven, marcados en tu planning.</li>
              <li>Tu hoja de ruta, escrita por mí para tu hotel.</li>
              <li>Tu punto de partida, para compararlo el día 21.</li>
            </ul>
          </div>
        </div>
        <a className={s.boton} href={formulario}>
          Entregar mi auditoría
        </a>
      </div>
    );
  }

  const dias = DIAS_POR_TAREA[p.principal] ?? [];
  const leccionDia = (n: number) => MODULOS.flatMap((m) => m.lecciones).find((l) => l.numero === n);
  const suyas: [string, string][] = [
    ["Cómo lo haces hoy", p.como_hoy],
    ["Tu semana en el despacho", p.semana],
    ["Lo que quieres al acabar", p.objetivo],
    ["Lo que te frena", p.freno],
  ];

  return (
    <div className={s.cuerpo}>
      <section className={s.noche}>
        <div className={s.nocheTexto}>
          <span className={s.pildora}>Tu hoja de ruta, de Héctor</span>
          {alumno.nota ? (
            <p className={s.nota}>{alumno.nota}</p>
          ) : (
            <p>La estoy preparando con lo que me has contado. Te aviso por WhatsApp cuando la tengas aquí.</p>
          )}
        </div>
        <Bot traje="auditor" tam={150} oscuro estado={alumno.nota ? "despierto" : "duerme"} />
      </section>

      <section className={s.bloque}>
        <span className={s.pildora}>Tu primer agente</span>
        <p className={s.destacado}>{p.principal}</p>
        <p>En la semana 4 lo dejas funcionando solo, y el día 21 sabrás montar cualquier otro con el Método Fricción 0.</p>
      </section>

      {dias.length > 0 && (
        <section className={s.bloque}>
          <h2>Los días que más te sirven</h2>
          <div className={s.filas}>
            {dias.map((n, i) => {
              const l = leccionDia(n);
              return l ? (
                <Link key={n} href={`/programa/aula/${l.slug}`} className={`${s.d2} ${s.d2ParaTi} ${s.aparece}`} style={{ ["--d" as string]: i }}>
                  <span className={s.num}>{n}</span>
                  <div>
                    <h4>{l.titulo}</h4>
                    <p>{l.resumen}</p>
                  </div>
                </Link>
              ) : null;
            })}
          </div>
        </section>
      )}

      <section className={s.bloque}>
        <h2>Lo que me contaste</h2>
        <div className={s.palabras}>
          {suyas
            .filter(([, v]) => !sinContestar(v))
            .map(([t, v]) => (
              <figure key={t}>
                <figcaption>{t}</figcaption>
                <blockquote>{v}</blockquote>
              </figure>
            ))}
        </div>
        <dl className={s.ficha}>
          {[
            ["Momento", p.momento],
            ["Puesto", p.puesto],
            ["Habitaciones", p.habitaciones],
            ["Correo y documentos", p.ofimatica],
          ]
            .filter(([, v]) => !sinContestar(v))
            .map(([t, v]) => (
              <div key={t}>
                <dt>{t}</dt>
                <dd>{v}</dd>
              </div>
            ))}
        </dl>
        <a className={s.volver} href={formulario}>
          ¿Ha cambiado algo? Vuelve a entregarla
        </a>
      </section>
    </div>
  );
}

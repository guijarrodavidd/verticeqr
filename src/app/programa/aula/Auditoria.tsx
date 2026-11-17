import s from "./aula.module.css";
import { Bot } from "./Bot";
import type { Alumno } from "@/lib/programa";
import { visibles } from "../auditoria/preguntas";

// La auditoría, lo único del día 1. Antes de entregarla: qué incluye y el
// botón al formulario largo. Después: lo que le devuelve Héctor y lo que contó,
// con sus palabras.

export function Auditoria({ alumno }: { alumno: Alumno }) {
  const a = alumno.auditoria;

  if (!a) {
    return (
      <div className={s.cuerpo}>
        <div className={s.recibes}>
          <div>
            <h3>Lo que me entregas</h3>
            <p>Unos 40 minutos, con calma. Casi todo es para escribir, o dictar con el micrófono del teclado.</p>
            <ul className={s.puntos}>
              <li>Tu semana y lo que quieres tener funcionando.</li>
              <li>Hasta tres tareas que te quieres quitar de encima, contadas paso a paso.</li>
              <li>Los programas y el correo con los que trabajáis, para montarlo sobre lo que ya tienes.</li>
            </ul>
          </div>
          <div>
            <h3>Lo que te devuelvo</h3>
            <ul className={s.puntos}>
              <li>La leo antes de nuestra llamada y repasamos juntos lo que no me quede claro.</li>
              <li>Una semana después, el plano de tu sistema, aquí en tu aula.</li>
            </ul>
          </div>
        </div>
        <a className={s.boton} href="/programa/auditoria">
          Hacer mi auditoría
        </a>
      </div>
    );
  }

  const preguntas = visibles(Object.fromEntries(Object.entries(a).map(([k, v]) => [k, [v]])));

  return (
    <div className={s.cuerpo}>
      <section className={s.noche}>
        <div className={s.nocheTexto}>
          <span className={s.pildora}>De Héctor</span>
          {alumno.nota ? (
            <p className={s.nota}>{alumno.nota}</p>
          ) : (
            <p>Ya tengo tu auditoría. La leo antes de nuestra llamada y una semana después tienes aquí el plano de tu sistema.</p>
          )}
        </div>
        <Bot traje="auditor" tam={150} oscuro estado={alumno.nota ? "despierto" : "duerme"} />
      </section>

      <details className={s.bloque}>
        <summary>
          <h2 style={{ display: "inline" }}>Lo que me contaste</h2>
        </summary>
        <dl className={s.ficha} style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
          {preguntas
            .filter((p) => a[p.id] && a[p.id] !== "(sin contestar)")
            .map((p) => (
              <div key={p.id}>
                <dt>{p.texto}</dt>
                <dd style={{ whiteSpace: "pre-wrap", fontWeight: 400 }}>{a[p.id]}</dd>
              </div>
            ))}
        </dl>
        <p>¿Ha cambiado algo? Cuéntamelo por WhatsApp.</p>
      </details>
    </div>
  );
}

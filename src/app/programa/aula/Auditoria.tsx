import s from "./aula.module.css";
import { Bot } from "./Bot";
import type { Alumno } from "@/lib/programa";
import { visibles } from "../auditoria/preguntas";

// La auditoría, lo único del día 1. En el programa el alumno lo monta todo él;
// la auditoría le da a Héctor el contexto para sugerirle por dónde empezar.
// Antes de entregarla: qué incluye y el botón al formulario. Después: las
// sugerencias de Héctor y lo que contó, con sus palabras.

export function Auditoria({ alumno }: { alumno: Alumno }) {
  const a = alumno.auditoria;

  if (!a) {
    return (
      <div className={s.cuerpo}>
        <div className={s.recibes}>
          <div>
            <h3>Lo que me entregas</h3>
            <p>Siéntate con calma. Casi todo es para escribir, o dictar con el micrófono del teclado.</p>
            <ul className={s.puntos}>
              <li>Tu semana y lo que quieres tener funcionando.</li>
              <li>Hasta tres tareas que te quieres quitar de encima, contadas paso a paso.</li>
              <li>Los programas y el correo con los que trabajáis, para que lo que montes encaje con lo que ya tienes.</li>
            </ul>
          </div>
          <div>
            <h3>Lo que te devuelvo</h3>
            <ul className={s.puntos}>
              <li>Mis sugerencias para tu hotel: por dónde empezar y qué agente te conviene montar primero.</li>
              <li>Te las dejo aquí, en tu aula, para que las tengas a mano durante el programa.</li>
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
          <span className={s.pildora}>Mis sugerencias para ti</span>
          {alumno.nota ? (
            <p className={s.nota}>{alumno.nota}</p>
          ) : (
            <p>Ya tengo tu auditoría. La leo con calma y te dejo aquí mis sugerencias para tu hotel.</p>
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

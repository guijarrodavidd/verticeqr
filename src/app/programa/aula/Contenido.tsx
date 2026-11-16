import type { ReactNode } from "react";
import s from "./aula.module.css";
import { Copiar } from "./Copiar";
import type { Bloque, Contenido as TipoContenido, Seccion } from "./lecciones";

// Pinta el contenido de una lección. Solo entiende **negrita** dentro del texto.
function enLinea(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((trozo, i) =>
    trozo.startsWith("**") && trozo.endsWith("**") ? <b key={i}>{trozo.slice(2, -2)}</b> : trozo,
  );
}

function PintaBloque({ b, id }: { b: Bloque; id: string }) {
  switch (b.tipo) {
    case "texto":
      return <p>{enLinea(b.texto)}</p>;
    case "pasos":
      return (
        <ol>
          {b.items.map((x, i) => (
            <li key={i}>{enLinea(x)}</li>
          ))}
        </ol>
      );
    case "lista":
      return (
        <ul>
          {b.items.map((x, i) => (
            <li key={i}>{enLinea(x)}</li>
          ))}
        </ul>
      );
    case "cita":
      return <blockquote className={s.cita}>{enLinea(b.texto)}</blockquote>;
    case "prompt":
      return (
        <div className={s.prompt}>
          <div className={s.promptCabeza}>
            <span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/programa/claude-simbolo.svg" alt="" />
              Para pegar en Claude
            </span>
            <Copiar texto={b.texto} destino={id} />
          </div>
          <pre id={id}>{b.texto}</pre>
        </div>
      );
  }
}

function PintaSeccion({ sec, clave, clase }: { sec: Seccion; clave: string; clase?: string }) {
  return (
    <section className={`${s.bloque} ${clase ?? ""}`}>
      <h2>{sec.titulo}</h2>
      {sec.bloques.map((b, i) => (
        <PintaBloque key={i} b={b} id={`${clave}-${i}`} />
      ))}
    </section>
  );
}

function Checks({ titulo, items }: { titulo: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <section className={s.bloque}>
      <h2>{titulo}</h2>
      <ul className={s.checks}>
        {items.map((x, i) => (
          <li key={i}>{enLinea(x)}</li>
        ))}
      </ul>
    </section>
  );
}

export function Contenido({ c }: { c: TipoContenido }) {
  return (
    <div className={s.cuerpo}>
      {c.caso && (
        <section className={s.bloque}>
          <h2>El caso de hoy</h2>
          <p className={s.caso}>{enLinea(c.caso)}</p>
        </section>
      )}
      {c.secciones.map((sec, i) => (
        <PintaSeccion key={i} sec={sec} clave={`s${i}`} />
      ))}
      {c.asiQueda && <PintaSeccion sec={c.asiQueda} clave="asi" clase={s.asiQueda} />}
      <Checks titulo="Revísalo tú" items={c.revisalo} />
      <Checks titulo="Si no te sale" items={c.siNoTeSale} />
      <Checks titulo="Recibes" items={c.recibes} />
    </div>
  );
}

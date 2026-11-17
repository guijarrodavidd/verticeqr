"use client";

import { useEffect, useRef, useState } from "react";
import s from "../punto-de-partida/punto.module.css";
import a from "./auditoria.module.css";
import { BORRADOR, perfil, visibles, type Pregunta, type Respuestas } from "./preguntas";
import { guardarAuditoria } from "./actions";

// Una pregunta por pantalla, con su apartado encima. Las de un toque pasan solas;
// las de escribir piden un mínimo para que lo cuente con calma. Todo se guarda en
// este dispositivo mientras escribe, para poder dejarla a medias y seguir otro día.

const MINIMO = 40;

const ERRORES: Record<string, string> = {
  nombre: "Escribe tu nombre.",
  telefono: "Pon un teléfono válido, con prefijo si no es de España.",
  email: "Pon el email con el que te apuntaste.",
  hotel: "Escribe el nombre del hotel.",
  campos: "Te ha faltado alguna pregunta.",
};

const EJEMPLO_DE = { director: "Ejemplo de una directora de hotel", jefe: "Ejemplo de un jefe de revenue" };

type Props = { conocido: { nombre: string; email: string } | null; error?: string };

export function FormularioAuditoria({ conocido, error }: Props) {
  // -1 es la portada; después de la última pregunta, los datos (si no sabemos quién es).
  const [paso, setPaso] = useState(-1);
  const [resp, setResp] = useState<Respuestas>({});
  const [borrador, setBorrador] = useState<{ resp: Respuestas; paso: number } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const avance = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lista = visibles(resp);
  const conDatos = !conocido;
  const total = lista.length + (conDatos ? 1 : 0);
  const quien = perfil(resp);

  // Al abrir, si hay una auditoría a medias en este dispositivo, se ofrece seguir.
  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(BORRADOR) ?? "null");
      if (guardado?.resp && Object.values(guardado.resp).some((v) => (v as string[]).some((x) => x.trim()))) setBorrador(guardado);
    } catch {}
  }, []);

  useEffect(() => {
    if (paso < 0) return;
    try {
      localStorage.setItem(BORRADOR, JSON.stringify({ resp, paso }));
    } catch {}
  }, [resp, paso]);

  useEffect(() => {
    if (paso < 0) return;
    caja.current?.querySelector<HTMLElement>("[data-actual] .foco")?.focus({ preventScroll: true });
    caja.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [paso]);

  // Si una respuesta quita preguntas (por ejemplo, «no hay otra tarea»), el paso no se sale de la lista.
  const actual = Math.min(paso, total - 1);

  const poner = (p: Pregunta, valores: string[]) => setResp((r) => ({ ...r, [p.id]: valores }));

  const elegir = (p: Pregunta, i: number, valor: string) => {
    if (p.tipo === "varias") {
      const antes = resp[p.id] ?? [];
      poner(p, antes.includes(valor) ? antes.filter((v) => v !== valor) : [...antes, valor]);
      return;
    }
    poner(p, [valor]);
    if (avance.current) clearTimeout(avance.current);
    avance.current = setTimeout(() => setPaso(i + 1), 260);
  };

  const largo = (p: Pregunta) => (resp[p.id]?.[0] ?? "").trim().length;
  const contestada = (p: Pregunta) => {
    if (p.opcional) return true;
    if (p.tipo === "escribir") return largo(p) >= MINIMO;
    return (resp[p.id] ?? []).some((v) => v.trim());
  };

  if (paso === -1) {
    return (
      <div className={s.portada}>
        <p className={s.antetitulo}>Implantación con Héctor · paso 1</p>
        <h1 className={s.titulo}>Tu auditoría</h1>
        <p className={s.entrada}>
          Siéntate con calma y cuéntame tu semana, lo que buscas y las tareas que te quieres quitar de encima. Lo leo antes de
          nuestra llamada y, una semana después, te entrego el plano de tu sistema.
        </p>
        {borrador ? (
          <div className={a.seguir}>
            <button
              type="button"
              className={s.empezar}
              onClick={() => {
                setResp(borrador.resp);
                setPaso(Math.max(0, borrador.paso));
              }}
            >
              Seguir donde lo dejé
            </button>
            <button
              type="button"
              className={a.deCero}
              onClick={() => {
                try {
                  localStorage.removeItem(BORRADOR);
                } catch {}
                setBorrador(null);
                setResp({});
                setPaso(0);
              }}
            >
              Empezar de cero
            </button>
          </div>
        ) : (
          <button type="button" className={s.empezar} onClick={() => setPaso(0)}>
            Empezar
          </button>
        )}
        <p className={s.nota}>
          Se guarda sola en este dispositivo, así que puedes dejarla a medias y seguir otro día. Si te cuesta
          escribir, díctalo con el micrófono del teclado.
        </p>
        {error && ERRORES[error] && (
          <p className={s.error} role="alert">
            {ERRORES[error]} Tus respuestas siguen guardadas: pulsa «Seguir donde lo dejé».
          </p>
        )}
      </div>
    );
  }

  const ultima = lista.length - 1;

  return (
    <div className={s.caja} ref={caja}>
      <div className={s.progreso} aria-hidden="true">
        <div className={s.barra} style={{ width: `${((actual + 1) / total) * 100}%` }} />
      </div>
      <p className={s.contador}>
        {actual + 1} de {total} <span className={a.guardado}>· se guarda sola</span>
      </p>

      <form action={guardarAuditoria} onSubmit={() => setEnviando(true)}>
        <input type="text" name="hp" tabIndex={-1} autoComplete="off" className={s.trampa} aria-hidden="true" />

        {lista.map((p, i) => {
          const valor = resp[p.id]?.[0] ?? "";
          const enviaAqui = !conDatos && i === ultima;
          return (
            <fieldset key={p.id} className={s.paso} hidden={actual !== i} data-actual={actual === i ? "" : undefined}>
              <legend className={`${s.pregunta} foco`} tabIndex={-1}>
                <span className={a.apartado}>{p.apartado}</span>
                {p.texto}
              </legend>
              {p.ayuda && <p className={s.ayuda}>{p.ayuda}</p>}

              {p.tipo === "escribir" && (
                <>
                  <textarea
                    name={p.id}
                    className={`${s.frase} ${a.largo}`}
                    rows={8}
                    maxLength={4000}
                    value={valor}
                    onChange={(e) => poner(p, [e.target.value])}
                  />
                  {!p.opcional && largo(p) > 0 && largo(p) < MINIMO && (
                    <p className={a.pista}>Cuéntamelo con un poco más de detalle.</p>
                  )}
                  {p.ejemplo && (
                    <details className={a.ejemplo}>
                      <summary>Ver un ejemplo</summary>
                      <p className={a.quien}>{EJEMPLO_DE[quien]}</p>
                      <p>{p.ejemplo[quien]}</p>
                    </details>
                  )}
                </>
              )}

              {p.tipo === "corta" && (
                <input
                  name={p.id}
                  type="text"
                  className={s.campo}
                  maxLength={300}
                  placeholder={p.marcador}
                  value={valor}
                  onChange={(e) => poner(p, [e.target.value])}
                />
              )}

              {(p.tipo === "toque" || p.tipo === "varias") && (
                <div className={s.opciones}>
                  {(p.opciones ?? []).map((o) => {
                    const marcada = (resp[p.id] ?? []).includes(o);
                    return (
                      <label key={o} className={`${s.opcion} ${p.tipo === "varias" ? s.varias : ""}`}>
                        <input
                          type={p.tipo === "varias" ? "checkbox" : "radio"}
                          name={p.id}
                          value={o}
                          checked={marcada}
                          onChange={() => elegir(p, i, o)}
                          // Al volver atrás, tocar la que ya estaba marcada también avanza.
                          onClick={() => p.tipo === "toque" && marcada && setPaso(i + 1)}
                        />
                        <span>{o}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className={s.botones}>
                {i > 0 ? (
                  <button type="button" className={s.atras} onClick={() => setPaso(i - 1)}>
                    ← Atrás
                  </button>
                ) : (
                  <span />
                )}
                {enviaAqui ? (
                  <button type="submit" className={s.siguiente} disabled={!contestada(p) || enviando}>
                    {enviando ? "Enviando…" : "Enviar mi auditoría"}
                  </button>
                ) : (
                  p.tipo !== "toque" && (
                    <button type="button" className={s.siguiente} disabled={!contestada(p)} onClick={() => setPaso(i + 1)}>
                      {p.opcional && !valor.trim() ? "Saltar" : "Siguiente"}
                    </button>
                  )
                )}
              </div>
            </fieldset>
          );
        })}

        {conDatos && (
          <fieldset className={s.paso} hidden={actual !== lista.length} data-actual={actual === lista.length ? "" : undefined}>
            <legend className={`${s.pregunta} foco`} tabIndex={-1}>
              <span className={a.apartado}>Tus datos</span>
              Por último, ¿cómo te localizo?
            </legend>
            <div className={s.campos}>
              <input name="nombre" type="text" required className={s.campo} placeholder="Tu nombre" autoComplete="name" aria-label="Tu nombre" />
              <input
                name="email"
                type="email"
                required
                className={s.campo}
                placeholder="El email con el que te apuntaste"
                aria-label="Email"
                autoComplete="email"
              />
              <input
                name="telefono"
                type="tel"
                required
                minLength={9}
                pattern="[+0-9 ()\-]{9,}"
                className={s.campo}
                placeholder="Tu WhatsApp"
                aria-label="Tu WhatsApp"
                autoComplete="tel"
                inputMode="tel"
              />
              <input name="hotel" type="text" required className={s.campo} placeholder="Hotel y ciudad" aria-label="Hotel y ciudad" />
            </div>
            <div className={s.botones}>
              <button type="button" className={s.atras} onClick={() => setPaso(ultima)}>
                ← Atrás
              </button>
              <button type="submit" className={s.siguiente} disabled={enviando}>
                {enviando ? "Enviando…" : "Enviar mi auditoría"}
              </button>
            </div>
            <p className={s.legal}>
              Uso tus respuestas solo para preparar tu auditoría y el plano de tu sistema. <a href="/privacidad">Privacidad</a>
            </p>
          </fieldset>
        )}
      </form>
    </div>
  );
}

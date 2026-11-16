"use client";

import { useEffect, useRef, useState } from "react";
import s from "./punto.module.css";
import { PREGUNTAS, type Pregunta } from "./preguntas";
import { guardarPuntoDePartida } from "./actions";

// Una pregunta por pantalla. Las de una sola respuesta pasan solas a la
// siguiente al tocar; las de varias y la frase libre llevan «Siguiente».
// Todo va dentro del mismo <form>, así que al final se envía de una vez.

const ERRORES: Record<string, string> = {
  nombre: "Escribe tu nombre.",
  telefono: "Pon un teléfono válido, con prefijo si no es de España.",
  email: "Pon el email con el que te apuntaste.",
  hotel: "Escribe el nombre del hotel.",
  ciudad: "Dime en qué ciudad está el hotel.",
  campos: "Te ha faltado alguna pregunta.",
};

const NOMBRE_HOTEL: Record<string, string> = {
  "Voy a entrar en un hotel": "El hotel al que vas a entrar",
  "Estoy entre hoteles": "El último hotel en el que estuviste",
};

export function Cuestionario({ error, email }: { error?: string; email?: string }) {
  const total = PREGUNTAS.length + 1;
  // -1 es la portada; PREGUNTAS.length, la pantalla de los datos.
  const [paso, setPaso] = useState(-1);
  const [resp, setResp] = useState<Record<string, string[]>>({});
  const [enviando, setEnviando] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const avance = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paso < 0) return;
    caja.current?.querySelector<HTMLElement>("[data-actual] .foco")?.focus({ preventScroll: true });
    caja.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [paso]);

  const opcionesDe = (p: Pregunta) => {
    const previas = p.desde ? resp[p.desde] : undefined;
    return previas && previas.length ? previas : p.opciones;
  };

  const elegir = (p: Pregunta, i: number, valor: string) => {
    if (p.multiple) {
      const antes = resp[p.id] ?? [];
      const ahora = antes.includes(valor) ? antes.filter((v) => v !== valor) : [...antes, valor];
      const nuevo = { ...resp, [p.id]: ahora };
      // Si la tarea principal ya no está entre las marcadas, se vuelve a elegir.
      for (const q of PREGUNTAS) {
        if (q.desde === p.id && nuevo[q.id]?.[0] && ahora.length && !ahora.includes(nuevo[q.id][0])) {
          nuevo[q.id] = [];
        }
      }
      setResp(nuevo);
      return;
    }
    setResp({ ...resp, [p.id]: [valor] });
    if (avance.current) clearTimeout(avance.current);
    avance.current = setTimeout(() => setPaso(i + 1), 260);
  };

  const contestada = (p: Pregunta) => p.opcional || (resp[p.id] ?? []).some((v) => v.trim());

  if (paso === -1) {
    return (
      <div className={s.portada}>
        <p className={s.antetitulo}>Semana 1 · antes del día 1</p>
        <h1 className={s.titulo}>Tu auditoría</h1>
        <p className={s.entrada}>
          Cuéntame cómo es tu hotel y cómo es tu semana en el despacho. Con lo que me cuentes te preparo tu hoja de ruta
          y elegimos tu primer agente.
        </p>
        <button type="button" className={s.empezar} onClick={() => setPaso(0)}>
          Empezar
        </button>
        <p className={s.nota}>{total} preguntas. Unas de un toque y cuatro para que me lo cuentes con tus palabras. Unos 5 minutos.</p>
        {error && ERRORES[error] && (
          <p className={s.error} role="alert">
            {ERRORES[error]} Tus respuestas no han llegado, vuelve a empezar.
          </p>
        )}
      </div>
    );
  }

  const momento = resp.momento?.[0] ?? "";

  return (
    <div className={s.caja} ref={caja}>
      <div className={s.progreso} aria-hidden="true">
        <div className={s.barra} style={{ width: `${((paso + 1) / total) * 100}%` }} />
      </div>
      <p className={s.contador}>
        {paso + 1} de {total}
      </p>

      <form action={guardarPuntoDePartida} onSubmit={() => setEnviando(true)}>
        <input type="text" name="hp" tabIndex={-1} autoComplete="off" className={s.trampa} aria-hidden="true" />

        {PREGUNTAS.map((p, i) => (
          <fieldset key={p.id} className={s.paso} hidden={paso !== i} data-actual={paso === i ? "" : undefined}>
            <legend className={`${s.pregunta} foco`} tabIndex={-1}>
              {p.texto}
            </legend>
            {p.ayuda && <p className={s.ayuda}>{p.ayuda}</p>}

            {p.libre ? (
              <textarea
                name={p.id}
                className={s.frase}
                rows={6}
                maxLength={1500}
                placeholder={p.ejemplo}
                value={resp[p.id]?.[0] ?? ""}
                onChange={(e) => setResp({ ...resp, [p.id]: [e.target.value] })}
              />
            ) : (
              <div className={s.opciones}>
                {opcionesDe(p).map((o) => {
                  const marcada = (resp[p.id] ?? []).includes(o);
                  return (
                    <label key={o} className={`${s.opcion} ${p.multiple ? s.varias : ""}`}>
                      <input
                        type={p.multiple ? "checkbox" : "radio"}
                        name={p.id}
                        value={o}
                        checked={marcada}
                        onChange={() => elegir(p, i, o)}
                        // Al volver atrás, tocar la que ya estaba marcada también avanza.
                        onClick={() => !p.multiple && marcada && setPaso(i + 1)}
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
              {(p.multiple || p.libre) && (
                <button type="button" className={s.siguiente} disabled={!contestada(p)} onClick={() => setPaso(i + 1)}>
                  {p.opcional && !resp[p.id]?.[0]?.trim() ? "Saltar" : "Siguiente"}
                </button>
              )}
            </div>
          </fieldset>
        ))}

        <fieldset className={s.paso} hidden={paso !== PREGUNTAS.length} data-actual={paso === PREGUNTAS.length ? "" : undefined}>
          <legend className={`${s.pregunta} foco`} tabIndex={-1}>
            Por último, ¿cómo te localizo?
          </legend>
          <p className={s.ayuda}>Te escribo yo, Héctor, con tu hoja de ruta.</p>

          <div className={s.campos}>
            <input name="nombre" type="text" required className={s.campo} placeholder="Tu nombre" autoComplete="name" aria-label="Tu nombre" />
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
            <input
              name="email"
              type="email"
              required
              defaultValue={email}
              className={s.campo}
              placeholder="El email con el que te apuntaste"
              aria-label="Email"
              autoComplete="email"
            />
            <input
              name="hotel"
              type="text"
              required
              className={s.campo}
              placeholder={NOMBRE_HOTEL[momento] ?? "Nombre del hotel"}
              aria-label="Nombre del hotel"
              autoComplete="organization"
            />
            <input
              name="ciudad"
              type="text"
              required
              className={s.campo}
              placeholder="Ciudad del hotel"
              aria-label="Ciudad del hotel"
              autoComplete="address-level2"
            />
          </div>

          <label className={s.permiso}>
            <input type="checkbox" name="whatsapp" value="si" />
            <span>Quiero que Héctor me escriba por WhatsApp con ayudas durante el programa.</span>
          </label>

          <div className={s.botones}>
            <button type="button" className={s.atras} onClick={() => setPaso(PREGUNTAS.length - 1)}>
              ← Atrás
            </button>
            <button type="submit" className={s.siguiente} disabled={enviando}>
              {enviando ? "Enviando…" : "Enviar"}
            </button>
          </div>
          <p className={s.legal}>
            Uso tus respuestas solo para preparar tu hoja de ruta. <a href="/privacidad">Privacidad</a>
          </p>
        </fieldset>
      </form>
    </div>
  );
}

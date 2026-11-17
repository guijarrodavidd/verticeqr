"use client";

import Link from "next/link";
import { useState } from "react";
import s from "./aula.module.css";
import { Bot, CheckPixel } from "./Bot";

// Las pestañas por semana de la landing, con el agente en 8 bits de cada
// semana (dormido si aún no toca) y el estado de cada día del alumno.

export type FilaPlanning = {
  slug: string;
  num: string;
  titulo: string;
  resumen: string;
  estado: "hecha" | "abierta" | "prep" | "cerrada";
  paraTi: boolean;
  toca: boolean;
};

export type SemanaPlanning = {
  id: string;
  pestana: string; // «Semana 1»
  titulo: string; // «Tu punto de partida»
  nivel: string;
  traje: string; // cómo va vestido el agente de la semana
  abierta: boolean;
  abreEl: string; // «viernes 20 de noviembre»
  noche?: boolean; // el día 21, en azul noche como en la landing
  filas: FilaPlanning[];
  // Lo que va antes de los días (la bienvenida y la auditoría en la semana 1).
  antes?: { slug: string; titulo: string; texto: string; estado: FilaPlanning["estado"]; toca: boolean }[];
  cierre?: { slug: string; estado: FilaPlanning["estado"]; texto: string };
};

export function Planning({ semanas, inicial }: { semanas: SemanaPlanning[]; inicial: string }) {
  const [activa, setActiva] = useState(inicial);
  const sem = semanas.find((x) => x.id === activa) ?? semanas[0];

  return (
    <div className={s.planning}>
      <div className={s.tabs} role="tablist" aria-label="Semanas del programa">
        {semanas.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={x.id === sem.id}
            className={`${x.noche && x.id !== sem.id ? s.tabNoche : ""} ${!x.abierta && x.id !== sem.id ? s.tabCerrada : ""}`}
            onClick={() => setActiva(x.id)}
          >
            <b>{x.pestana}</b>
            {x.titulo !== x.pestana && ` · ${x.titulo}`}
          </button>
        ))}
      </div>

      <div key={sem.id} className={`${s.semana} ${s.panel} ${sem.noche ? s.semanaNoche : ""}`} role="tabpanel">
        <div className={s.semanaCab}>
          <div className={s.semanaTexto}>
            <span className={s.pildora}>{sem.pestana}</span>
            <h3>{sem.titulo}</h3>
            <span className={s.nivel}>{sem.abierta ? sem.nivel : `Bloqueada · se abre el ${sem.abreEl}`}</span>
          </div>
          <Bot traje={sem.traje} estado={sem.abierta ? "despierto" : "duerme"} tam={124} oscuro={sem.noche} />
        </div>

        {sem.antes && (
          <div className={s.antes}>
            {sem.antes.map((a, i) => (
              <Link
                key={a.slug}
                href={`/programa/aula/${a.slug}`}
                className={`${s.cierre} ${s.aparece} ${a.toca ? s.cierreToca : ""}`}
                style={{ ["--d" as string]: i }}
              >
                <b>{a.titulo}</b>
                <span className={s.cierreEstado}>
                  {a.estado === "hecha" && <CheckPixel tam={16} />}
                  {a.toca ? "Te toca ahora" : a.estado === "hecha" ? "Hecha" : a.texto}
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className={s.filas}>
          {sem.filas.map((f, i) => {
            const clase = [
              s.d2,
              s.aparece,
              f.estado === "hecha" ? s.d2Hecha : "",
              f.estado === "cerrada" ? s.d2Cerrada : "",
              f.paraTi ? s.d2ParaTi : "",
              f.toca ? s.d2Toca : "",
            ].join(" ");
            const etiqueta = f.toca
              ? "Te toca ahora"
              : f.estado === "hecha"
                ? "Hecha"
                : f.paraTi
                  ? "Para ti, por tu auditoría"
                  : f.estado === "cerrada"
                    ? "Bloqueada"
                    : "";
            const dentro = (
              <>
                <span className={s.num}>{f.num}</span>
                <div>
                  <h4>{f.titulo}</h4>
                  {f.resumen && <p>{f.resumen}</p>}
                  {etiqueta && (
                    <span className={s.estado}>
                      {f.estado === "hecha" && <CheckPixel tam={14} />}
                      {f.estado === "cerrada" && <Candado />}
                      {etiqueta}
                    </span>
                  )}
                </div>
              </>
            );
            const estilo = { ["--d" as string]: i + 1 };
            return f.estado === "cerrada" ? (
              <div key={f.slug} className={clase} style={estilo}>
                {dentro}
              </div>
            ) : (
              <Link key={f.slug} href={`/programa/aula/${f.slug}`} className={clase} style={estilo}>
                {dentro}
              </Link>
            );
          })}
        </div>

        {sem.cierre &&
          (sem.cierre.estado === "cerrada" ? (
            <div className={`${s.cierre} ${s.d2Cerrada}`}>
              <b>Revisión de la semana</b>
              <span className={s.cierreEstado}>
                <Candado />
                Bloqueada
              </span>
            </div>
          ) : (
            <Link className={s.cierre} href={`/programa/aula/${sem.cierre.slug}`}>
              <b>Revisión de la semana</b>
              <span className={s.cierreEstado}>
                {sem.cierre.estado === "hecha" && <CheckPixel tam={16} />}
                {sem.cierre.estado === "hecha" ? "Hecha" : sem.cierre.texto}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}

// Un candado pequeño en píxeles, como los agentes.
function Candado() {
  return (
    <svg
      width="11"
      height="13"
      viewBox="0 0 11 13"
      aria-hidden="true"
      shapeRendering="crispEdges"
      style={{ marginRight: 6, verticalAlign: "-1px" }}
    >
      <path d="M3 1h5v1H3zM2 2h1v3H2zM8 2h1v3H8zM0 5h11v8H0z" fill="currentColor" />
      <path d="M5 8h1v2H5z" fill="#fff" />
    </svg>
  );
}

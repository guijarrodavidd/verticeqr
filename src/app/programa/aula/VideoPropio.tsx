"use client";

import { useRef } from "react";
import s from "./aula.module.css";

type Capitulo = { t: number; titulo: string };

// mm:ss a partir de segundos.
const minuto = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

// Vídeo propio (.mp4, .webm, .m3u8) con capítulos opcionales que saltan al segundo.
export function VideoPropio({ src, portada, titulo, capitulos }: { src: string; portada?: string; titulo: string; capitulos?: Capitulo[] }) {
  const ref = useRef<HTMLVideoElement>(null);

  const ir = (t: number) => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = t;
    void v.play().catch(() => {});
  };

  return (
    <>
      <div className={s.video}>
        <video ref={ref} src={src} poster={portada} title={titulo} controls playsInline preload="metadata" />
      </div>
      {capitulos && capitulos.length > 0 && (
        <ul className={s.capitulos} aria-label="Capítulos">
          {capitulos.map((c) => (
            <li key={c.t}>
              <button type="button" onClick={() => ir(c.t)}>
                <span>{minuto(c.t)}</span>
                {c.titulo}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

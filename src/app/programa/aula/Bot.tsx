import s from "./bot.module.css";

// El agente en 8 bits de «Los agentes del hotel» (curso-director-con-claude/
// oferta/agentes/bot.svg), vestido de lo que se habla en cada lección: el
// botones da la bienvenida, el de la lupa hace la radiografía, el de corbata
// lleva los informes, el del birrete se gradúa el día 21…
// estado: "despierto" flota y parpadea · "duerme" con los ojos cerrados y sus
// z · "celebra" salta y suelta chispas.

const R = (x: number, y: number, w = 1, h = 1) => `M${x} ${y}h${w}v${h}h-${w}z`;

const CUERPO = R(2, 0, 9, 2) + R(0, 2, 13, 2) + R(2, 4, 9, 1) + R(2, 6, 1, 2) + R(4, 6, 1, 2) + R(8, 6, 1, 2) + R(10, 6, 1, 2);
const BANDA = R(2, 5, 9, 1);
const OJOS = R(4, 2, 1, 2) + R(8, 2, 1, 2);
const OJOS_CERRADOS = R(4, 3) + R(8, 3);

const N = "#0B1220"; // azul noche
const B = "#FFFFFF";
const LIMA = "#A8D86A";
const AQUA = "#5EE6D8";
const TEAL = "#087F7B";
const GRIS = "#C9D3D6";

type Pieza = { c: string; d: string; luz?: boolean };

const TRAJES: Record<string, Pieza[]> = {
  // Bienvenida: el gorro de botones de hotel.
  botones: [
    { c: N, d: R(4, -2, 5, 2) },
    { c: LIMA, d: R(4, -1, 5, 1) },
    { c: AQUA, d: R(6, -3) },
  ],
  // Auditoría y revisiones: gafas y tablilla.
  auditor: [
    { c: N, d: R(3, 1, 3, 1) + R(7, 1, 3, 1) + R(3, 2, 1, 2) + R(5, 2, 1, 2) + R(7, 2, 1, 2) + R(9, 2, 1, 2) + R(6, 2) },
    { c: B, d: R(13, 1, 3, 5) },
    { c: N, d: R(14, 0, 1, 2) },
    { c: GRIS, d: R(13, 3, 3, 1) + R(13, 5, 2, 1) },
  ],
  // La radiografía: lupa.
  lupa: [
    { c: N, d: R(13, -3, 2, 1) + R(12, -2, 1, 2) + R(15, -2, 1, 2) + R(13, 0, 2, 1) + R(12, 1) },
    { c: "#D9FBF7", d: R(13, -2, 2, 2) },
  ],
  // Cómo pedirle las cosas: el bocadillo.
  habla: [
    { c: B, d: R(12, -5, 5, 3) + R(12, -2) },
    { c: N, d: R(13, -4) + R(15, -4) },
    { c: LIMA, d: R(14, -4) },
  ],
  // La ficha del hotel: la llave de la habitación con su llavero.
  llave: [
    { c: LIMA, d: R(11, -1, 2, 2) },
    { c: N, d: R(13, -1, 3, 1) + R(13, 0) + R(15, 0) + R(13, 1, 3, 1) + R(14, 2, 1, 3) + R(15, 3) },
  ],
  // Agentes y automático: antena con luz.
  antena: [
    { c: N, d: R(6, -2, 1, 2) },
    { c: AQUA, d: R(5, -4, 3, 2), luz: true },
  ],
  // Claude en el bolsillo: el móvil.
  movil: [
    { c: N, d: R(13, -1, 3, 5) },
    { c: AQUA, d: R(14, 0, 1, 3) },
  ],
  // Los turnos: gorra de encargado y el calendario.
  turnos: [
    { c: N, d: R(3, -2, 7, 1) + R(2, -1, 11, 1) },
    { c: LIMA, d: R(-4, 1, 4, 1) },
    { c: B, d: R(-4, 2, 4, 4) },
    { c: N, d: R(-3, 3) + R(-1, 3) + R(-3, 5) },
  ],
  // Los informes: corbata y el gráfico.
  informes: [
    { c: LIMA, d: R(6, 4) + R(5, 5, 3, 1) + R(6, 6) },
    { c: B, d: R(13, 0, 3, 5) },
    { c: TEAL, d: R(13, 3, 1, 2) + R(14, 2, 1, 3) },
    { c: LIMA, d: R(15, 1, 1, 4) },
  ],
  // El cierre y el presupuesto: calculadora.
  calculadora: [
    { c: N, d: R(13, 0, 4, 5) },
    { c: AQUA, d: R(14, 1, 2, 1) },
    { c: LIMA, d: R(14, 3) + R(15, 3) },
  ],
  // La tarea programada: el despertador.
  reloj: [
    { c: N, d: R(13, -1) + R(16, -1) + R(13, 0, 4, 4) },
    { c: B, d: R(14, 1, 2, 2) },
    { c: N, d: R(15, 1) },
  ],
  // Los recursos y la carpeta del equipo.
  carpeta: [
    { c: "#8DBF4F", d: R(13, 1, 2, 1) },
    { c: LIMA, d: R(13, 2, 4, 4) },
  ],
  // El día 21: birrete de graduado.
  graduado: [
    { c: N, d: R(1, -2, 11, 1) + R(4, -1, 5, 1) },
    { c: LIMA, d: R(11, -1, 1, 3) },
  ],
  // El equipo: cascos.
  equipo: [
    { c: N, d: R(2, -1, 9, 1) },
    { c: LIMA, d: R(1, 0, 2, 2) + R(10, 0, 2, 2) },
  ],
  // La biblioteca: un libro.
  libro: [
    { c: TEAL, d: R(-4, 1, 4, 5) },
    { c: LIMA, d: R(-4, 1, 1, 5) },
    { c: B, d: R(-2, 2, 1, 1) },
  ],
};

// El traje de cada lección; si no tiene, el de su semana.
export const TRAJE_LECCION: Record<string, string> = {
  bienvenida: "botones",
  auditoria: "auditor",
  "dia-01": "lupa",
  "dia-02": "habla",
  "dia-03": "llave",
  "dia-04": "antena",
  "dia-05": "movil",
  "dia-11": "informes",
  "dia-12": "auditor",
  "dia-13": "calculadora",
  "dia-14": "informes",
  "dia-15": "calculadora",
  "dia-16": "carpeta",
  "dia-17": "antena",
  "dia-18": "reloj",
  "dia-19": "auditor",
  "dia-20": "antena",
};

export const TRAJE_SEMANA: Record<string, string> = {
  inicio: "botones",
  "semana-1": "lupa",
  "semana-2": "turnos",
  "semana-3": "informes",
  "semana-4": "antena",
  final: "graduado",
  avanzado: "equipo",
  biblioteca: "libro",
};

export const trajeDe = (slug: string, modulo: string) =>
  TRAJE_LECCION[slug] ?? (slug.startsWith("documento-") ? "auditor" : (TRAJE_SEMANA[modulo] ?? "botones"));

export type EstadoBot = "despierto" | "duerme" | "celebra";

export function Bot({
  traje,
  estado = "despierto",
  tam = 96,
  retraso = 0,
  oscuro = false,
}: {
  traje?: string;
  estado?: EstadoBot;
  tam?: number; // ancho total, con el traje
  retraso?: number;
  oscuro?: boolean;
}) {
  const piezas = (traje && TRAJES[traje]) || [];
  return (
    <span
      className={`${s.bot} ${s[estado]} ${oscuro ? s.oscuro : ""}`}
      style={{ width: tam, ["--d" as string]: `${retraso}s` }}
      aria-hidden="true"
    >
      <svg className={s.cuerpo} viewBox="-4 -5 21 13" shapeRendering="crispEdges" width={tam} height={(tam * 13) / 21}>
        <path fill="#36C6C0" d={CUERPO} />
        <path fill="#1F9C94" d={BANDA} />
        <path className={s.ojos} fill="#1F1E1D" d={estado === "duerme" ? OJOS_CERRADOS : OJOS} />
        {piezas.map((p, i) => (
          // Sobre azul noche, lo que va en noche se pinta claro para que se vea.
          <path key={i} fill={oscuro && p.c === N ? "#E9EEF5" : p.c} d={p.d} className={p.luz ? s.luz : undefined} />
        ))}
      </svg>
      {estado === "duerme" && (
        <span className={s.zetas}>
          <i>z</i>
          <i>z</i>
        </span>
      )}
      {estado === "celebra" && (
        <span className={s.chispas}>
          {[-34, -18, 0, 18, 34].map((x, i) => (
            <i key={i} style={{ ["--tx" as string]: `${x}px`, ["--ty" as string]: `${-28 - (i % 2) * 14}px`, ["--i" as string]: i }} />
          ))}
        </span>
      )}
    </span>
  );
}

// El check en píxeles para las lecciones hechas.
export function CheckPixel({ tam = 22 }: { tam?: number }) {
  return (
    <svg viewBox="0 0 7 6" width={tam} height={(tam * 6) / 7} shapeRendering="crispEdges" aria-hidden="true">
      <path fill="#36C6C0" d="M6 0h1v1h-1zM5 1h1v1h-1zM4 2h1v1h-1zM0 2h1v1h-1zM1 3h1v1h-1zM3 3h1v1h-1zM2 4h1v1h-1z" />
    </svg>
  );
}

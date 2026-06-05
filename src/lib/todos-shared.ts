// Tipos y constantes COMPARTIDAS entre server y cliente. Sin imports de
// mysql2 / db / next/headers — para que el bundle del cliente no arrastre
// dependencias de servidor.

export type Prioridad = "urgente" | "media" | "leve";

export const PRIORIDADES: { value: Prioridad; label: string; color: string }[] = [
  { value: "urgente", label: "Urgente", color: "#f87171" },
  { value: "media", label: "Media", color: "#fbbf24" },
  { value: "leve", label: "Leve", color: "#4ade80" },
];

export function parsePrioridad(v: unknown): Prioridad {
  if (v === "urgente" || v === "media" || v === "leve") return v;
  return "media";
}

export type Tarea = {
  id: number;
  titulo: string;
  descripcion: string | null;
  fecha_limite: string | null;
  hecha: number;
  prioridad: Prioridad;
  creado_por: string | null;
  created_at: string;
  updated_at: string;
};

export type EstadoFiltro = "todas" | "pendientes" | "hechas";
export type PrioridadFiltro = "todas" | "urgente" | "media" | "leve";
export type FechaFiltro =
  | "todas"
  | "hoy"
  | "semana"
  | "vencidas"
  | "sin_fecha";

export type Filtros = {
  estado: EstadoFiltro;
  prioridad: PrioridadFiltro;
  fecha: FechaFiltro;
};

export function parseEstadoFiltro(v: unknown): EstadoFiltro {
  if (v === "pendientes" || v === "hechas") return v;
  return "todas";
}
export function parsePrioridadFiltro(v: unknown): PrioridadFiltro {
  if (v === "urgente" || v === "media" || v === "leve") return v;
  return "todas";
}
export function parseFechaFiltro(v: unknown): FechaFiltro {
  if (v === "hoy" || v === "semana" || v === "vencidas" || v === "sin_fecha")
    return v;
  return "todas";
}

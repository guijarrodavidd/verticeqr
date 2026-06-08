// Tipos y catálogos compartidos para leads / solicitudes de demo.
// Sin imports de mysql2 — usable desde server y cliente.

export type EstadoLead =
  | "nuevo"
  | "contactado"
  | "negociacion"
  | "cerrado"
  | "perdido";

export const ESTADOS_LEAD: {
  value: EstadoLead;
  label: string;
  color: string;
  descripcion: string;
}[] = [
  { value: "nuevo",        label: "Nuevo",        color: "#60a5fa", descripcion: "Solicitud sin contestar" },
  { value: "contactado",   label: "Contactado",   color: "#fbbf24", descripcion: "Le hemos escrito o llamado" },
  { value: "negociacion",  label: "En negociación", color: "#a78bfa", descripcion: "Hay conversación viva" },
  { value: "cerrado",      label: "Cerrado",      color: "#4ade80", descripcion: "Convertido en cliente" },
  { value: "perdido",      label: "Perdido",      color: "#9ca3af", descripcion: "No interesado / no encaja" },
];

export function estadoLeadInfo(v: EstadoLead) {
  return ESTADOS_LEAD.find((e) => e.value === v) ?? ESTADOS_LEAD[0];
}

export function parseEstadoLead(v: unknown): EstadoLead {
  const valid = ESTADOS_LEAD.map((e) => e.value);
  if (typeof v === "string" && (valid as string[]).includes(v)) return v as EstadoLead;
  return "nuevo";
}

export type EstadoLeadFiltro = "todos" | EstadoLead;
export function parseEstadoLeadFiltro(v: unknown): EstadoLeadFiltro {
  if (v === "todos") return "todos";
  return parseEstadoLead(v);
}

export type Lead = {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  empresa: string | null;
  sector: string | null;
  num_mesas: number | null;
  mensaje: string | null;
  origen: string;
  estado: EstadoLead;
  notas: string | null;
  created_at: string;
  updated_at: string;
};

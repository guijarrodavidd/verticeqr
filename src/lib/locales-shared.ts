// Tipos y catálogos compartidos entre server y cliente (sin imports de mysql2).

export type SectorLocal =
  | "lounge-club"
  | "cocteleria"
  | "pub"
  | "bar-restaurante"
  | "cafeteria"
  | "discoteca"
  | "cerveceria"
  | "hotel"
  | "otro";

export const SECTORES: { value: SectorLocal; label: string; icono: string; color: string }[] = [
  { value: "lounge-club", label: "Lounge Club", icono: "✦", color: "#a78bfa" },
  { value: "cocteleria", label: "Coctelería", icono: "◆", color: "#f472b6" },
  { value: "pub", label: "Pub", icono: "◐", color: "#fbbf24" },
  { value: "bar-restaurante", label: "Bar / Restaurante", icono: "▢", color: "#4ade80" },
  { value: "cafeteria", label: "Cafetería", icono: "◯", color: "#fb923c" },
  { value: "discoteca", label: "Discoteca", icono: "✧", color: "#ec4899" },
  { value: "cerveceria", label: "Cervecería", icono: "▤", color: "#facc15" },
  { value: "hotel", label: "Hotel", icono: "▥", color: "#60a5fa" },
  { value: "otro", label: "Otro", icono: "▦", color: "#9ca3af" },
];

export function parseSector(v: unknown): SectorLocal {
  if (typeof v !== "string") return "otro";
  return SECTORES.some((s) => s.value === v) ? (v as SectorLocal) : "otro";
}
export function sectorInfo(v: SectorLocal) {
  return SECTORES.find((s) => s.value === v) ?? SECTORES[SECTORES.length - 1];
}

export type PlanLocal = "trial" | "basic" | "pro" | "enterprise";
export const PLANES: { value: PlanLocal; label: string; color: string }[] = [
  { value: "trial", label: "Prueba", color: "#9ca3af" },
  { value: "basic", label: "Básico", color: "#60a5fa" },
  { value: "pro", label: "Profesional", color: "#a78bfa" },
  { value: "enterprise", label: "Enterprise", color: "#f59e0b" },
];
export function parsePlan(v: unknown): PlanLocal {
  if (v === "trial" || v === "basic" || v === "pro" || v === "enterprise") return v;
  return "basic";
}
export function planInfo(v: PlanLocal) {
  return PLANES.find((p) => p.value === v) ?? PLANES[1];
}

export type Local = {
  id: number;
  slug: string;
  nombre: string;
  sector: SectorLocal;
  email: string | null;
  telefono: string | null;
  plan: PlanLocal;
  activo: number; // 0 | 1
  color_primario: string | null;
  logo_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
};

// Slug a partir del nombre: minúsculas, sin tildes, espacios → guiones.
export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export type EstadoFiltroLocal = "todos" | "activos" | "inactivos";
export function parseEstadoFiltroLocal(v: unknown): EstadoFiltroLocal {
  if (v === "activos" || v === "inactivos") return v;
  return "todos";
}

export type SectorFiltro = SectorLocal | "todos";
export function parseSectorFiltro(v: unknown): SectorFiltro {
  if (v === "todos") return "todos";
  return parseSector(v);
}

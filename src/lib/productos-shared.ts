// Tipos y catálogos compartidos entre server y cliente para productos/categorías.

export type Producto = {
  id: number;
  local_id: number;
  categoria_id: number | null;
  nombre: string;
  descripcion: string | null;
  precio_cents: number;
  imagen_url: string | null;
  activo: number;
  destacado: number;
  orden: number;
  alergenos: string[] | null;
  iva_pct: number;
  stock: number | null;
  created_at: string;
  updated_at: string;
};

export type Categoria = {
  id: number;
  local_id: number;
  nombre: string;
  descripcion: string | null;
  orden: number;
  activa: number;
  created_at: string;
  updated_at: string;
};

// Lista de alérgenos según el Reglamento UE 1169/2011 (los 14 declarables).
export const ALERGENOS: { value: string; label: string; icono: string }[] = [
  { value: "gluten", label: "Gluten", icono: "🌾" },
  { value: "lactosa", label: "Lácteos", icono: "🥛" },
  { value: "huevo", label: "Huevo", icono: "🥚" },
  { value: "frutos-secos", label: "Frutos secos", icono: "🥜" },
  { value: "cacahuete", label: "Cacahuete", icono: "🥜" },
  { value: "soja", label: "Soja", icono: "🌱" },
  { value: "pescado", label: "Pescado", icono: "🐟" },
  { value: "marisco", label: "Marisco", icono: "🦐" },
  { value: "moluscos", label: "Moluscos", icono: "🐚" },
  { value: "apio", label: "Apio", icono: "🥬" },
  { value: "mostaza", label: "Mostaza", icono: "🌭" },
  { value: "sulfitos", label: "Sulfitos", icono: "🍷" },
  { value: "sesamo", label: "Sésamo", icono: "🫘" },
  { value: "altramuz", label: "Altramuces", icono: "🌰" },
];

export function alergenoInfo(value: string) {
  return ALERGENOS.find((a) => a.value === value);
}

// Cents <-> Euros formatting.
export function centsToEuros(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPrecio(cents: number): string {
  return centsToEuros(cents) + " €";
}

// Parse: "12,50" o "12.50" → 1250
export function eurosStringToCents(s: string): number | null {
  if (!s) return null;
  const norm = s.trim().replace(/€/g, "").replace(/\s/g, "").replace(",", ".");
  const n = Number(norm);
  if (!isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function centsToInputValue(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export function parseAlergenos(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v
      .filter((x): x is string => typeof x === "string")
      .filter((x) => ALERGENOS.some((a) => a.value === x));
  }
  return [];
}

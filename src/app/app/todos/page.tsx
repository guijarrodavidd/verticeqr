import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  listarTareas,
  crearTarea,
  toggleTarea,
  borrarTarea,
  actualizarTarea,
  parsePrioridad,
  parseEstadoFiltro,
  parsePrioridadFiltro,
  parseFechaFiltro,
  PRIORIDADES,
  type EstadoFiltro,
  type PrioridadFiltro,
  type FechaFiltro,
  type Filtros,
} from "@/lib/todos";
import TaskList from "./TaskList";

export const dynamic = "force-dynamic";

type SP = {
  estado?: string;
  prioridad?: string;
  fecha?: string;
  // backwards compat con el querystring antiguo
  filtro?: string;
};

function hrefFiltros(filtros: Filtros): string {
  const sp = new URLSearchParams();
  if (filtros.estado !== "todas") sp.set("estado", filtros.estado);
  if (filtros.prioridad !== "todas") sp.set("prioridad", filtros.prioridad);
  if (filtros.fecha !== "todas") sp.set("fecha", filtros.fecha);
  const qs = sp.toString();
  return qs ? `/app/todos?${qs}` : "/app/todos";
}

const ESTADOS: { value: EstadoFiltro; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "pendientes", label: "Pendientes" },
  { value: "hechas", label: "Hechas" },
];

const PRIORIDADES_FILTRO: { value: PrioridadFiltro; label: string; color?: string }[] = [
  { value: "todas", label: "Todas" },
  ...PRIORIDADES.map((p) => ({ value: p.value as PrioridadFiltro, label: p.label, color: p.color })),
];

const FECHAS: { value: FechaFiltro; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Esta semana" },
  { value: "vencidas", label: "Vencidas" },
  { value: "sin_fecha", label: "Sin fecha" },
];

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const user = (await getSession())!;
  const sp = await searchParams;
  const filtros: Filtros = {
    estado: parseEstadoFiltro(sp.estado ?? sp.filtro),
    prioridad: parsePrioridadFiltro(sp.prioridad),
    fecha: parseFechaFiltro(sp.fecha),
  };
  const tareas = await listarTareas(filtros);

  async function crear(formData: FormData) {
    "use server";
    const titulo = String(formData.get("titulo") ?? "").trim();
    if (!titulo) return;
    const descripcion = String(formData.get("descripcion") ?? "").trim() || undefined;
    const fechaInput = String(formData.get("fecha_limite") ?? "").trim();
    const fechaLimite = fechaInput ? fechaInput.replace("T", " ") + ":00" : null;
    const prioridad = parsePrioridad(formData.get("prioridad"));
    const session = await getSession();
    await crearTarea({
      titulo,
      descripcion,
      fechaLimite,
      prioridad,
      creadoPor: session?.email,
    });
    revalidatePath("/app/todos");
  }

  async function toggle(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await toggleTarea(id);
    revalidatePath("/app/todos");
  }

  async function borrar(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await borrarTarea(id);
    revalidatePath("/app/todos");
  }

  async function actualizar(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    const titulo = String(formData.get("titulo") ?? "").trim();
    const descripcionRaw = formData.get("descripcion");
    const fechaInput = String(formData.get("fecha_limite") ?? "").trim();
    const fechaLimite = fechaInput ? fechaInput.replace("T", " ") + ":00" : null;
    const prioridad = parsePrioridad(formData.get("prioridad"));
    await actualizarTarea(id, {
      titulo: titulo || undefined,
      descripcion: descripcionRaw === null ? undefined : String(descripcionRaw).trim() || null,
      fechaLimite,
      prioridad,
    });
    revalidatePath("/app/todos");
  }

  const empty = tareas.length === 0;
  const filtrosActivos =
    filtros.estado !== "todas" ||
    filtros.prioridad !== "todas" ||
    filtros.fecha !== "todas";

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ fontSize: "0.78rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
        Workspace
      </div>
      <h1 style={{ fontSize: "2rem", margin: "0 0 0.4rem", letterSpacing: "-0.02em" }}>
        Todo List
      </h1>
      <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>
        Tareas compartidas del equipo. {user.nombre}, lo que crees aquí lo ve todo el equipo.
      </p>

      {/* Formulario crear */}
      <div className="vqr-todo-card">
        <form action={crear} className="vqr-todo-form">
          <div className="vqr-todo-field">
            <label htmlFor="titulo">Tarea</label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              required
              placeholder="¿Qué hay que hacer?"
              autoComplete="off"
            />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="fecha_limite">Fecha límite (opcional)</label>
            <input id="fecha_limite" name="fecha_limite" type="datetime-local" />
          </div>
          <button type="submit" className="vqr-todo-add">
            Añadir
          </button>

          <div className="vqr-prio-row">
            <span className="vqr-prio-label">Prioridad</span>
            <div className="vqr-prio-segmented" role="radiogroup" aria-label="Prioridad">
              {PRIORIDADES.map((p, i) => (
                <label
                  key={p.value}
                  className={`vqr-prio-opt vqr-prio-opt-${p.value}`}
                  style={{ ["--prio-color" as string]: p.color }}
                >
                  <input
                    type="radio"
                    name="prioridad"
                    value={p.value}
                    defaultChecked={i === 1}
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Filtros */}
      <div className="vqr-filters-grid">
        <FilterGroup
          label="Estado"
          options={ESTADOS.map((o) => ({ value: o.value, label: o.label }))}
          current={filtros.estado}
          onSelect={(v) => hrefFiltros({ ...filtros, estado: v as EstadoFiltro })}
        />
        <FilterGroup
          label="Prioridad"
          options={PRIORIDADES_FILTRO.map((o) => ({ value: o.value, label: o.label, color: o.color }))}
          current={filtros.prioridad}
          onSelect={(v) => hrefFiltros({ ...filtros, prioridad: v as PrioridadFiltro })}
        />
        <FilterGroup
          label="Fecha"
          options={FECHAS.map((o) => ({ value: o.value, label: o.label }))}
          current={filtros.fecha}
          onSelect={(v) => hrefFiltros({ ...filtros, fecha: v as FechaFiltro })}
        />
        {filtrosActivos && (
          <Link href="/app/todos" className="vqr-filter-clear">
            Limpiar filtros
          </Link>
        )}
      </div>

      {empty ? (
        <div className="vqr-todo-empty">
          {filtrosActivos
            ? "Ninguna tarea coincide con esos filtros."
            : "Aún no hay tareas. Crea la primera arriba."}
        </div>
      ) : (
        <TaskList
          tareas={tareas}
          toggleAction={toggle}
          borrarAction={borrar}
          actualizarAction={actualizar}
        />
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  current,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string; color?: string }[];
  current: string;
  onSelect: (v: string) => string;
}) {
  return (
    <div className="vqr-filter-group">
      <div className="vqr-filter-label">{label}</div>
      <div className="vqr-filter-chips">
        {options.map((o) => {
          const active = o.value === current;
          return (
            <Link
              key={o.value}
              href={onSelect(o.value)}
              className={`vqr-filter-chip ${active ? "vqr-filter-chip-active" : ""}`}
              style={
                active && o.color
                  ? {
                      background: `${o.color}22`,
                      borderColor: `${o.color}66`,
                      color: o.color,
                    }
                  : o.color
                    ? {
                        // pequeño punto del color del filtro (cuando es de prioridad)
                      }
                    : undefined
              }
            >
              {o.color && (
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: o.color,
                    marginRight: 6,
                    verticalAlign: "middle",
                  }}
                />
              )}
              {o.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

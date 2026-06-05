import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  listarTareas,
  crearTarea,
  toggleTarea,
  borrarTarea,
  parsePrioridad,
  PRIORIDADES,
  type FiltroTareas,
  type Prioridad,
} from "@/lib/todos";

export const dynamic = "force-dynamic";

const FILTROS: { key: FiltroTareas; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "pendientes", label: "Pendientes" },
  { key: "hechas", label: "Hechas" },
];

function parseFiltro(v: string | undefined): FiltroTareas {
  if (v === "pendientes" || v === "hechas") return v;
  return "todas";
}

function formateaFecha(fecha: string | null): { label: string; vencida: boolean } | null {
  if (!fecha) return null;
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  const vencida = d.getTime() < now.getTime();
  const label = d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return { label, vencida };
}

function colorDePrioridad(p: Prioridad): string {
  return PRIORIDADES.find((x) => x.value === p)?.color ?? "#fbbf24";
}

function labelDePrioridad(p: Prioridad): string {
  return PRIORIDADES.find((x) => x.value === p)?.label ?? "Media";
}

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>;
}) {
  const user = (await getSession())!;
  const { filtro: filtroRaw } = await searchParams;
  const filtro = parseFiltro(filtroRaw);
  const tareas = await listarTareas(filtro);

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

          {/* Prioridad: segunda fila del form, span completo */}
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
      <div className="vqr-todo-filters">
        {FILTROS.map((f) => (
          <a
            key={f.key}
            href={f.key === "todas" ? "/app/todos" : `/app/todos?filtro=${f.key}`}
            className={`vqr-todo-filter ${filtro === f.key ? "vqr-todo-filter-active" : ""}`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {/* Lista */}
      {tareas.length === 0 ? (
        <div className="vqr-todo-empty">
          {filtro === "hechas"
            ? "No hay tareas completadas todavía."
            : filtro === "pendientes"
              ? "No hay tareas pendientes. 🎉"
              : "Aún no hay tareas. Crea la primera arriba."}
        </div>
      ) : (
        <div className="vqr-todo-list">
          {tareas.map((t) => {
            const fecha = formateaFecha(t.fecha_limite);
            const hecha = t.hecha === 1;
            const prio = parsePrioridad(t.prioridad);
            const prioColor = colorDePrioridad(prio);
            return (
              <div
                key={t.id}
                className={`vqr-todo-item ${hecha ? "vqr-todo-item-done" : ""}`}
                style={{
                  borderLeft: `3px solid ${prioColor}`,
                  paddingLeft: "calc(1rem - 3px)",
                }}
              >
                <form action={toggle} style={{ margin: 0 }}>
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className={`vqr-todo-check ${hecha ? "vqr-todo-check-done" : ""}`}
                    aria-label={hecha ? "Marcar como pendiente" : "Marcar como hecha"}
                  >
                    {hecha ? "✓" : ""}
                  </button>
                </form>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span
                      className="vqr-prio-badge"
                      style={{
                        color: prioColor,
                        background: `${prioColor}1f`,
                        borderColor: `${prioColor}55`,
                      }}
                    >
                      {labelDePrioridad(prio)}
                    </span>
                    <span className={`vqr-todo-titulo ${hecha ? "vqr-todo-titulo-done" : ""}`}>
                      {t.titulo}
                    </span>
                  </div>
                  {t.descripcion && <div className="vqr-todo-desc">{t.descripcion}</div>}
                  <div className="vqr-todo-meta">
                    {fecha && (
                      <span className={!hecha && fecha.vencida ? "vqr-todo-overdue" : ""}>
                        ⏱ {fecha.label}
                        {!hecha && fecha.vencida ? " · vencida" : ""}
                      </span>
                    )}
                    {t.creado_por && <span>👤 {t.creado_por}</span>}
                  </div>
                </div>
                <form action={borrar} style={{ margin: 0 }}>
                  <input type="hidden" name="id" value={t.id} />
                  <button type="submit" className="vqr-todo-delete" aria-label="Borrar tarea">
                    ✕
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

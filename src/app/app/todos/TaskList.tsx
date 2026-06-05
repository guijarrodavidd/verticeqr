"use client";

import { useEffect, useState, useTransition } from "react";
import { PRIORIDADES, type Prioridad, type Tarea } from "@/lib/todos-shared";

type ServerAction = (formData: FormData) => Promise<void>;

function colorDePrioridad(p: Prioridad): string {
  return PRIORIDADES.find((x) => x.value === p)?.color ?? "#fbbf24";
}
function labelDePrioridad(p: Prioridad): string {
  return PRIORIDADES.find((x) => x.value === p)?.label ?? "Media";
}

function formateaFecha(fecha: string | null): { label: string; vencida: boolean } | null {
  if (!fecha) return null;
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return null;
  const vencida = d.getTime() < Date.now();
  const label = d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return { label, vencida };
}

function formateaFechaLarga(fecha: string | null): string {
  if (!fecha) return "—";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fechaToInputValue(fecha: string | null): string {
  if (!fecha) return "";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TaskList({
  tareas,
  toggleAction,
  borrarAction,
  actualizarAction,
}: {
  tareas: Tarea[];
  toggleAction: ServerAction;
  borrarAction: ServerAction;
  actualizarAction: ServerAction;
}) {
  const [seleccionada, setSeleccionada] = useState<Tarea | null>(null);

  return (
    <>
      <div className="vqr-todo-list">
        {tareas.map((t) => {
          const fecha = formateaFecha(t.fecha_limite);
          const hecha = t.hecha === 1;
          const prioColor = colorDePrioridad(t.prioridad);
          return (
            <div
              key={t.id}
              role="button"
              tabIndex={0}
              className={`vqr-todo-item vqr-todo-item-clickable ${hecha ? "vqr-todo-item-done" : ""}`}
              style={{
                borderLeft: `3px solid ${prioColor}`,
                paddingLeft: "calc(1rem - 3px)",
              }}
              onClick={() => setSeleccionada(t)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSeleccionada(t);
                }
              }}
            >
              <form action={toggleAction} style={{ margin: 0 }} onClick={(e) => e.stopPropagation()}>
                <input type="hidden" name="id" value={t.id} />
                <button
                  type="submit"
                  className={`vqr-todo-check ${hecha ? "vqr-todo-check-done" : ""}`}
                  aria-label={hecha ? "Marcar como pendiente" : "Marcar como hecha"}
                  onClick={(e) => e.stopPropagation()}
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
                    {labelDePrioridad(t.prioridad)}
                  </span>
                  <span className={`vqr-todo-titulo ${hecha ? "vqr-todo-titulo-done" : ""}`}>
                    {t.titulo}
                  </span>
                </div>
                {t.descripcion && (
                  <div className="vqr-todo-desc" style={{
                    overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box",
                    WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const,
                  }}>
                    {t.descripcion}
                  </div>
                )}
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
              <form action={borrarAction} style={{ margin: 0 }} onClick={(e) => e.stopPropagation()}>
                <input type="hidden" name="id" value={t.id} />
                <button
                  type="submit"
                  className="vqr-todo-delete"
                  aria-label="Borrar tarea"
                  onClick={(e) => e.stopPropagation()}
                >
                  ✕
                </button>
              </form>
            </div>
          );
        })}
      </div>

      {seleccionada && (
        <TaskModal
          key={seleccionada.id}
          tarea={seleccionada}
          onClose={() => setSeleccionada(null)}
          actualizarAction={actualizarAction}
          toggleAction={toggleAction}
          borrarAction={borrarAction}
        />
      )}
    </>
  );
}

function TaskModal({
  tarea,
  onClose,
  actualizarAction,
  toggleAction,
  borrarAction,
}: {
  tarea: Tarea;
  onClose: () => void;
  actualizarAction: ServerAction;
  toggleAction: ServerAction;
  borrarAction: ServerAction;
}) {
  const [pending, startTransition] = useTransition();
  const [prio, setPrio] = useState<Prioridad>(tarea.prioridad);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const hecha = tarea.hecha === 1;
  const prioColor = colorDePrioridad(prio);
  const fechaInfo = formateaFecha(tarea.fecha_limite);

  async function handleSave(formData: FormData) {
    formData.append("id", String(tarea.id));
    formData.append("prioridad", prio);
    startTransition(async () => {
      await actualizarAction(formData);
      onClose();
    });
  }

  async function handleToggle() {
    const fd = new FormData();
    fd.append("id", String(tarea.id));
    startTransition(async () => {
      await toggleAction(fd);
      onClose();
    });
  }

  async function handleDelete() {
    const fd = new FormData();
    fd.append("id", String(tarea.id));
    startTransition(async () => {
      await borrarAction(fd);
      onClose();
    });
  }

  return (
    <>
      <div className="vqr-modal-backdrop" onClick={onClose} aria-hidden />
      <div
        className="vqr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vqr-modal-title"
        style={{ borderTop: `3px solid ${prioColor}` }}
      >
        <button
          type="button"
          className="vqr-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="vqr-modal-header">
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
          <h2 id="vqr-modal-title" className="vqr-modal-title">
            {tarea.titulo}
          </h2>
          <div className="vqr-modal-sub">
            {hecha ? "Tarea completada" : "Tarea pendiente"}
            {fechaInfo && (
              <> · <span className={!hecha && fechaInfo.vencida ? "vqr-todo-overdue" : ""}>
                vence el {fechaInfo.label}{!hecha && fechaInfo.vencida ? " (vencida)" : ""}
              </span></>
            )}
          </div>
        </div>

        <form action={handleSave} className="vqr-modal-form">
          <div className="vqr-todo-field">
            <label htmlFor="m-titulo">Título</label>
            <input
              id="m-titulo"
              name="titulo"
              type="text"
              defaultValue={tarea.titulo}
              required
            />
          </div>

          <div className="vqr-todo-field">
            <label htmlFor="m-desc">Descripción</label>
            <textarea
              id="m-desc"
              name="descripcion"
              rows={5}
              defaultValue={tarea.descripcion ?? ""}
              placeholder="Añade contexto, enlaces, criterios de aceptación…"
            />
          </div>

          <div className="vqr-todo-field">
            <label htmlFor="m-fecha">Fecha límite</label>
            <input
              id="m-fecha"
              name="fecha_limite"
              type="datetime-local"
              defaultValue={fechaToInputValue(tarea.fecha_limite)}
            />
          </div>

          <div className="vqr-todo-field">
            <label>Prioridad</label>
            <div className="vqr-prio-segmented" role="radiogroup" aria-label="Prioridad">
              {PRIORIDADES.map((p) => (
                <label
                  key={p.value}
                  className={`vqr-prio-opt vqr-prio-opt-${p.value}`}
                  style={{ ["--prio-color" as string]: p.color }}
                >
                  <input
                    type="radio"
                    name="prioridad-radio"
                    value={p.value}
                    checked={prio === p.value}
                    onChange={() => setPrio(p.value)}
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="vqr-modal-meta">
            <div>
              <span className="vqr-meta-label">Estado</span>
              <span style={{ color: hecha ? "#4ade80" : "#fbbf24" }}>
                ● {hecha ? "Hecha" : "Pendiente"}
              </span>
            </div>
            <div>
              <span className="vqr-meta-label">Autor</span>
              <span>{tarea.creado_por ?? "—"}</span>
            </div>
            <div>
              <span className="vqr-meta-label">Creada</span>
              <span>{formateaFechaLarga(tarea.created_at)}</span>
            </div>
            <div>
              <span className="vqr-meta-label">Última actualización</span>
              <span>{formateaFechaLarga(tarea.updated_at)}</span>
            </div>
          </div>

          <div className="vqr-modal-actions">
            <button
              type="button"
              className="vqr-modal-btn vqr-modal-btn-ghost"
              onClick={handleToggle}
              disabled={pending}
            >
              {hecha ? "Marcar pendiente" : "Marcar hecha"}
            </button>

            {!confirmDelete ? (
              <button
                type="button"
                className="vqr-modal-btn vqr-modal-btn-danger"
                onClick={() => setConfirmDelete(true)}
                disabled={pending}
              >
                Borrar
              </button>
            ) : (
              <button
                type="button"
                className="vqr-modal-btn vqr-modal-btn-danger-confirm"
                onClick={handleDelete}
                disabled={pending}
              >
                ¿Seguro? Borrar
              </button>
            )}

            <span style={{ flex: 1 }} />

            <button
              type="button"
              className="vqr-modal-btn vqr-modal-btn-ghost"
              onClick={onClose}
              disabled={pending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="vqr-modal-btn vqr-modal-btn-primary"
              disabled={pending}
            >
              {pending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

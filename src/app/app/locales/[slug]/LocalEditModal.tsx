"use client";

import { useEffect, useState, useTransition } from "react";
import {
  PLANES,
  SECTORES,
  sectorInfo,
  type Local,
  type PlanLocal,
  type SectorLocal,
} from "@/lib/locales-shared";

type ServerAction = (formData: FormData) => Promise<void>;

function formatFechaLarga(d: string): string {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LocalEditModal({
  local,
  actualizarAction,
  toggleAction,
  borrarAction,
}: {
  local: Local;
  actualizarAction: ServerAction;
  toggleAction: ServerAction;
  borrarAction: ServerAction;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [sector, setSector] = useState<SectorLocal>(local.sector);
  const [plan, setPlan] = useState<PlanLocal>(local.plan);
  const [color, setColor] = useState<string>(
    local.color_primario || sectorInfo(local.sector).color,
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleSave(formData: FormData) {
    formData.append("id", String(local.id));
    formData.set("sector", sector);
    formData.set("plan", plan);
    formData.set("color_primario", color);
    startTransition(async () => {
      await actualizarAction(formData);
      setOpen(false);
    });
  }

  async function handleToggle() {
    const fd = new FormData();
    fd.append("id", String(local.id));
    startTransition(async () => {
      await toggleAction(fd);
      setOpen(false);
    });
  }

  async function handleDelete() {
    const fd = new FormData();
    fd.append("id", String(local.id));
    startTransition(async () => {
      await borrarAction(fd);
    });
  }

  const activo = local.activo === 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="vqr-modal-btn vqr-modal-btn-ghost"
        style={{ flexShrink: 0 }}
      >
        Editar info
      </button>

      {open && (
        <>
          <div className="vqr-modal-backdrop" onClick={() => setOpen(false)} aria-hidden />
          <div
            className="vqr-modal"
            role="dialog"
            aria-modal="true"
            style={{ borderTop: `3px solid ${color}`, width: "min(720px, calc(100vw - 2rem))" }}
          >
            <button
              type="button"
              className="vqr-modal-close"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>

            <div className="vqr-modal-header">
              <h2 className="vqr-modal-title">Editar local</h2>
              <div className="vqr-modal-sub">Datos básicos del tenant</div>
            </div>

            <form action={handleSave} className="vqr-modal-form">
              <div className="vqr-loc-modal-grid">
                <div className="vqr-todo-field" style={{ gridColumn: "span 2" }}>
                  <label htmlFor="lm-nombre">Nombre</label>
                  <input id="lm-nombre" name="nombre" type="text" defaultValue={local.nombre} required />
                </div>

                <div className="vqr-todo-field">
                  <label htmlFor="lm-slug">Slug (URL)</label>
                  <input id="lm-slug" name="slug" type="text" defaultValue={local.slug} />
                </div>
                <div className="vqr-todo-field">
                  <label htmlFor="lm-tz">Zona horaria</label>
                  <input id="lm-tz" name="timezone" type="text" defaultValue={local.timezone} />
                </div>

                <div className="vqr-todo-field">
                  <label>Sector</label>
                  <select value={sector} onChange={(e) => setSector(e.target.value as SectorLocal)}>
                    {SECTORES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="vqr-todo-field">
                  <label>Plan</label>
                  <select value={plan} onChange={(e) => setPlan(e.target.value as PlanLocal)}>
                    {PLANES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div className="vqr-todo-field">
                  <label htmlFor="lm-email">Email contacto</label>
                  <input id="lm-email" name="email" type="email" defaultValue={local.email ?? ""} />
                </div>
                <div className="vqr-todo-field">
                  <label htmlFor="lm-tel">Teléfono</label>
                  <input id="lm-tel" name="telefono" type="tel" defaultValue={local.telefono ?? ""} />
                </div>

                <div className="vqr-todo-field">
                  <label htmlFor="lm-color">Color de marca</label>
                  <input
                    id="lm-color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
                <div className="vqr-todo-field">
                  <label htmlFor="lm-logo">URL del logo</label>
                  <input id="lm-logo" name="logo_url" type="url" defaultValue={local.logo_url ?? ""} placeholder="https://..." />
                </div>
              </div>

              <div className="vqr-modal-meta">
                <div>
                  <span className="vqr-meta-label">Estado</span>
                  <span style={{ color: activo ? "#4ade80" : "#9ca3af" }}>
                    ● {activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div>
                  <span className="vqr-meta-label">Creado</span>
                  <span>{formatFechaLarga(local.created_at)}</span>
                </div>
                <div>
                  <span className="vqr-meta-label">Última actualización</span>
                  <span>{formatFechaLarga(local.updated_at)}</span>
                </div>
              </div>

              <div className="vqr-modal-actions">
                <button
                  type="button"
                  className="vqr-modal-btn vqr-modal-btn-ghost"
                  onClick={handleToggle}
                  disabled={pending}
                >
                  {activo ? "Desactivar" : "Activar"}
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
                  onClick={() => setOpen(false)}
                  disabled={pending}
                >
                  Cancelar
                </button>
                <button type="submit" className="vqr-modal-btn vqr-modal-btn-primary" disabled={pending}>
                  {pending ? "Guardando…" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}

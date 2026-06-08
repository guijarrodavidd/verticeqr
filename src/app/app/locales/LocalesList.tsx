"use client";

import { useEffect, useState, useTransition } from "react";
import {
  PLANES,
  SECTORES,
  planInfo,
  sectorInfo,
  type Local,
  type PlanLocal,
  type SectorLocal,
} from "@/lib/locales-shared";

type ServerAction = (formData: FormData) => Promise<void>;

function formatFecha(d: string): string {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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

export default function LocalesList({
  locales,
  toggleAction,
  borrarAction,
  actualizarAction,
}: {
  locales: Local[];
  toggleAction: ServerAction;
  borrarAction: ServerAction;
  actualizarAction: ServerAction;
}) {
  const [seleccionado, setSeleccionado] = useState<Local | null>(null);

  return (
    <>
      <div className="vqr-loc-grid">
        {locales.map((l) => {
          const sector = sectorInfo(l.sector);
          const plan = planInfo(l.plan);
          const activo = l.activo === 1;
          const color = l.color_primario || sector.color;
          return (
            <div
              key={l.id}
              role="button"
              tabIndex={0}
              className={`vqr-loc-card ${!activo ? "vqr-loc-card-inactive" : ""}`}
              style={{ borderLeft: `4px solid ${color}` }}
              onClick={() => setSeleccionado(l)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSeleccionado(l);
                }
              }}
            >
              <div className="vqr-loc-card-head">
                <div
                  className="vqr-loc-avatar"
                  style={{ background: color, color: "#0a0a0f" }}
                >
                  {l.logo_url ? (
                    <img src={l.logo_url} alt="" />
                  ) : (
                    <span>{sector.icono}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="vqr-loc-nombre">{l.nombre}</div>
                  <div className="vqr-loc-slug">/{l.slug}</div>
                </div>
                <span
                  className="vqr-loc-status"
                  style={{ color: activo ? "#4ade80" : "#9ca3af" }}
                  title={activo ? "Activo" : "Inactivo"}
                >
                  ●
                </span>
              </div>

              <div className="vqr-loc-tags">
                <span
                  className="vqr-prio-badge"
                  style={{
                    color: sector.color,
                    background: `${sector.color}1f`,
                    borderColor: `${sector.color}55`,
                  }}
                >
                  {sector.label}
                </span>
                <span
                  className="vqr-prio-badge"
                  style={{
                    color: plan.color,
                    background: `${plan.color}1f`,
                    borderColor: `${plan.color}55`,
                  }}
                >
                  {plan.label}
                </span>
              </div>

              <div className="vqr-loc-meta">
                {l.email && <div>✉️ {l.email}</div>}
                {l.telefono && <div>📞 {l.telefono}</div>}
                <div style={{ color: "#6b7280" }}>Alta · {formatFecha(l.created_at)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {seleccionado && (
        <LocalModal
          key={seleccionado.id}
          local={seleccionado}
          onClose={() => setSeleccionado(null)}
          actualizarAction={actualizarAction}
          toggleAction={toggleAction}
          borrarAction={borrarAction}
        />
      )}
    </>
  );
}

function LocalModal({
  local,
  onClose,
  actualizarAction,
  toggleAction,
  borrarAction,
}: {
  local: Local;
  onClose: () => void;
  actualizarAction: ServerAction;
  toggleAction: ServerAction;
  borrarAction: ServerAction;
}) {
  const [pending, startTransition] = useTransition();
  const [sector, setSector] = useState<SectorLocal>(local.sector);
  const [plan, setPlan] = useState<PlanLocal>(local.plan);
  const [color, setColor] = useState<string>(local.color_primario || sectorInfo(local.sector).color);
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

  async function handleSave(formData: FormData) {
    formData.append("id", String(local.id));
    formData.set("sector", sector);
    formData.set("plan", plan);
    formData.set("color_primario", color);
    startTransition(async () => {
      await actualizarAction(formData);
      onClose();
    });
  }

  async function handleToggle() {
    const fd = new FormData();
    fd.append("id", String(local.id));
    startTransition(async () => {
      await toggleAction(fd);
      onClose();
    });
  }

  async function handleDelete() {
    const fd = new FormData();
    fd.append("id", String(local.id));
    startTransition(async () => {
      await borrarAction(fd);
      onClose();
    });
  }

  const activo = local.activo === 1;
  const sectorMeta = sectorInfo(sector);

  return (
    <>
      <div className="vqr-modal-backdrop" onClick={onClose} aria-hidden />
      <div
        className="vqr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vqr-loc-modal-title"
        style={{ borderTop: `3px solid ${color}`, width: "min(720px, calc(100vw - 2rem))" }}
      >
        <button type="button" className="vqr-modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className="vqr-modal-header">
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span
              className="vqr-prio-badge"
              style={{
                color: sectorMeta.color,
                background: `${sectorMeta.color}1f`,
                borderColor: `${sectorMeta.color}55`,
              }}
            >
              {sectorMeta.label}
            </span>
            <span
              className="vqr-prio-badge"
              style={{
                color: activo ? "#4ade80" : "#9ca3af",
                background: activo ? "#4ade801f" : "#9ca3af1f",
                borderColor: activo ? "#4ade8055" : "#9ca3af55",
              }}
            >
              {activo ? "Activo" : "Inactivo"}
            </span>
          </div>
          <h2 id="vqr-loc-modal-title" className="vqr-modal-title">
            {local.nombre}
          </h2>
          <div className="vqr-modal-sub">
            /{local.slug} · Alta {formatFechaLarga(local.created_at)}
          </div>
        </div>

        <form action={handleSave} className="vqr-modal-form">
          <div className="vqr-loc-modal-grid">
            <div className="vqr-todo-field" style={{ gridColumn: "span 2" }}>
              <label htmlFor="m-nombre">Nombre</label>
              <input id="m-nombre" name="nombre" type="text" defaultValue={local.nombre} required />
            </div>

            <div className="vqr-todo-field">
              <label htmlFor="m-slug">Slug (URL)</label>
              <input id="m-slug" name="slug" type="text" defaultValue={local.slug} />
            </div>
            <div className="vqr-todo-field">
              <label htmlFor="m-tz">Zona horaria</label>
              <input id="m-tz" name="timezone" type="text" defaultValue={local.timezone} />
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
              <label htmlFor="m-email">Email contacto</label>
              <input id="m-email" name="email" type="email" defaultValue={local.email ?? ""} />
            </div>
            <div className="vqr-todo-field">
              <label htmlFor="m-tel">Teléfono</label>
              <input id="m-tel" name="telefono" type="tel" defaultValue={local.telefono ?? ""} />
            </div>

            <div className="vqr-todo-field">
              <label htmlFor="m-color">Color de marca</label>
              <input
                id="m-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="vqr-todo-field">
              <label htmlFor="m-logo">URL del logo</label>
              <input id="m-logo" name="logo_url" type="url" defaultValue={local.logo_url ?? ""} placeholder="https://..." />
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

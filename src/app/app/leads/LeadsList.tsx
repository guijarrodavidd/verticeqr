"use client";

import { useEffect, useState, useTransition } from "react";
import {
  ESTADOS_LEAD,
  estadoLeadInfo,
  type EstadoLead,
  type Lead,
} from "@/lib/leads-shared";

type ServerAction = (formData: FormData) => Promise<void>;

function formatFechaCorta(d: string): string {
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

function tagOrigen(origen: string): { label: string; color: string } {
  if (origen.startsWith("demo:")) {
    return { label: "Demo " + origen.slice(5).replace(/-/g, " "), color: "#f472b6" };
  }
  return { label: origen || "landing", color: "#9ca3af" };
}

export default function LeadsList({
  leads,
  cambiarEstadoAction,
  guardarAction,
  borrarAction,
}: {
  leads: Lead[];
  cambiarEstadoAction: ServerAction;
  guardarAction: ServerAction;
  borrarAction: ServerAction;
}) {
  const [seleccionado, setSeleccionado] = useState<Lead | null>(null);

  return (
    <>
      <div className="vqr-leads-grid">
        {leads.map((l) => {
          const estado = estadoLeadInfo(l.estado);
          const origen = tagOrigen(l.origen);
          return (
            <div
              key={l.id}
              role="button"
              tabIndex={0}
              className="vqr-lead-card"
              style={{ borderLeft: `4px solid ${estado.color}` }}
              onClick={() => setSeleccionado(l)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSeleccionado(l);
                }
              }}
            >
              <div className="vqr-lead-card-head">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="vqr-lead-nombre">{l.nombre}</div>
                  <div className="vqr-lead-empresa">
                    {l.empresa ? l.empresa : <em style={{ color: "#6b7280" }}>sin empresa</em>}
                  </div>
                </div>
                <span
                  className="vqr-prio-badge"
                  style={{ color: estado.color, background: `${estado.color}1f`, borderColor: `${estado.color}55` }}
                >
                  {estado.label}
                </span>
              </div>

              <div className="vqr-lead-meta">
                <div>✉️ {l.email}</div>
                {l.telefono && <div>📞 {l.telefono}</div>}
                {l.num_mesas != null && <div>🪑 {l.num_mesas} mesas</div>}
              </div>

              <div className="vqr-lead-foot">
                <span style={{ color: origen.color, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                  {origen.label}
                </span>
                <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>
                  {formatFechaCorta(l.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {seleccionado && (
        <LeadModal
          key={seleccionado.id}
          lead={seleccionado}
          cambiarEstadoAction={cambiarEstadoAction}
          guardarAction={guardarAction}
          borrarAction={borrarAction}
          onClose={() => setSeleccionado(null)}
        />
      )}
    </>
  );
}

function LeadModal({
  lead,
  cambiarEstadoAction,
  guardarAction,
  borrarAction,
  onClose,
}: {
  lead: Lead;
  cambiarEstadoAction: ServerAction;
  guardarAction: ServerAction;
  borrarAction: ServerAction;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [estado, setEstado] = useState<EstadoLead>(lead.estado);
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

  async function handleGuardar(formData: FormData) {
    formData.append("id", String(lead.id));
    formData.set("estado", estado);
    startTransition(async () => {
      await guardarAction(formData);
      onClose();
    });
  }

  async function handleCambiarEstado(nuevo: EstadoLead) {
    setEstado(nuevo);
    const fd = new FormData();
    fd.append("id", String(lead.id));
    fd.append("estado", nuevo);
    startTransition(async () => {
      await cambiarEstadoAction(fd);
    });
  }

  async function handleDelete() {
    const fd = new FormData();
    fd.append("id", String(lead.id));
    startTransition(async () => {
      await borrarAction(fd);
      onClose();
    });
  }

  const estadoActual = estadoLeadInfo(estado);
  const origen = tagOrigen(lead.origen);

  return (
    <>
      <div className="vqr-modal-backdrop" onClick={onClose} aria-hidden />
      <div
        className="vqr-modal"
        role="dialog"
        aria-modal="true"
        style={{ borderTop: `3px solid ${estadoActual.color}`, width: "min(720px, calc(100vw - 2rem))" }}
      >
        <button type="button" className="vqr-modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className="vqr-modal-header">
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            <span
              className="vqr-prio-badge"
              style={{ color: estadoActual.color, background: `${estadoActual.color}1f`, borderColor: `${estadoActual.color}55` }}
            >
              {estadoActual.label}
            </span>
            <span
              className="vqr-prio-badge"
              style={{ color: origen.color, background: `${origen.color}1f`, borderColor: `${origen.color}55` }}
            >
              {origen.label}
            </span>
          </div>
          <h2 className="vqr-modal-title">{lead.nombre}</h2>
          <div className="vqr-modal-sub">
            {lead.empresa ?? "Sin empresa"} · {formatFechaLarga(lead.created_at)}
          </div>
        </div>

        {/* Pipeline de estados como pills clickables */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: "0.5rem", fontWeight: 500 }}>
            Mover a:
          </div>
          <div className="vqr-lead-states">
            {ESTADOS_LEAD.map((e) => {
              const active = e.value === estado;
              return (
                <button
                  key={e.value}
                  type="button"
                  className="vqr-lead-state"
                  style={{
                    background: active ? `${e.color}22` : "transparent",
                    borderColor: active ? `${e.color}66` : "#2a2a3a",
                    color: active ? e.color : "#9ca3af",
                    fontWeight: active ? 600 : 500,
                  }}
                  onClick={() => handleCambiarEstado(e.value)}
                  disabled={pending}
                  title={e.descripcion}
                >
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: e.color, display: "inline-block", marginRight: 6, verticalAlign: "middle" }} />
                  {e.label}
                </button>
              );
            })}
          </div>
        </div>

        <form action={handleGuardar} className="vqr-modal-form">
          <div className="vqr-lead-info-grid">
            <div>
              <span className="vqr-meta-label">Email</span>
              <a href={`mailto:${lead.email}`} style={{ color: "#a78bfa", textDecoration: "none" }}>
                {lead.email}
              </a>
            </div>
            {lead.telefono && (
              <div>
                <span className="vqr-meta-label">Teléfono</span>
                <a href={`tel:${lead.telefono}`} style={{ color: "#cdcdd9", textDecoration: "none" }}>
                  {lead.telefono}
                </a>
              </div>
            )}
            {lead.sector && (
              <div>
                <span className="vqr-meta-label">Sector</span>
                <span>{lead.sector.replace(/-/g, " ")}</span>
              </div>
            )}
            {lead.num_mesas != null && (
              <div>
                <span className="vqr-meta-label">Mesas aprox.</span>
                <span>{lead.num_mesas}</span>
              </div>
            )}
          </div>

          {lead.mensaje && (
            <div className="vqr-lead-mensaje">
              <div className="vqr-meta-label" style={{ marginBottom: "0.4rem" }}>Mensaje</div>
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{lead.mensaje}</div>
            </div>
          )}

          <div className="vqr-todo-field">
            <label htmlFor="lm-notas">Notas internas</label>
            <textarea
              id="lm-notas"
              name="notas"
              rows={4}
              defaultValue={lead.notas ?? ""}
              placeholder="Qué hablamos, próximo paso, objeciones, dudas…"
            />
          </div>

          <div className="vqr-modal-meta">
            <div>
              <span className="vqr-meta-label">Estado actual</span>
              <span style={{ color: estadoActual.color }}>● {estadoActual.label}</span>
            </div>
            <div>
              <span className="vqr-meta-label">Recibido</span>
              <span>{formatFechaLarga(lead.created_at)}</span>
            </div>
            <div>
              <span className="vqr-meta-label">Última actualización</span>
              <span>{formatFechaLarga(lead.updated_at)}</span>
            </div>
          </div>

          <div className="vqr-modal-actions">
            <a
              href={`mailto:${lead.email}?subject=Solicitud%20de%20demo%20VerticeQR`}
              className="vqr-modal-btn vqr-modal-btn-ghost"
              style={{ textDecoration: "none" }}
            >
              ✉ Responder por email
            </a>

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

            <button type="button" className="vqr-modal-btn vqr-modal-btn-ghost" onClick={onClose} disabled={pending}>
              Cancelar
            </button>
            <button type="submit" className="vqr-modal-btn vqr-modal-btn-primary" disabled={pending}>
              {pending ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

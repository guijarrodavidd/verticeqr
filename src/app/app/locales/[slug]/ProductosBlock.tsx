"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  ALERGENOS,
  alergenoInfo,
  centsToInputValue,
  formatPrecio,
  type Categoria,
  type Producto,
} from "@/lib/productos-shared";

type ServerAction = (formData: FormData) => Promise<void>;

export default function ProductosBlock({
  categorias,
  productos,
  crearAction,
  actualizarAction,
  toggleActivoAction,
  toggleDestacadoAction,
  borrarAction,
}: {
  categorias: Categoria[];
  productos: Producto[];
  crearAction: ServerAction;
  actualizarAction: ServerAction;
  toggleActivoAction: ServerAction;
  toggleDestacadoAction: ServerAction;
  borrarAction: ServerAction;
}) {
  const [editing, setEditing] = useState<Producto | null>(null);
  const [filtroCat, setFiltroCat] = useState<number | "todas">("todas");
  const [pending, startTransition] = useTransition();

  const filtrados = useMemo(() => {
    if (filtroCat === "todas") return productos;
    return productos.filter((p) => p.categoria_id === filtroCat);
  }, [productos, filtroCat]);

  function nombreCategoria(id: number | null): string {
    if (id == null) return "Sin categoría";
    return categorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";
  }

  async function toggleActivo(id: number) {
    const fd = new FormData();
    fd.append("id", String(id));
    startTransition(() => toggleActivoAction(fd));
  }
  async function toggleDestacado(id: number) {
    const fd = new FormData();
    fd.append("id", String(id));
    startTransition(() => toggleDestacadoAction(fd));
  }

  return (
    <>
      {/* Form de alta */}
      <details className="vqr-todo-card vqr-prod-create" open>
        <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: "0.75rem", listStyle: "none" }}>
          <span style={{ color: "#a78bfa" }}>+</span> Nuevo producto
        </summary>
        <form action={crearAction} className="vqr-prod-form">
          <div className="vqr-todo-field" style={{ gridColumn: "span 2" }}>
            <label htmlFor="p-nombre">Nombre</label>
            <input id="p-nombre" name="nombre" type="text" required placeholder="Hamburguesa de la casa" autoComplete="off" />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="p-precio">Precio (€)</label>
            <input id="p-precio" name="precio" type="text" required placeholder="9,50" inputMode="decimal" />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="p-cat">Categoría</label>
            <select id="p-cat" name="categoria_id" defaultValue="">
              <option value="">Sin categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="vqr-todo-field" style={{ gridColumn: "span 4" }}>
            <label htmlFor="p-desc">Descripción</label>
            <textarea id="p-desc" name="descripcion" rows={2} placeholder="Carne 100% de vaca, lechuga, tomate, salsa de la casa…" />
          </div>

          <div className="vqr-todo-field" style={{ gridColumn: "span 3" }}>
            <label htmlFor="p-img">URL de imagen</label>
            <input id="p-img" name="imagen_url" type="url" placeholder="https://images.unsplash.com/…" />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="p-iva">IVA (%)</label>
            <input id="p-iva" name="iva_pct" type="number" min="0" max="100" step="0.5" defaultValue="10" />
          </div>

          <div className="vqr-todo-field" style={{ gridColumn: "span 4" }}>
            <label>Alérgenos</label>
            <div className="vqr-alergenos-grid">
              {ALERGENOS.map((a) => (
                <label key={a.value} className="vqr-alergeno-pill">
                  <input type="checkbox" name={`alergeno-${a.value}`} />
                  <span>{a.icono} {a.label}</span>
                </label>
              ))}
            </div>
          </div>

          <label
            className="vqr-todo-field"
            style={{ gridColumn: "span 2", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}
          >
            <input type="checkbox" name="destacado" />
            <span style={{ fontSize: "0.88rem" }}>Marcar como destacado en la carta</span>
          </label>
          <div style={{ display: "flex", alignItems: "end", gridColumn: "span 2" }}>
            <button type="submit" className="vqr-todo-add" style={{ width: "100%" }}>
              Crear producto
            </button>
          </div>
        </form>
      </details>

      {/* Filtros por categoría */}
      <div className="vqr-prod-cat-filters">
        <button
          type="button"
          className={`vqr-filter-chip ${filtroCat === "todas" ? "vqr-filter-chip-active" : ""}`}
          onClick={() => setFiltroCat("todas")}
        >
          Todas ({productos.length})
        </button>
        {categorias.map((c) => {
          const count = productos.filter((p) => p.categoria_id === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              className={`vqr-filter-chip ${filtroCat === c.id ? "vqr-filter-chip-active" : ""}`}
              onClick={() => setFiltroCat(c.id)}
            >
              {c.nombre} ({count})
            </button>
          );
        })}
        {productos.some((p) => p.categoria_id == null) && (
          <button
            type="button"
            className={`vqr-filter-chip ${filtroCat === -1 ? "vqr-filter-chip-active" : ""}`}
            onClick={() => setFiltroCat(-1 as never)}
          >
            Sin categoría ({productos.filter((p) => p.categoria_id == null).length})
          </button>
        )}
      </div>

      {/* Grid */}
      {filtrados.length === 0 ? (
        <div className="vqr-todo-empty">
          {productos.length === 0
            ? "Aún no hay productos. Crea el primero arriba."
            : "Ningún producto en esa categoría."}
        </div>
      ) : (
        <div className="vqr-prod-grid">
          {filtrados.map((p) => {
            const activo = p.activo === 1;
            const destacado = p.destacado === 1;
            return (
              <div
                key={p.id}
                className={`vqr-prod-card ${!activo ? "vqr-prod-card-inactive" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => setEditing(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setEditing(p);
                  }
                }}
              >
                <div className="vqr-prod-img">
                  {p.imagen_url ? (
                    <img src={p.imagen_url} alt={p.nombre} loading="lazy" />
                  ) : (
                    <span className="vqr-prod-img-placeholder">🍽</span>
                  )}
                  {destacado && (
                    <span className="vqr-prod-star" title="Destacado">★</span>
                  )}
                </div>
                <div className="vqr-prod-body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
                    <div className="vqr-prod-nombre">{p.nombre}</div>
                    <div className="vqr-prod-precio">{formatPrecio(p.precio_cents)}</div>
                  </div>
                  {p.descripcion && (
                    <div className="vqr-prod-desc">{p.descripcion}</div>
                  )}
                  <div className="vqr-prod-foot">
                    <span style={{ color: "#6b7280" }}>{nombreCategoria(p.categoria_id)}</span>
                    {p.alergenos && p.alergenos.length > 0 && (
                      <span className="vqr-prod-aler">
                        {p.alergenos.slice(0, 4).map((a) => alergenoInfo(a)?.icono).join(" ")}
                        {p.alergenos.length > 4 ? " …" : ""}
                      </span>
                    )}
                  </div>
                </div>
                <div className="vqr-prod-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={`vqr-prod-quick ${destacado ? "vqr-prod-quick-on" : ""}`}
                    onClick={() => toggleDestacado(p.id)}
                    disabled={pending}
                    aria-label="Destacar"
                    title="Destacado"
                  >
                    ★
                  </button>
                  <button
                    type="button"
                    className={`vqr-prod-quick ${activo ? "vqr-prod-quick-on" : ""}`}
                    onClick={() => toggleActivo(p.id)}
                    disabled={pending}
                    aria-label={activo ? "Desactivar" : "Activar"}
                    title={activo ? "Activo" : "Inactivo"}
                  >
                    {activo ? "●" : "○"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <ProductoModal
          key={editing.id}
          producto={editing}
          categorias={categorias}
          actualizarAction={actualizarAction}
          toggleActivoAction={toggleActivoAction}
          toggleDestacadoAction={toggleDestacadoAction}
          borrarAction={borrarAction}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

function ProductoModal({
  producto,
  categorias,
  actualizarAction,
  toggleActivoAction,
  toggleDestacadoAction,
  borrarAction,
  onClose,
}: {
  producto: Producto;
  categorias: Categoria[];
  actualizarAction: ServerAction;
  toggleActivoAction: ServerAction;
  toggleDestacadoAction: ServerAction;
  borrarAction: ServerAction;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [imgUrl, setImgUrl] = useState(producto.imagen_url ?? "");
  const [alergenos, setAlergenos] = useState<Set<string>>(
    new Set(producto.alergenos ?? []),
  );
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

  function toggleAler(value: string) {
    setAlergenos((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  async function handleSave(formData: FormData) {
    formData.append("id", String(producto.id));
    // Sincronizamos alérgenos seleccionados con los checkboxes (que están
    // controlados via state — el formData no los recoge bien si son controlled).
    for (const a of ALERGENOS) {
      formData.delete(`alergeno-${a.value}`);
      if (alergenos.has(a.value)) formData.set(`alergeno-${a.value}`, "on");
    }
    startTransition(async () => {
      await actualizarAction(formData);
      onClose();
    });
  }

  async function handleToggleActivo() {
    const fd = new FormData();
    fd.append("id", String(producto.id));
    startTransition(async () => {
      await toggleActivoAction(fd);
      onClose();
    });
  }

  async function handleToggleDestacado() {
    const fd = new FormData();
    fd.append("id", String(producto.id));
    startTransition(async () => {
      await toggleDestacadoAction(fd);
      onClose();
    });
  }

  async function handleDelete() {
    const fd = new FormData();
    fd.append("id", String(producto.id));
    startTransition(async () => {
      await borrarAction(fd);
      onClose();
    });
  }

  const activo = producto.activo === 1;
  const destacado = producto.destacado === 1;

  return (
    <>
      <div className="vqr-modal-backdrop" onClick={onClose} aria-hidden />
      <div
        className="vqr-modal"
        role="dialog"
        aria-modal="true"
        style={{ width: "min(820px, calc(100vw - 2rem))" }}
      >
        <button type="button" className="vqr-modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className="vqr-modal-header">
          <h2 className="vqr-modal-title">{producto.nombre}</h2>
          <div className="vqr-modal-sub">
            {formatPrecio(producto.precio_cents)} · {activo ? "Activo" : "Inactivo"}
            {destacado ? " · Destacado" : ""}
          </div>
        </div>

        <form action={handleSave} className="vqr-modal-form">
          <div className="vqr-prod-modal-grid">
            <div className="vqr-prod-modal-preview">
              {imgUrl ? (
                <img src={imgUrl} alt="" />
              ) : (
                <span style={{ fontSize: "3rem", color: "#4b5563" }}>🍽</span>
              )}
            </div>

            <div className="vqr-prod-modal-fields">
              <div className="vqr-todo-field">
                <label htmlFor="pm-nombre">Nombre</label>
                <input id="pm-nombre" name="nombre" type="text" defaultValue={producto.nombre} required />
              </div>
              <div className="vqr-todo-field">
                <label htmlFor="pm-precio">Precio (€)</label>
                <input id="pm-precio" name="precio" type="text" defaultValue={centsToInputValue(producto.precio_cents)} required inputMode="decimal" />
              </div>
              <div className="vqr-todo-field">
                <label htmlFor="pm-cat">Categoría</label>
                <select id="pm-cat" name="categoria_id" defaultValue={producto.categoria_id ?? ""}>
                  <option value="">Sin categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="vqr-todo-field">
                <label htmlFor="pm-iva">IVA (%)</label>
                <input id="pm-iva" name="iva_pct" type="number" min="0" max="100" step="0.5" defaultValue={producto.iva_pct} />
              </div>
              <div className="vqr-todo-field" style={{ gridColumn: "span 2" }}>
                <label htmlFor="pm-img">URL de imagen</label>
                <input
                  id="pm-img"
                  name="imagen_url"
                  type="url"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/…"
                />
                <small style={{ color: "#6b7280", marginTop: "0.25rem" }}>
                  Pega la URL pública. (Subida de archivo, próximamente.)
                </small>
              </div>
            </div>
          </div>

          <div className="vqr-todo-field">
            <label htmlFor="pm-desc">Descripción</label>
            <textarea
              id="pm-desc"
              name="descripcion"
              rows={3}
              defaultValue={producto.descripcion ?? ""}
              placeholder="Ingredientes, peso, info útil para el cliente…"
            />
          </div>

          <div className="vqr-todo-field">
            <label>Alérgenos</label>
            <div className="vqr-alergenos-grid">
              {ALERGENOS.map((a) => {
                const on = alergenos.has(a.value);
                return (
                  <button
                    type="button"
                    key={a.value}
                    className={`vqr-alergeno-pill ${on ? "vqr-alergeno-pill-on" : ""}`}
                    onClick={() => toggleAler(a.value)}
                  >
                    {a.icono} {a.label}
                  </button>
                );
              })}
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
              <span className="vqr-meta-label">Destacado</span>
              <span style={{ color: destacado ? "#fbbf24" : "#9ca3af" }}>
                {destacado ? "★ Sí" : "— No"}
              </span>
            </div>
          </div>

          <div className="vqr-modal-actions">
            <button
              type="button"
              className="vqr-modal-btn vqr-modal-btn-ghost"
              onClick={handleToggleActivo}
              disabled={pending}
            >
              {activo ? "Desactivar" : "Activar"}
            </button>
            <button
              type="button"
              className="vqr-modal-btn vqr-modal-btn-ghost"
              onClick={handleToggleDestacado}
              disabled={pending}
            >
              {destacado ? "Quitar destacado" : "Destacar"}
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
            <button type="submit" className="vqr-modal-btn vqr-modal-btn-primary" disabled={pending}>
              {pending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

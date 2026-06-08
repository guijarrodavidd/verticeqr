import Link from "next/link";
import { getSession } from "@/lib/auth";
import { listarLocales, sectorInfo } from "@/lib/locales";
import { listarCategorias, listarProductos } from "@/lib/productos";
import type { Local } from "@/lib/locales-shared";
import Tpv, { type MenuCat } from "./Tpv";
import "./tpv.css";

export const dynamic = "force-dynamic";

export default async function TpvPage({
  searchParams,
}: {
  searchParams: Promise<{ local?: string }>;
}) {
  await getSession();
  const sp = await searchParams;

  const locales = await listarLocales({ estado: "activos", sector: "todos" });
  const slugSel = sp.local && locales.some((l) => l.slug === sp.local) ? sp.local : "";
  const local: Local | undefined = locales.find((l) => l.slug === slugSel);

  let menu: MenuCat[] = [];
  if (local) {
    const [cats, prods] = await Promise.all([
      listarCategorias(local.id),
      listarProductos(local.id),
    ]);
    const activos = prods.filter((p) => p.activo);
    menu = cats
      .map((c) => ({
        cat: c.nombre,
        items: activos
          .filter((p) => p.categoria_id === c.id)
          .map((p) => ({ id: p.id, name: p.nombre, cents: p.precio_cents })),
      }))
      .filter((g) => g.items.length > 0);
    // Productos sin categoría asignada.
    const sueltos = activos.filter((p) => p.categoria_id == null);
    if (sueltos.length) {
      menu.push({
        cat: "Otros",
        items: sueltos.map((p) => ({ id: p.id, name: p.nombre, cents: p.precio_cents })),
      });
    }
  }

  const accent = local
    ? local.color_primario || sectorInfo(local.sector).color
    : "#34d399";

  return (
    <div style={{ maxWidth: 1280 }}>
      <div
        style={{
          fontSize: "0.78rem",
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "0.5rem",
        }}
      >
        Operativa de sala
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0, letterSpacing: "-0.02em" }}>TPV Sala</h1>
      </div>
      <p style={{ color: "#9ca3af", marginTop: "0.4rem", marginBottom: "1.6rem" }}>
        Mesas, ticket por mesa y cobro. Pensado también para quien{" "}
        <strong style={{ color: "#d1d5db" }}>no escanea el QR</strong>: el camarero añade
        productos a mano desde la carta del local.
      </p>

      {/* Selector de local */}
      <form method="get" action="/app/tpv" className="vqr-qr-form vqr-no-print">
        <div className="vqr-todo-field" style={{ minWidth: 260 }}>
          <label htmlFor="tpv-local">¿De qué local es la sala?</label>
          {locales.length === 0 ? (
            <div
              style={{
                padding: "0.7rem 0.9rem",
                border: "1px solid #2a2a3a",
                borderRadius: 9,
                background: "#15151f",
                color: "#9ca3af",
              }}
            >
              No hay locales activos.{" "}
              <Link href="/app/locales" style={{ color: "#a78bfa" }}>
                Crea uno →
              </Link>
            </div>
          ) : (
            <select id="tpv-local" name="local" defaultValue={slugSel} required>
              <option value="">— Elige un local —</option>
              {locales.map((l) => {
                const s = sectorInfo(l.sector);
                return (
                  <option key={l.id} value={l.slug}>
                    {l.nombre} · {s.label}
                  </option>
                );
              })}
            </select>
          )}
        </div>
        <button type="submit" className="vqr-todo-add" style={{ alignSelf: "end" }}>
          Abrir sala →
        </button>
      </form>

      {!local && (
        <div className="vqr-todo-empty" style={{ marginTop: "1.5rem" }}>
          Elige un local para abrir su sala.
        </div>
      )}

      {local && menu.length === 0 && (
        <div className="vqr-todo-empty" style={{ marginTop: "1.5rem" }}>
          <strong>{local.nombre}</strong> no tiene productos activos todavía.{" "}
          <Link href={`/app/locales/${local.slug}`} style={{ color: "#a78bfa" }}>
            Añade su carta →
          </Link>
        </div>
      )}

      {local && menu.length > 0 && (
        <Tpv
          localSlug={local.slug}
          localNombre={local.nombre}
          accent={accent}
          menu={menu}
        />
      )}
    </div>
  );
}

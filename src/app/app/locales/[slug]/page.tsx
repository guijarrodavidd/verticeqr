import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  obtenerLocalPorSlug,
  actualizarLocal,
  toggleActivo,
  borrarLocal,
  parsePlan,
  parseSector,
  sectorInfo,
  planInfo,
  PLANES,
  SECTORES,
} from "@/lib/locales";
import {
  listarCategorias,
  crearCategoria,
  borrarCategoria,
  listarProductos,
  crearProducto,
  actualizarProducto,
  borrarProducto,
  toggleActivoProducto,
  toggleDestacadoProducto,
  eurosStringToCents,
  ALERGENOS,
} from "@/lib/productos";
import ProductosBlock from "./ProductosBlock";
import LocalEditModal from "./LocalEditModal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const local = await obtenerLocalPorSlug(slug);
  return {
    title: local ? `${local.nombre} — VerticeQR` : "Local no encontrado",
  };
}

export default async function LocalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await getSession(); // garantiza que el layout ya redirige si no hay sesión.
  const { slug } = await params;
  const local = await obtenerLocalPorSlug(slug);
  if (!local) notFound();

  const [categorias, productos] = await Promise.all([
    listarCategorias(local.id),
    listarProductos(local.id),
  ]);

  const sector = sectorInfo(local.sector);
  const plan = planInfo(local.plan);
  const activo = local.activo === 1;
  const color = local.color_primario || sector.color;

  async function actualizarBasicos(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    const nombre = String(formData.get("nombre") ?? "").trim();
    const slugRaw = String(formData.get("slug") ?? "").trim();
    const sector = parseSector(formData.get("sector"));
    const plan = parsePlan(formData.get("plan"));
    const email = String(formData.get("email") ?? "").trim();
    const telefono = String(formData.get("telefono") ?? "").trim();
    const color_primario = String(formData.get("color_primario") ?? "").trim();
    const logo_url = String(formData.get("logo_url") ?? "").trim();
    const timezone = String(formData.get("timezone") ?? "").trim();
    await actualizarLocal(id, {
      nombre: nombre || undefined,
      slug: slugRaw || undefined,
      sector,
      plan,
      email: email || null,
      telefono: telefono || null,
      color_primario: color_primario || null,
      logo_url: logo_url || null,
      timezone: timezone || undefined,
    });
    revalidatePath("/app/locales");
    revalidatePath(`/app/locales/${slug}`);
  }

  async function toggleActivoLocal(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await toggleActivo(id);
    revalidatePath("/app/locales");
    revalidatePath(`/app/locales/${slug}`);
  }

  async function borrarLocalAction(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await borrarLocal(id);
    revalidatePath("/app/locales");
  }

  async function crearCategoriaAction(formData: FormData) {
    "use server";
    const nombre = String(formData.get("nombre") ?? "").trim();
    if (!nombre) return;
    await crearCategoria(local!.id, nombre);
    revalidatePath(`/app/locales/${slug}`);
  }

  async function borrarCategoriaAction(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await borrarCategoria(id);
    revalidatePath(`/app/locales/${slug}`);
  }

  async function crearProductoAction(formData: FormData) {
    "use server";
    const nombre = String(formData.get("nombre") ?? "").trim();
    if (!nombre) return;
    const precio = eurosStringToCents(String(formData.get("precio") ?? ""));
    if (precio == null) return;
    const categoriaRaw = String(formData.get("categoria_id") ?? "");
    const categoria_id = categoriaRaw ? Number(categoriaRaw) || null : null;
    const descripcion = String(formData.get("descripcion") ?? "").trim();
    const imagen_url = String(formData.get("imagen_url") ?? "").trim();
    const ivaRaw = String(formData.get("iva_pct") ?? "10");
    const iva_pct = Math.max(0, Math.min(100, Number(ivaRaw) || 10));
    const alergenos = ALERGENOS
      .map((a) => a.value)
      .filter((v) => formData.get(`alergeno-${v}`) === "on");
    await crearProducto({
      local_id: local!.id,
      categoria_id,
      nombre,
      descripcion: descripcion || null,
      precio_cents: precio,
      imagen_url: imagen_url || null,
      iva_pct,
      alergenos: alergenos.length ? alergenos : null,
      destacado: formData.get("destacado") === "on" ? 1 : 0,
    });
    revalidatePath(`/app/locales/${slug}`);
  }

  async function actualizarProductoAction(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    const nombre = String(formData.get("nombre") ?? "").trim();
    const precio = eurosStringToCents(String(formData.get("precio") ?? ""));
    const categoriaRaw = String(formData.get("categoria_id") ?? "");
    const categoria_id = categoriaRaw ? Number(categoriaRaw) || null : null;
    const descripcion = String(formData.get("descripcion") ?? "").trim();
    const imagen_url = String(formData.get("imagen_url") ?? "").trim();
    const ivaRaw = String(formData.get("iva_pct") ?? "");
    const iva_pct = ivaRaw === "" ? undefined : Math.max(0, Math.min(100, Number(ivaRaw)));
    const alergenos = ALERGENOS
      .map((a) => a.value)
      .filter((v) => formData.get(`alergeno-${v}`) === "on");
    await actualizarProducto(id, {
      categoria_id,
      nombre: nombre || undefined,
      descripcion: descripcion === "" ? null : descripcion,
      precio_cents: precio ?? undefined,
      imagen_url: imagen_url === "" ? null : imagen_url,
      iva_pct,
      alergenos,
    });
    revalidatePath(`/app/locales/${slug}`);
  }

  async function toggleActivoProd(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await toggleActivoProducto(id);
    revalidatePath(`/app/locales/${slug}`);
  }

  async function toggleDestacadoProd(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await toggleDestacadoProducto(id);
    revalidatePath(`/app/locales/${slug}`);
  }

  async function borrarProd(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await borrarProducto(id);
    revalidatePath(`/app/locales/${slug}`);
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: "1rem" }}>
        <Link href="/app/locales" style={{ color: "#9ca3af", textDecoration: "none" }}>
          ← Locales
        </Link>
        <span style={{ margin: "0 0.5rem", color: "#4b5563" }}>/</span>
        <span style={{ color: "#cdcdd9" }}>{local.nombre}</span>
      </div>

      {/* Header del local */}
      <div className="vqr-loc-detail-head" style={{ borderTop: `3px solid ${color}` }}>
        <div className="vqr-loc-avatar" style={{ background: color, color: "#0a0a0f", width: 56, height: 56, fontSize: "1.7rem" }}>
          {local.logo_url ? <img src={local.logo_url} alt="" /> : <span>{sector.icono}</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: "1.85rem", margin: 0, letterSpacing: "-0.02em" }}>
            {local.nombre}
          </h1>
          <div className="vqr-loc-slug" style={{ marginTop: "0.25rem" }}>/{local.slug}</div>
          <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
            <span className="vqr-prio-badge" style={{ color: sector.color, background: `${sector.color}1f`, borderColor: `${sector.color}55` }}>
              {sector.label}
            </span>
            <span className="vqr-prio-badge" style={{ color: plan.color, background: `${plan.color}1f`, borderColor: `${plan.color}55` }}>
              {plan.label}
            </span>
            <span className="vqr-prio-badge" style={{
              color: activo ? "#4ade80" : "#9ca3af",
              background: activo ? "#4ade801f" : "#9ca3af1f",
              borderColor: activo ? "#4ade8055" : "#9ca3af55",
            }}>
              {activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
        <LocalEditModal
          local={local}
          actualizarAction={actualizarBasicos}
          toggleAction={toggleActivoLocal}
          borrarAction={borrarLocalAction}
        />
      </div>

      {/* Categorías */}
      <section style={{ marginTop: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ fontSize: "1.15rem", margin: 0, letterSpacing: "-0.01em" }}>
            Categorías
          </h2>
          <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            {categorias.length} {categorias.length === 1 ? "categoría" : "categorías"}
          </span>
        </div>
        <div className="vqr-cat-row">
          <form action={crearCategoriaAction} className="vqr-cat-create">
            <input
              type="text"
              name="nombre"
              placeholder="Nueva categoría (ej. Bebidas, Entrantes…)"
              required
              autoComplete="off"
            />
            <button type="submit" className="vqr-todo-add">Crear</button>
          </form>
          {categorias.length > 0 && (
            <div className="vqr-cat-chips">
              {categorias.map((c) => (
                <span key={c.id} className="vqr-cat-chip">
                  {c.nombre}
                  <form action={borrarCategoriaAction} style={{ display: "inline", margin: 0 }}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="vqr-cat-chip-x" aria-label="Borrar categoría">×</button>
                  </form>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Productos */}
      <section style={{ marginTop: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ fontSize: "1.15rem", margin: 0, letterSpacing: "-0.01em" }}>
            Productos
          </h2>
          <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            {productos.length} {productos.length === 1 ? "producto" : "productos"}
          </span>
        </div>

        <ProductosBlock
          categorias={categorias}
          productos={productos}
          crearAction={crearProductoAction}
          actualizarAction={actualizarProductoAction}
          toggleActivoAction={toggleActivoProd}
          toggleDestacadoAction={toggleDestacadoProd}
          borrarAction={borrarProd}
        />
      </section>
    </div>
  );
}

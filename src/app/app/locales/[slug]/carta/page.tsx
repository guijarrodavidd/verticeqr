import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { obtenerLocalPorSlug } from "@/lib/locales";
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
import ProductosBlock from "../ProductosBlock";

export const dynamic = "force-dynamic";

export default async function CartaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const local = await obtenerLocalPorSlug(slug);
  if (!local) notFound();

  const [categorias, productos] = await Promise.all([
    listarCategorias(local.id),
    listarProductos(local.id),
  ]);

  async function crearCategoriaAction(formData: FormData) {
    "use server";
    const nombre = String(formData.get("nombre") ?? "").trim();
    if (!nombre) return;
    await crearCategoria(local!.id, nombre);
    revalidatePath(`/app/locales/${slug}/carta`);
  }

  async function borrarCategoriaAction(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await borrarCategoria(id);
    revalidatePath(`/app/locales/${slug}/carta`);
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
    const alergenos = ALERGENOS.map((a) => a.value).filter(
      (v) => formData.get(`alergeno-${v}`) === "on",
    );
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
    revalidatePath(`/app/locales/${slug}/carta`);
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
    const iva_pct =
      ivaRaw === "" ? undefined : Math.max(0, Math.min(100, Number(ivaRaw)));
    const alergenos = ALERGENOS.map((a) => a.value).filter(
      (v) => formData.get(`alergeno-${v}`) === "on",
    );
    await actualizarProducto(id, {
      categoria_id,
      nombre: nombre || undefined,
      descripcion: descripcion === "" ? null : descripcion,
      precio_cents: precio ?? undefined,
      imagen_url: imagen_url === "" ? null : imagen_url,
      iva_pct,
      alergenos,
    });
    revalidatePath(`/app/locales/${slug}/carta`);
  }

  async function toggleActivoProd(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await toggleActivoProducto(id);
    revalidatePath(`/app/locales/${slug}/carta`);
  }

  async function toggleDestacadoProd(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await toggleDestacadoProducto(id);
    revalidatePath(`/app/locales/${slug}/carta`);
  }

  async function borrarProd(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await borrarProducto(id);
    revalidatePath(`/app/locales/${slug}/carta`);
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Categorías */}
      <section style={{ marginTop: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "0.85rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
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
            <button type="submit" className="vqr-todo-add">
              Crear
            </button>
          </form>
          {categorias.length > 0 && (
            <div className="vqr-cat-chips">
              {categorias.map((c) => (
                <span key={c.id} className="vqr-cat-chip">
                  {c.nombre}
                  <form action={borrarCategoriaAction} style={{ display: "inline", margin: 0 }}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="vqr-cat-chip-x" aria-label="Borrar categoría">
                      ×
                    </button>
                  </form>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Productos */}
      <section style={{ marginTop: "2.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "0.85rem",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
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

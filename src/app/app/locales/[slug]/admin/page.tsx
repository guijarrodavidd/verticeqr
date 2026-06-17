import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  obtenerLocalPorSlug,
  actualizarLocal,
  toggleActivo,
  borrarLocal,
  parsePlan,
  parseSector,
  sectorInfo,
  PLANES,
  SECTORES,
} from "@/lib/locales";
import AdminBorrar from "./AdminBorrar";

export const dynamic = "force-dynamic";

export default async function LocalAdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const local = await obtenerLocalPorSlug(slug);
  if (!local) notFound();

  const sector = sectorInfo(local.sector);
  const activo = local.activo === 1;

  async function guardar(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    const nombre = String(formData.get("nombre") ?? "").trim();
    const slugRaw = String(formData.get("slug") ?? "").trim();
    const sec = parseSector(formData.get("sector"));
    const plan = parsePlan(formData.get("plan"));
    const cif = String(formData.get("cif") ?? "").trim();
    const direccion = String(formData.get("direccion") ?? "").trim();
    const ciudad = String(formData.get("ciudad") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const telefono = String(formData.get("telefono") ?? "").trim();
    const color_primario = String(formData.get("color_primario") ?? "").trim();
    const logo_url = String(formData.get("logo_url") ?? "").trim();
    const timezone = String(formData.get("timezone") ?? "").trim();
    await actualizarLocal(id, {
      nombre: nombre || undefined,
      slug: slugRaw || undefined,
      sector: sec,
      plan,
      cif: cif || null,
      direccion: direccion || null,
      ciudad: ciudad || null,
      email: email || null,
      telefono: telefono || null,
      color_primario: color_primario || null,
      logo_url: logo_url || null,
      timezone: timezone || undefined,
    });
    revalidatePath("/app/locales");
    // Si el slug ha cambiado, el path actual ya no existe — redirigir al nuevo.
    const finalSlug = slugRaw ? slugRaw.toLowerCase().replace(/[^a-z0-9-]/g, "-") : slug;
    revalidatePath(`/app/locales/${finalSlug}/admin`);
    redirect(`/app/locales/${finalSlug || slug}/admin`);
  }

  async function toggleEstado(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await toggleActivo(id);
    revalidatePath("/app/locales");
    revalidatePath(`/app/locales/${slug}/admin`);
  }

  async function eliminar(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await borrarLocal(id);
    revalidatePath("/app/locales");
    redirect("/app/locales");
  }

  return (
    <div style={{ maxWidth: 900, marginTop: "1.75rem" }}>
      <p style={{ color: "#9ca3af", marginTop: 0, marginBottom: "1.5rem" }}>
        Datos básicos, branding y estado del local. Los cambios se aplican
        de inmediato a su carta, su TPV y su demo visual.
      </p>

      {/* Form principal de datos */}
      <form action={guardar} className="vqr-todo-card">
        <input type="hidden" name="id" value={local.id} />
        <div className="vqr-loc-modal-grid">
          <div className="vqr-todo-field" style={{ gridColumn: "span 2" }}>
            <label htmlFor="a-nombre">Nombre del local</label>
            <input
              id="a-nombre"
              name="nombre"
              type="text"
              defaultValue={local.nombre}
              required
            />
          </div>

          <div className="vqr-todo-field">
            <label htmlFor="a-slug">Slug (URL)</label>
            <input id="a-slug" name="slug" type="text" defaultValue={local.slug} />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="a-tz">Zona horaria</label>
            <input
              id="a-tz"
              name="timezone"
              type="text"
              defaultValue={local.timezone}
            />
          </div>

          <div className="vqr-todo-field">
            <label htmlFor="a-sector">Sector</label>
            <select id="a-sector" name="sector" defaultValue={local.sector}>
              {SECTORES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="a-plan">Plan</label>
            <select id="a-plan" name="plan" defaultValue={local.plan}>
              {PLANES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="vqr-todo-field">
            <label htmlFor="a-cif">CIF / NIF</label>
            <input
              id="a-cif"
              name="cif"
              type="text"
              defaultValue={local.cif ?? ""}
              placeholder="B12345678"
              autoComplete="off"
            />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="a-ciudad">Ciudad</label>
            <input
              id="a-ciudad"
              name="ciudad"
              type="text"
              defaultValue={local.ciudad ?? ""}
              placeholder="Madrid"
              autoComplete="off"
            />
          </div>

          <div className="vqr-todo-field" style={{ gridColumn: "span 2" }}>
            <label htmlFor="a-direccion">Dirección</label>
            <input
              id="a-direccion"
              name="direccion"
              type="text"
              defaultValue={local.direccion ?? ""}
              placeholder="C/ Mayor, 12"
              autoComplete="off"
            />
          </div>

          <div className="vqr-todo-field">
            <label htmlFor="a-email">Email contacto</label>
            <input
              id="a-email"
              name="email"
              type="email"
              defaultValue={local.email ?? ""}
            />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="a-tel">Teléfono</label>
            <input
              id="a-tel"
              name="telefono"
              type="tel"
              defaultValue={local.telefono ?? ""}
            />
          </div>

          <div className="vqr-todo-field">
            <label htmlFor="a-color">Color de marca</label>
            <input
              id="a-color"
              name="color_primario"
              type="color"
              defaultValue={local.color_primario || sector.color}
            />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="a-logo">URL del logo</label>
            <input
              id="a-logo"
              name="logo_url"
              type="url"
              defaultValue={local.logo_url ?? ""}
              placeholder="https://..."
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.6rem",
            marginTop: "1.5rem",
          }}
        >
          <button type="submit" className="vqr-todo-add">
            Guardar cambios
          </button>
        </div>
      </form>

      {/* Estado (activar / desactivar) */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1.25rem 1.5rem",
          background: "#0f0f17",
          border: "1px solid #1d1d28",
          borderRadius: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>
            Estado del local
          </div>
          <div style={{ fontSize: "0.88rem", color: "#9ca3af" }}>
            Si lo desactivas, deja de aparecer en el TPV pero su carta y datos
            se conservan.
          </div>
        </div>
        <form action={toggleEstado} style={{ margin: 0 }}>
          <input type="hidden" name="id" value={local.id} />
          <button
            type="submit"
            className="vqr-modal-btn vqr-modal-btn-ghost"
            style={{ whiteSpace: "nowrap" }}
          >
            {activo ? "Desactivar local" : "Activar local"}
          </button>
        </form>
      </div>

      {/* Zona peligrosa */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1.25rem 1.5rem",
          background: "#1a0f10",
          border: "1px solid #3a1c1c",
          borderRadius: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, marginBottom: "0.2rem", color: "#fca5a5" }}>
            Borrar local
          </div>
          <div style={{ fontSize: "0.88rem", color: "#9ca3af" }}>
            Esta acción borra el local y <strong>todas</strong> sus categorías,
            productos, mesas y pedidos. No se puede deshacer.
          </div>
        </div>
        <AdminBorrar localId={local.id} borrarAction={eliminar} />
      </div>
    </div>
  );
}

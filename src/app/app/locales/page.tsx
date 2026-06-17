import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { seedLocalDemo } from "@/lib/seed-demo";
import {
  listarLocales,
  contarLocales,
  crearLocal,
  parseSector,
  parsePlan,
  parseEstadoFiltroLocal,
  parseSectorFiltro,
  SECTORES,
  PLANES,
  type EstadoFiltroLocal,
  type SectorFiltro,
  type FiltrosLocales,
} from "@/lib/locales";
import LocalesList from "./LocalesList";

export const dynamic = "force-dynamic";

type SP = { estado?: string; sector?: string; q?: string };

const ESTADOS: { value: EstadoFiltroLocal; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "activos", label: "Activos" },
  { value: "inactivos", label: "Inactivos" },
];

function hrefFiltros(f: { estado: EstadoFiltroLocal; sector: SectorFiltro; q?: string }) {
  const sp = new URLSearchParams();
  if (f.estado !== "todos") sp.set("estado", f.estado);
  if (f.sector !== "todos") sp.set("sector", f.sector);
  if (f.q) sp.set("q", f.q);
  const qs = sp.toString();
  return qs ? `/app/locales?${qs}` : "/app/locales";
}

export default async function LocalesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const user = (await getSession())!;
  const sp = await searchParams;
  const filtros: FiltrosLocales = {
    estado: parseEstadoFiltroLocal(sp.estado),
    sector: parseSectorFiltro(sp.sector),
    q: sp.q,
  };
  const [locales, contadores] = await Promise.all([
    listarLocales(filtros),
    contarLocales(),
  ]);

  async function seedDemo() {
    "use server";
    void user; // mantenemos referencia para evitar lint
    await seedLocalDemo();
    revalidatePath("/app/locales");
    redirect(`/app/locales`);
  }

  async function crear(formData: FormData) {
    "use server";
    const nombre = String(formData.get("nombre") ?? "").trim();
    if (!nombre) return;
    const sector = parseSector(formData.get("sector"));
    const plan = parsePlan(formData.get("plan"));
    await crearLocal({
      nombre,
      sector,
      plan,
      cif: String(formData.get("cif") ?? "").trim() || null,
      direccion: String(formData.get("direccion") ?? "").trim() || null,
      ciudad: String(formData.get("ciudad") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      telefono: String(formData.get("telefono") ?? "").trim() || null,
      color_primario: String(formData.get("color_primario") ?? "").trim() || "#a78bfa",
    });
    revalidatePath("/app/locales");
  }

  const filtrosActivos =
    filtros.estado !== "todos" ||
    filtros.sector !== "todos" ||
    !!filtros.q;

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ fontSize: "0.78rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
        Clientes
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0, letterSpacing: "-0.02em" }}>
          Locales
        </h1>
        <div style={{ fontSize: "0.88rem", color: "#9ca3af" }}>
          {contadores.activos} activos · {contadores.total} totales
        </div>
      </div>
      <p style={{ color: "#9ca3af", marginTop: "0.4rem", marginBottom: "2rem" }}>
        Hola {user.nombre}, gestiona aquí los locales contratados — su plan,
        contacto y branding. Cada local arrastra después sus mesas, productos
        y pedidos.
      </p>

      {/* Seed de demo — aparece mientras no estén los 9 demos */}
      {contadores.total < 9 && (
        <form action={seedDemo} style={{ marginBottom: "1rem" }}>
          <div className="vqr-loc-seed">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>
                <span style={{ color: "#fbbf24" }}>✨</span> Cargar los locales demo
              </div>
              <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                Crea Romanssera, Forno Sessanta, Bonfire Burger, Ostra & Sol,
                Magma, El Fogón Paisa, Sereno, Trellat e Isabella&apos;s Llafranc
                — cada uno con su carta inicial. Idempotente: los que ya existan
                se saltan.
              </div>
            </div>
            <button type="submit" className="vqr-modal-btn vqr-modal-btn-primary">
              Cargar los 9 demos →
            </button>
          </div>
        </form>
      )}

      {/* Form crear */}
      <div id="nuevo" className="vqr-todo-card" style={{ scrollMarginTop: "1rem" }}>
        <div style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Nuevo local</div>
        <form action={crear} className="vqr-loc-form">
          <div className="vqr-todo-field" style={{ gridColumn: "span 2" }}>
            <label htmlFor="l-nombre">Nombre</label>
            <input id="l-nombre" name="nombre" type="text" required placeholder="El Fogón Paisa" autoComplete="off" />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="l-sector">Sector</label>
            <select id="l-sector" name="sector" required defaultValue="bar-restaurante">
              {SECTORES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="l-plan">Plan</label>
            <select id="l-plan" name="plan" required defaultValue="basic">
              {PLANES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="l-cif">CIF / NIF</label>
            <input id="l-cif" name="cif" type="text" placeholder="B12345678" autoComplete="off" />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="l-direccion">Dirección</label>
            <input id="l-direccion" name="direccion" type="text" placeholder="C/ Mayor, 12" autoComplete="off" />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="l-ciudad">Ciudad</label>
            <input id="l-ciudad" name="ciudad" type="text" placeholder="Madrid" autoComplete="off" />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="l-email">Email contacto</label>
            <input id="l-email" name="email" type="email" placeholder="dueño@local.com" />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="l-telefono">Teléfono</label>
            <input id="l-telefono" name="telefono" type="tel" placeholder="+34 600 000 000" />
          </div>
          <div className="vqr-todo-field">
            <label htmlFor="l-color">Color de marca</label>
            <input id="l-color" name="color_primario" type="color" defaultValue="#a78bfa" />
          </div>
          <div style={{ display: "flex", alignItems: "end" }}>
            <button type="submit" className="vqr-todo-add" style={{ width: "100%" }}>
              Crear local
            </button>
          </div>
        </form>
      </div>

      {/* Filtros */}
      <div className="vqr-filters-grid">
        <FilterGroup
          label="Estado"
          options={ESTADOS.map((e) => ({ value: e.value, label: e.label }))}
          current={filtros.estado}
          onSelect={(v) => hrefFiltros({ ...filtros, estado: v as EstadoFiltroLocal })}
        />
        <FilterGroup
          label="Sector"
          options={[
            { value: "todos", label: "Todos" },
            ...SECTORES.map((s) => ({ value: s.value, label: s.label, color: s.color })),
          ]}
          current={filtros.sector}
          onSelect={(v) => hrefFiltros({ ...filtros, sector: v as SectorFiltro })}
        />
        {filtrosActivos && (
          <Link href="/app/locales" className="vqr-filter-clear">
            Limpiar filtros
          </Link>
        )}
      </div>

      {locales.length === 0 ? (
        <div className="vqr-todo-empty">
          {filtrosActivos
            ? "Ningún local coincide con esos filtros."
            : "Aún no hay locales. Crea el primero arriba."}
        </div>
      ) : (
        <LocalesList locales={locales} />
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  current,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string; color?: string }[];
  current: string;
  onSelect: (v: string) => string;
}) {
  return (
    <div className="vqr-filter-group">
      <div className="vqr-filter-label">{label}</div>
      <div className="vqr-filter-chips">
        {options.map((o) => {
          const active = o.value === current;
          return (
            <Link
              key={o.value}
              href={onSelect(o.value)}
              className={`vqr-filter-chip ${active ? "vqr-filter-chip-active" : ""}`}
              style={
                active && o.color
                  ? { background: `${o.color}22`, borderColor: `${o.color}66`, color: o.color }
                  : undefined
              }
            >
              {o.color && (
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: o.color,
                    marginRight: 6,
                    verticalAlign: "middle",
                  }}
                />
              )}
              {o.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

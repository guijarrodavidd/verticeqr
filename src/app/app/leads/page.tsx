import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import {
  listarLeads,
  contarLeadsPorEstado,
  actualizarLead,
  borrarLead,
  parseEstadoLead,
  parseEstadoLeadFiltro,
  ESTADOS_LEAD,
  type EstadoLeadFiltro,
  type FiltrosLeads,
} from "@/lib/leads";
import LeadsList from "./LeadsList";

export const dynamic = "force-dynamic";

type SP = { estado?: string; q?: string };

function hrefFiltros(f: { estado: EstadoLeadFiltro; q?: string }) {
  const sp = new URLSearchParams();
  if (f.estado !== "todos") sp.set("estado", f.estado);
  if (f.q) sp.set("q", f.q);
  const qs = sp.toString();
  return qs ? `/app/leads?${qs}` : "/app/leads";
}

const FILTROS_ESTADO: { value: EstadoLeadFiltro; label: string; color?: string }[] = [
  { value: "todos", label: "Todos" },
  ...ESTADOS_LEAD.map((e) => ({ value: e.value as EstadoLeadFiltro, label: e.label, color: e.color })),
];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const user = (await getSession())!;
  const sp = await searchParams;
  const filtros: FiltrosLeads = {
    estado: parseEstadoLeadFiltro(sp.estado),
    q: sp.q,
  };
  const [leads, contadores] = await Promise.all([
    listarLeads(filtros),
    contarLeadsPorEstado(),
  ]);

  async function cambiarEstado(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    const estado = parseEstadoLead(formData.get("estado"));
    await actualizarLead(id, { estado });
    revalidatePath("/app/leads");
  }

  async function guardarNotas(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    const notas = String(formData.get("notas") ?? "");
    const estado = parseEstadoLead(formData.get("estado"));
    await actualizarLead(id, { notas, estado });
    revalidatePath("/app/leads");
  }

  async function borrar(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id) || id <= 0) return;
    await borrarLead(id);
    revalidatePath("/app/leads");
  }

  const filtrosActivos = filtros.estado !== "todos" || !!filtros.q;
  const total = Object.values(contadores).reduce((a, b) => a + b, 0);

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ fontSize: "0.78rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
        Comercial
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0, letterSpacing: "-0.02em" }}>
          Solicitudes de demo
        </h1>
        <div style={{ fontSize: "0.88rem", color: "#9ca3af" }}>
          {contadores.nuevo} sin atender · {total} totales
        </div>
      </div>
      <p style={{ color: "#9ca3af", marginTop: "0.4rem", marginBottom: "2rem" }}>
        Hola {user.nombre}, aquí entran las peticiones desde la landing y las
        páginas de demo. Cambia el estado conforme avanza la negociación.
      </p>

      {/* Filtros */}
      <div className="vqr-filters-grid">
        <div className="vqr-filter-group">
          <div className="vqr-filter-label">Estado</div>
          <div className="vqr-filter-chips">
            {FILTROS_ESTADO.map((f) => {
              const active = f.value === filtros.estado;
              const count =
                f.value === "todos"
                  ? total
                  : (contadores[f.value as keyof typeof contadores] ?? 0);
              return (
                <Link
                  key={f.value}
                  href={hrefFiltros({ ...filtros, estado: f.value })}
                  className={`vqr-filter-chip ${active ? "vqr-filter-chip-active" : ""}`}
                  style={
                    active && f.color
                      ? { background: `${f.color}22`, borderColor: `${f.color}66`, color: f.color }
                      : undefined
                  }
                >
                  {f.color && (
                    <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 999, background: f.color, marginRight: 6, verticalAlign: "middle" }} />
                  )}
                  {f.label} <span style={{ opacity: 0.7 }}>({count})</span>
                </Link>
              );
            })}
          </div>
        </div>
        {filtrosActivos && (
          <Link href="/app/leads" className="vqr-filter-clear">
            Limpiar filtros
          </Link>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="vqr-todo-empty">
          {filtrosActivos
            ? "Ninguna solicitud coincide con esos filtros."
            : "Aún no hay solicitudes. Cuando alguien rellene el form de la landing aparecerán aquí."}
        </div>
      ) : (
        <LeadsList
          leads={leads}
          cambiarEstadoAction={cambiarEstado}
          guardarAction={guardarNotas}
          borrarAction={borrar}
        />
      )}
    </div>
  );
}

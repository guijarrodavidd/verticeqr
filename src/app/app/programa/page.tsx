import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { crearAlumno, guardarNota, listarAlumnos, nuevoEnlace, ponerClaveNueva } from "@/lib/programa";
import { TOTAL_DIAS, diaDelPrograma, fechaLarga, hoyMadrid, semanaActual, type Plan } from "@/lib/programa-curriculo";
import { TOTAL_IMPLANTACION } from "@/lib/programa-implantacion";
import { Copiar } from "@/app/programa/aula/Copiar";
import { visibles as preguntasDeLaAuditoria } from "@/app/programa/auditoria/preguntas";

// Alumnos del programa Director con Claude. El programa es de Héctor, aparte
// de Vértice: solo lo ve su usuario.
export const dynamic = "force-dynamic";

const DUENO = "cavani";

type SP = { enlace?: string; para?: string };

// La contraseña recién hecha solo se enseña aquí unos minutos: viaja en una
// cookie del panel y nunca en la dirección de la página.
const COOKIE_CLAVE = "dc_clave_nueva";
async function recordarClave(id: number, clave: string) {
  (await cookies()).set(COOKIE_CLAVE, `${id}:${clave}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/app/programa",
    maxAge: 15 * 60,
  });
}

// 600 000 000 → 34600000000, para abrir el chat de WhatsApp.
function whatsapp(tel: string | null): string | null {
  const d = (tel ?? "").replace(/\D/g, "");
  if (!d) return null;
  return d.length === 9 ? `34${d}` : d.replace(/^00/, "");
}

export default async function ProgramaAdminPage({ searchParams }: { searchParams: Promise<SP> }) {
  const user = await getSession();
  if (user?.id !== DUENO) notFound();

  const sp = await searchParams;
  const alumnos = await listarAlumnos();
  const h = await headers();
  const host = h.get("host") ?? "verticeqr.com";
  const origen = host.includes("verticeqr.com") ? "https://verticeqr.com" : `http://${host}`;

  async function alta(formData: FormData) {
    "use server";
    if ((await getSession())?.id !== DUENO) notFound();
    const nombre = String(formData.get("nombre") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect("/app/programa");
    const { id, token, clave } = await crearAlumno({
      nombre,
      email,
      telefono: String(formData.get("telefono") ?? "") || null,
      hotel: String(formData.get("hotel") ?? "") || null,
      plan: (["hotel", "implantacion"].includes(String(formData.get("plan"))) ? String(formData.get("plan")) : "director") as Plan,
      // Se vuelve a fijar el día que entra por primera vez.
      fecha_alta: hoyMadrid(),
    });
    await recordarClave(id, clave);
    redirect(`/app/programa?enlace=${token}&para=${id}`);
  }

  async function claveNueva(formData: FormData) {
    "use server";
    if ((await getSession())?.id !== DUENO) notFound();
    const id = Number(formData.get("id"));
    const clave = await ponerClaveNueva(id);
    await recordarClave(id, clave);
    redirect(`/app/programa?para=${id}`);
  }

  async function enlaceNuevo(formData: FormData) {
    "use server";
    if ((await getSession())?.id !== DUENO) notFound();
    const id = Number(formData.get("id"));
    const token = await nuevoEnlace(id);
    redirect(`/app/programa?enlace=${token}&para=${id}`);
  }

  async function nota(formData: FormData) {
    "use server";
    if ((await getSession())?.id !== DUENO) notFound();
    await guardarNota(Number(formData.get("id")), String(formData.get("nota") ?? ""));
    revalidatePath("/app/programa");
  }

  const nuevo = sp.para ? alumnos.find((a) => a.id === Number(sp.para)) : undefined;
  const enlace = nuevo && sp.enlace ? `${origen}/programa/entrar/${sp.enlace}` : "";
  const recordada = (await cookies()).get(COOKIE_CLAVE)?.value ?? "";
  const separador = recordada.indexOf(":");
  const clave = nuevo && separador > 0 && Number(recordada.slice(0, separador)) === nuevo.id ? recordada.slice(separador + 1) : "";
  const aula = `${origen.replace(/^https?:\/\//, "")}/programa/aula`;
  const saludo = nuevo ? `Hola ${nuevo.nombre.split(" ")[0]}, ya tienes acceso a Director con Claude.` : "";
  const mensaje = !nuevo
    ? ""
    : clave
      ? `${saludo}\n\nEntra en ${aula} con tu correo y esta contraseña:\n\nCorreo: ${nuevo.email}\nContraseña: ${clave}\n\nHoy toca el día 1, tu auditoría. Tómatela con calma, porque con ella te preparo mis sugerencias para tu hotel. Al día siguiente se te abren las bases.`
      : enlace
        ? `${saludo}\n\nEste es tu enlace personal para entrar en tu aula: ${enlace}\n\nHoy toca el día 1, tu auditoría. Con ella te preparo mis sugerencias para tu hotel.`
        : "";

  return (
    <div style={{ maxWidth: 1100, display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "1.6rem" }}>Programa · Director con Claude</h1>
        <p style={{ margin: "6px 0 0", color: "#5b6470" }}>
          {alumnos.length === 1 ? "1 alumno" : `${alumnos.length} alumnos`}. Cada uno entra en su aula con su correo y su
          contraseña. Su programa empieza a contar el día que entra por primera vez, y desde ahí se le abre una semana cada 7 días.
        </p>
      </div>

      {nuevo && mensaje && (
        <section style={caja("#ecfdf9", "#087f7b")}>
          <b>Acceso de {nuevo.nombre}</b>
          {clave && (
            <div style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
              Entra en <b>{aula}</b>
              <br />
              Correo: <b>{nuevo.email}</b>
              <br />
              Contraseña: <b style={{ fontFamily: "ui-monospace, monospace", fontSize: "1.05rem" }}>{clave}</b>
            </div>
          )}
          <pre id="mensaje-acceso" style={{ margin: 0, whiteSpace: "pre-wrap", font: "inherit", fontSize: "0.9rem", color: "#26303b" }}>
            {mensaje}
          </pre>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {whatsapp(nuevo.telefono) && (
              <a
                style={boton}
                target="_blank"
                rel="noreferrer"
                href={`https://wa.me/${whatsapp(nuevo.telefono)}?text=${encodeURIComponent(mensaje)}`}
              >
                Mandárselo por WhatsApp
              </a>
            )}
            <Copiar texto={mensaje} destino="mensaje-acceso" style={{ ...botonClaro, cursor: "pointer" }} />
          </div>
          {enlace && (
            <span style={{ fontSize: "0.85rem", color: "#5b6470", wordBreak: "break-all" }}>
              También puede entrar sin contraseña con su enlace personal: {enlace}
            </span>
          )}
          <span style={{ fontSize: "0.85rem", color: "#5b6470" }}>
            {clave
              ? "La contraseña solo se ve aquí 15 minutos. Si la pierde, «Contraseña nueva» le hace otra y la anterior deja de valer."
              : "Si haces un enlace nuevo, el anterior deja de funcionar."}
          </span>
        </section>
      )}

      <section style={caja("#fff", "rgba(14,17,22,.12)")}>
        <b>Dar de alta a un alumno</b>
        <form action={alta} style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          <input name="nombre" required placeholder="Nombre" style={campo} />
          <input name="email" type="email" required placeholder="Email" style={campo} />
          <input name="telefono" placeholder="WhatsApp" style={campo} />
          <input name="hotel" placeholder="Hotel (ciudad)" style={campo} />
          <select name="plan" style={campo} defaultValue="director">
            <option value="director">Plan Director</option>
            <option value="hotel">Plan Hotel</option>
            <option value="implantacion">Implantación con Héctor (mentoría)</option>
          </select>
          <button type="submit" style={{ ...boton, border: 0, cursor: "pointer" }}>
            Dar de alta y sacar su contraseña
          </button>
        </form>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {alumnos.map((a) => {
          const semana = semanaActual(a.fecha_alta);
          const wa = whatsapp(a.telefono);
          const p = a.punto_partida;
          return (
            <article key={a.id} style={caja("#fff", "rgba(14,17,22,.12)")}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <b style={{ fontSize: "1.05rem" }}>{a.nombre}</b>
                  <div style={{ color: "#5b6470", fontSize: "0.9rem" }}>
                    {[a.hotel, a.email, a.telefono].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: "0.9rem" }}>
                  <div>
                    {a.plan === "implantacion" ? "Implantación" : a.plan === "hotel" ? "Plan Hotel" : "Plan Director"} ·{" "}
                    {a.ultimo_acceso ? `empezó el ${fechaLarga(a.fecha_alta)}` : "empieza cuando entre"}
                  </div>
                  <div style={{ color: "#5b6470" }}>
                    {a.plan === "implantacion" ? `Día ${diaDelPrograma(a.fecha_alta)} · ${a.hechas} de ${TOTAL_IMPLANTACION} lecciones hechas` : `${semana >= 5 ? "Día 21 abierto" : `Semana ${Math.max(semana, 1)}`} · ${a.hechas} de ${TOTAL_DIAS} días hechos`} ·{" "}
                    {a.ultimo_acceso ? `última entrada ${a.ultimo_acceso.slice(8, 10)}/${a.ultimo_acceso.slice(5, 7)} a las ${a.ultimo_acceso.slice(11, 16)}` : "aún no ha entrado"}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.92rem", lineHeight: 1.5 }}>
                {p ? (
                  <>
                    <b>Auditoría.</b> {p.momento} · {p.puesto} · {p.habitaciones} hab. · {p.ofimatica}.
                    <br />
                    <b>Su primer agente:</b> {p.principal}. <b>Cómo lo hace hoy:</b> «{p.como_hoy}»
                    <br />
                    <b>Su semana:</b> «{p.semana}»
                    <br />
                    <b>Quiere:</b> «{p.objetivo}»
                    {p.freno && p.freno !== "(sin contestar)" && (
                      <>
                        <br />
                        <b>Le frena:</b> «{p.freno}»
                      </>
                    )}
                  </>
                ) : (
                  <span style={{ color: "#b42318" }}>Aún no ha entregado su auditoría.</span>
                )}
              </div>

              {a.auditoria && (
                <details style={{ fontSize: "0.92rem", lineHeight: 1.5 }}>
                  <summary style={{ cursor: "pointer", fontWeight: 600 }}>Su auditoría de la implantación</summary>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                    {preguntasDeLaAuditoria(
                      Object.fromEntries(Object.entries(a.auditoria).map(([k, v]) => [k, [v]])),
                    ).map((p, i, todas) => (
                      <div key={p.id}>
                        {p.apartado !== todas[i - 1]?.apartado && (
                          <div style={{ fontWeight: 700, color: "#087f7b", marginTop: i ? 8 : 0 }}>{p.apartado}</div>
                        )}
                        <div style={{ color: "#5b6470" }}>{p.texto}</div>
                        <div style={{ whiteSpace: "pre-wrap" }}>{a.auditoria?.[p.id] ?? "(sin contestar)"}</div>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              <form action={nota} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input type="hidden" name="id" value={a.id} />
                <textarea
                  name="nota"
                  defaultValue={a.nota ?? ""}
                  rows={3}
                  placeholder="Su hoja de ruta: la ve arriba del todo en su aula."
                  style={{ ...campo, resize: "vertical" }}
                />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="submit" style={{ ...boton, border: 0, cursor: "pointer" }}>
                    Guardar hoja de ruta
                  </button>
                  {wa && (
                    <a style={botonClaro} target="_blank" rel="noreferrer" href={`https://wa.me/${wa}`}>
                      Abrir WhatsApp
                    </a>
                  )}
                  <button type="submit" formAction={claveNueva} style={{ ...botonClaro, cursor: "pointer" }}>
                    Contraseña nueva
                  </button>
                  <button type="submit" formAction={enlaceNuevo} style={{ ...botonClaro, cursor: "pointer" }}>
                    Sacar un enlace nuevo
                  </button>
                </div>
              </form>
            </article>
          );
        })}
      </section>
    </div>
  );
}

const caja = (fondo: string, borde: string): React.CSSProperties => ({
  background: fondo,
  border: `1px solid ${borde}`,
  borderRadius: 14,
  padding: 18,
  display: "flex",
  flexDirection: "column",
  gap: 12,
});
const campo: React.CSSProperties = {
  font: "inherit",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(14,17,22,.18)",
  background: "#fff",
};
const boton: React.CSSProperties = {
  background: "#0b1220",
  color: "#fff",
  borderRadius: 999,
  padding: "10px 16px",
  font: "inherit",
  fontWeight: 600,
  fontSize: "0.92rem",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};
const botonClaro: React.CSSProperties = { ...boton, background: "#f1f6f6", color: "#0e1116", border: 0 };

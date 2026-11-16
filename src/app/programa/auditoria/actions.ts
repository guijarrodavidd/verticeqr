"use server";

import { redirect } from "next/navigation";
import { crearLead } from "@/lib/leads";
import { alumnoActual, guardarAuditoriaDelAlumno } from "@/lib/programa";
import { PREGUNTAS, visibles, type Respuestas } from "./preguntas";

// Guarda la auditoría de la implantación en la ficha del alumno y, como copia,
// en los leads (origen "programa:auditoria") y en la hoja de Google.
export async function guardarAuditoria(formData: FormData) {
  const volver = (error: string) => redirect(`/programa/auditoria?error=${error}`);

  // Bot: se le devuelve al formulario sin guardar nada.
  if (String(formData.get("hp") ?? "").trim() !== "") volver("campos");

  // Si entró con su enlace personal, ya sabemos quién es.
  const alumno = await alumnoActual();
  const nombre = alumno?.nombre ?? String(formData.get("nombre") ?? "").trim();
  const email = alumno?.email ?? String(formData.get("email") ?? "").trim();
  const telefono = alumno?.telefono ?? String(formData.get("telefono") ?? "").trim();
  const hotel = alumno?.hotel ?? String(formData.get("hotel") ?? "").trim();
  if (!alumno) {
    if (!nombre) volver("nombre");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) volver("email");
    if ((telefono ?? "").replace(/\D/g, "").length < 9) volver("telefono");
    if (!hotel) volver("hotel");
  }

  const crudas: Respuestas = {};
  for (const p of PREGUNTAS) {
    crudas[p.id] = formData.getAll(p.id).map((v) => String(v).trim().slice(0, 4000)).filter(Boolean);
  }
  const r: Record<string, string> = {};
  for (const p of visibles(crudas)) {
    if (!crudas[p.id].length && !p.opcional) volver("campos");
    r[p.id] = crudas[p.id].join(", ") || "(sin contestar)";
  }

  const mensaje = [
    `Auditoría de la implantación: ${nombre} · ${hotel || "sin hotel"}`,
    "",
    ...visibles(crudas).map((p) => `[${p.apartado}] ${p.texto}\n${r[p.id]}`),
    "",
    `Contacto: ${nombre} · ${telefono || "sin teléfono"} · ${email}`,
  ].join("\n");

  try {
    await guardarAuditoriaDelAlumno(email, r);
  } catch (err) {
    console.error("[programa:auditoria] no se pudo guardar en el alumno", err);
  }

  try {
    await crearLead({ nombre, email, telefono, empresa: hotel, mensaje: mensaje.slice(0, 60000), origen: "programa:auditoria" });
  } catch (err) {
    console.error("[programa:auditoria] no se pudo guardar el lead", err);
  }

  const hoja = process.env.LEADS_SHEET_URL;
  if (hoja) {
    try {
      await fetch(hoja, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: new Date().toISOString(),
          nombre,
          email,
          telefono,
          hotel,
          recurso: "Auditoría (implantación)",
          slug: "programa-auditoria",
          ...r,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error("[programa:auditoria] no se pudo enviar a Google Sheets", err);
    }
  }

  redirect("/programa/auditoria/gracias");
}

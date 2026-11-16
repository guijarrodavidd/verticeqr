"use server";

import { redirect } from "next/navigation";
import { crearLead } from "@/lib/leads";
import { guardarRespuestasDelAlumno } from "@/lib/programa";
import { PREGUNTAS } from "./preguntas";

// Guarda «Tu punto de partida» como lead (origen "programa:punto-de-partida").
// Nombre, teléfono, email, hotel y ciudad son obligatorios: el programa llega
// por correo y las ayudas, por WhatsApp.
export async function guardarPuntoDePartida(formData: FormData) {
  const volver = (error: string) => redirect(`/programa/punto-de-partida?error=${error}`);

  // Bot: se le devuelve al formulario sin guardar nada.
  if (String(formData.get("hp") ?? "").trim() !== "") volver("campos");

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) volver("nombre");
  const telefono = String(formData.get("telefono") ?? "").trim();
  if (telefono.replace(/\D/g, "").length < 9) volver("telefono");
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) volver("email");
  const hotel = String(formData.get("hotel") ?? "").trim();
  if (!hotel) volver("hotel");
  const ciudad = String(formData.get("ciudad") ?? "").trim();
  if (!ciudad) volver("ciudad");
  const whatsapp = formData.get("whatsapp") === "si";

  const r: Record<string, string> = {};
  for (const p of PREGUNTAS) {
    const valores = formData.getAll(p.id).map((v) => String(v).trim().slice(0, 1500)).filter(Boolean);
    if (!valores.length && !p.opcional) volver("campos");
    r[p.id] = valores.join(", ") || "(sin contestar)";
  }

  // Lo primero que lee Héctor: lo que necesita para escribirle.
  const paraEscribirle = [
    `Su primer agente: ${r.principal}. Cómo lo hace hoy: ${r.como_hoy}`,
    `Lo que quiere al acabar: ${r.objetivo}`,
    `Lo que le frena: ${r.freno}. Trabaja con: ${r.ofimatica}.`,
    whatsapp ? "Acepta que le escribas por WhatsApp." : "No ha dado permiso para WhatsApp: escríbele por correo.",
  ];

  const mensaje = [
    `Tu punto de partida: ${hotel} (${ciudad}).`,
    ...paraEscribirle,
    "",
    ...PREGUNTAS.map((p) => `${p.texto} ${r[p.id]}`),
    `Contacto: ${nombre} · ${telefono} · ${email}`,
  ].join("\n");

  try {
    await crearLead({
      nombre,
      email,
      telefono,
      empresa: `${hotel} (${ciudad})`,
      sector: r.habitaciones,
      mensaje,
      origen: "programa:punto-de-partida",
    });
  } catch (err) {
    console.error("[programa:punto-de-partida] no se pudo guardar", err);
  }

  // Si ya es alumno, sus respuestas pasan a su aula para hacérsela a medida.
  try {
    await guardarRespuestasDelAlumno(email, r);
  } catch (err) {
    console.error("[programa:punto-de-partida] no se pudo guardar en el alumno", err);
  }

  // Copia en Google Sheets, igual que el resto de formularios.
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
          ciudad,
          acepta: whatsapp ? "WhatsApp" : "",
          recurso: "Tu auditoría (programa)",
          slug: "programa",
          ...r,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error("[programa:punto-de-partida] no se pudo enviar a Google Sheets", err);
    }
  }

  redirect(`/programa/punto-de-partida/gracias${whatsapp ? "?wa=1" : ""}`);
}

"use server";

import { redirect } from "next/navigation";
import { crearLead } from "@/lib/leads";
import { PREGUNTAS } from "./preguntas";

// Guarda las respuestas del cuestionario como lead (origen "recurso:hotel").
// Nombre, teléfono y ciudad del hotel son obligatorios para que cada lead
// llegue identificado; el email es opcional.
export async function pedirHotel(formData: FormData) {
  const volver = (error: string) => redirect(`/recurso/hotel?error=${error}#cuestionario`);

  // Bot: se le devuelve al formulario sin guardar nada.
  if (String(formData.get("hp") ?? "").trim() !== "") volver("campos");

  const hotel = String(formData.get("hotel") ?? "").trim();
  if (!hotel) volver("hotel");
  const ciudad = String(formData.get("ciudad") ?? "").trim();
  if (!ciudad) volver("ciudad");
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) volver("nombre");
  const telefono = String(formData.get("telefono") ?? "").trim();
  if (telefono.replace(/\D/g, "").length < 9) volver("telefono");

  const respuestas: Record<string, string> = {};
  for (const p of PREGUNTAS) {
    const valores = formData.getAll(p.id).map((v) => String(v).trim()).filter(Boolean);
    if (!valores.length && !p.multiple) volver("campos");
    respuestas[p.id] = valores.join(", ") || "(sin marcar)";
  }

  const emailBruto = String(formData.get("email") ?? "").trim();
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailBruto) ? emailBruto : "";

  const mensaje = [
    `Pidió que le monten su hotel: ${hotel} (${ciudad}).`,
    ...PREGUNTAS.map((p) => `${p.texto} ${respuestas[p.id]}`),
    `Contacto: ${nombre} · ${telefono}${email ? ` · ${email}` : ""}`,
  ].join("\n");

  try {
    await crearLead({
      nombre,
      email,
      telefono,
      empresa: `${hotel} (${ciudad})`,
      sector: respuestas.tipo,
      mensaje,
      origen: "recurso:hotel",
    });
  } catch (err) {
    console.error("[recurso:hotel] no se pudo guardar el lead", err);
  }

  // Copia en Google Sheets, igual que el resto de recursos.
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
          acepta: "",
          recurso: "Así quedaría tu hotel vendiendo",
          slug: "hotel",
          ...respuestas,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error("[recurso:hotel] no se pudo enviar a Google Sheets", err);
    }
  }

  redirect("/recurso/hotel/gracias");
}

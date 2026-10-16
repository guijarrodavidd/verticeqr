"use server";

import { redirect } from "next/navigation";
import { crearLead } from "@/lib/leads";
import { PREGUNTAS } from "./preguntas";

// Guarda las respuestas del cuestionario como lead (origen "recurso:hotel").
// No se pide email ni teléfono: el hotel identifica a quien lo pidió por
// LinkedIn. El contacto extra es opcional.
export async function pedirHotel(formData: FormData) {
  const volver = (error: string) => redirect(`/recurso/hotel?error=${error}#cuestionario`);

  // Bot: se le devuelve al formulario sin guardar nada.
  if (String(formData.get("hp") ?? "").trim() !== "") volver("campos");

  const hotel = String(formData.get("hotel") ?? "").trim();
  if (!hotel) volver("hotel");

  const respuestas: Record<string, string> = {};
  for (const p of PREGUNTAS) {
    const valores = formData.getAll(p.id).map((v) => String(v).trim()).filter(Boolean);
    if (!valores.length && !p.multiple) volver("campos");
    respuestas[p.id] = valores.join(", ") || "(sin marcar)";
  }

  const contacto = String(formData.get("contacto") ?? "").trim();
  const esEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto);
  const esTelefono = !esEmail && contacto.replace(/\D/g, "").length >= 9;

  const mensaje = [
    `Pidió que le monten su hotel: ${hotel}.`,
    ...PREGUNTAS.map((p) => `${p.texto} ${respuestas[p.id]}`),
    contacto ? `Contacto extra: ${contacto}` : "Contacto: por LinkedIn",
  ].join("\n");

  try {
    await crearLead({
      nombre: hotel,
      email: esEmail ? contacto : "",
      telefono: esTelefono ? contacto : null,
      empresa: hotel,
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
          nombre: hotel,
          email: esEmail ? contacto : "",
          telefono: esTelefono ? contacto : "",
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

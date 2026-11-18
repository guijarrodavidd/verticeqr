"use server";

import { redirect } from "next/navigation";
import { crearLead } from "@/lib/leads";
import { PREGUNTAS } from "./preguntas";

// Guarda las respuestas del formulario de conexiones y automatizaciones como lead (origen
// "conectar"): salen en /app/leads y en la hoja de Google, como los recursos.
// Nombre, teléfono y ciudad del hotel son obligatorios; el email es opcional.
export async function enviarConexiones(formData: FormData) {
  const volver = (error: string) => redirect(`/conectar?error=${error}#formulario`);

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
    const otro = p.otro ? String(formData.get(`${p.id}_otro`) ?? "").trim() : "";
    respuestas[p.id] = [valores.join(", ") || "(sin marcar)", otro].filter(Boolean).join(" · ");
  }
  const mano = String(formData.get("mano") ?? "").trim().slice(0, 2000);
  const automatizacion = String(formData.get("automatizacion") ?? "").trim().slice(0, 3000);

  const emailBruto = String(formData.get("email") ?? "").trim();
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailBruto) ? emailBruto : "";

  const mensaje = [
    `Formulario de conexiones: ${hotel} (${ciudad}).`,
    ...PREGUNTAS.map((p) => `${p.texto} ${respuestas[p.id]}`),
    `Lo que pasan a mano: ${mano || "(nada)"}`,
    `Automatización que necesitan: ${automatizacion || "(ninguna)"}`,
    `Contacto: ${nombre} · ${telefono}${email ? ` · ${email}` : ""}`,
  ].join("\n");

  try {
    await crearLead({
      nombre,
      email,
      telefono,
      empresa: `${hotel} (${ciudad})`,
      sector: respuestas.reservas,
      mensaje,
      origen: "conectar",
    });
  } catch (err) {
    console.error("[conectar] no se pudo guardar el lead", err);
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
          acepta: "",
          recurso: "Qué hay que conectar en tu hotel",
          slug: "conectar",
          ...respuestas,
          mano,
          automatizacion,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error("[conectar] no se pudo enviar a Google Sheets", err);
    }
  }

  redirect("/conectar/gracias");
}

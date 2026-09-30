"use server";

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { crearLead } from "@/lib/leads";
import { getRecurso } from "@/lib/recursos";

// Guarda el lead y abre la puerta del recurso. La página de entrega solo se
// ve con la cookie que se pone aquí: sin formulario, no hay recurso.
export async function pedirRecurso(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const recurso = getRecurso(slug);
  if (!recurso) notFound();

  const volver = (error: string) => redirect(`/recurso/${slug}?error=${error}#formulario`);

  // Bot: se le devuelve al formulario sin guardar nada.
  if (String(formData.get("hp") ?? "").trim() !== "") volver("campos");

  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const acepta = formData.get("acepta") === "on";

  if (!email || !telefono) volver("campos");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) volver("email");
  if (telefono.replace(/\D/g, "").length < 9) volver("telefono");

  try {
    await crearLead({
      nombre: nombre || "(sin nombre)",
      email,
      telefono,
      mensaje: `Pidió el recurso: ${recurso.titulo}. Acepta recibir información: ${acepta ? "sí" : "no"}.`,
      origen: `recurso:${slug}`,
    });
  } catch (err) {
    // Si la BD falla, el recurso se entrega igual: el error queda en el log.
    console.error("[recurso] no se pudo guardar el lead", slug, err);
  }

  // Copia en Google Sheets, si está configurada (LEADS_SHEET_URL = URL de la
  // aplicación web de Apps Script). Si falla, el lead sigue guardado en la BD.
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
          acepta: acepta ? "sí" : "no",
          recurso: recurso.titulo,
          slug,
        }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (err) {
      console.error("[recurso] no se pudo enviar el lead a Google Sheets", slug, err);
    }
  }

  (await cookies()).set(`rec_${slug}`, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/recurso",
    maxAge: 60 * 60 * 24 * 90,
  });
  redirect(`/recurso/${slug}/gracias`);
}

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { abrirSesion, alumnoPorCorreoYClave, apuntarAcceso, empezarSiEsLaPrimeraVez } from "@/lib/programa";

// Entrada al aula con correo y contraseña. Tras 10 intentos fallidos con el
// mismo correo o desde la misma conexión, espera 15 minutos.
const VENTANA_MS = 15 * 60 * 1000;
const MAX_FALLOS = 10;
const fallos = new Map<string, { n: number; desde: number }>();

function bloqueado(clave: string): boolean {
  const f = fallos.get(clave);
  if (!f) return false;
  if (Date.now() - f.desde > VENTANA_MS) {
    fallos.delete(clave);
    return false;
  }
  return f.n >= MAX_FALLOS;
}

function apuntarFallo(clave: string) {
  const f = fallos.get(clave);
  if (!f || Date.now() - f.desde > VENTANA_MS) fallos.set(clave, { n: 1, desde: Date.now() });
  else f.n++;
}

export async function entrarConClave(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const clave = String(formData.get("clave") ?? "");
  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim() || "sin-ip";
  const claves = [`c:${email}`, `i:${ip}`];

  if (claves.some(bloqueado)) redirect("/programa/aula?acceso=espera");

  const alumno = await alumnoPorCorreoYClave(email, clave);
  if (!alumno) {
    claves.forEach(apuntarFallo);
    redirect("/programa/aula?acceso=no");
  }

  claves.forEach((c) => fallos.delete(c));
  await abrirSesion(alumno.id);
  await empezarSiEsLaPrimeraVez(alumno);
  await apuntarAcceso(alumno.id);
  redirect("/programa/aula");
}

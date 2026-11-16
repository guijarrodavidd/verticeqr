import { NextResponse, type NextRequest } from "next/server";
import { abrirSesion, alumnoPorToken, apuntarAcceso, empezarSiEsLaPrimeraVez } from "@/lib/programa";

// El enlace personal que recibe cada alumno: /programa/entrar/<token>.
// Abre la sesión en ese navegador y le lleva a su aula. La primera vez que
// entra empieza a contar su programa.
export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const alumno = await alumnoPorToken(token);
  if (!alumno) return NextResponse.redirect(new URL("/programa/aula?enlace=no", req.url));
  await abrirSesion(alumno.id);
  await empezarSiEsLaPrimeraVez(alumno);
  await apuntarAcceso(alumno.id);
  return NextResponse.redirect(new URL("/programa/aula", req.url));
}

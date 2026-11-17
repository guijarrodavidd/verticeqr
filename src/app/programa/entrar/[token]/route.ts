import { redirect } from "next/navigation";
import { abrirSesion, alumnoPorToken, apuntarAcceso, empezarSiEsLaPrimeraVez } from "@/lib/programa";

// El enlace personal que recibe cada alumno: /programa/entrar/<token>.
// Abre la sesión en ese navegador y le lleva a su aula. La primera vez que
// entra empieza a contar su programa.
// La redirección va con ruta relativa: detrás del proxy del hosting, req.url
// trae 0.0.0.0:3000 y el alumno acababa en una dirección que no existe.
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const alumno = await alumnoPorToken(token);
  if (!alumno) redirect("/programa/aula?enlace=no");
  await abrirSesion(alumno.id);
  await empezarSiEsLaPrimeraVez(alumno);
  await apuntarAcceso(alumno.id);
  redirect("/programa/aula");
}

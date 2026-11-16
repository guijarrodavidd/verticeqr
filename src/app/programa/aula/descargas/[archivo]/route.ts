import path from "node:path";
import { promises as fs } from "node:fs";
import { NextResponse } from "next/server";
import { alumnoActual } from "@/lib/programa";
import { DESCARGAS, RECURSOS, estaAbierto } from "@/lib/programa-curriculo";

// Descarga privada: solo con sesión de alumno y con la semana del recurso abierta.
export async function GET(_req: Request, { params }: { params: Promise<{ archivo: string }> }) {
  const { archivo } = await params;
  const alumno = await alumnoActual();
  const descarga = DESCARGAS[archivo];
  const recurso = RECURSOS.find((r) => r.archivo === archivo);
  if (!alumno || !descarga || !recurso || !estaAbierto(alumno.fecha_alta, recurso.abre)) {
    return new NextResponse("No disponible", { status: 404 });
  }
  const datos = await fs.readFile(path.join(process.cwd(), "privado", "programa", descarga.fichero));
  return new NextResponse(new Uint8Array(datos), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(descarga.nombre)}`,
      "Cache-Control": "private, no-store",
    },
  });
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import s from "../aula.module.css";
import { Marca } from "../../Marca";
import { Bot } from "../Bot";
import { alumnoActual } from "@/lib/programa";
import { RECURSOS, estaAbierto, hayClases } from "@/lib/programa-curriculo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Recursos · Director con Claude", robots: { index: false, follow: false } };

// Las plantillas y documentos que el alumno ya tiene abiertos. Lo demás no se enseña.
export default async function RecursosPage() {
  const alumno = await alumnoActual();
  if (!alumno) redirect("/programa/aula");
  const abiertos = RECURSOS.filter((r) => r.archivo && estaAbierto(alumno.fecha_alta, r.abre));
  if (abiertos.length === 0 || !hayClases(alumno.fecha_alta, alumno.plan)) redirect("/programa/aula");

  return (
    <main className={s.pagina}>
      <Marca derecha={<a href="/programa/salir">Salir</a>} />
      <section className={s.portada}>
        <div className={`${s.wrap} ${s.portadaGrid}`}>
          <div className={s.portadaTexto}>
            <Link className={`${s.volver} ${s.aparece}`} href="/programa/aula">
              ← Tu aula
            </Link>
            <h1 className={`${s.titulo} ${s.aparece}`} style={{ ["--d" as string]: 1 }}>
              Recursos
            </h1>
            <p className={`${s.consigues} ${s.aparece}`} style={{ ["--d" as string]: 2 }}>
              Las plantillas del programa, para quedártelas.
            </p>
          </div>
          <div className={`${s.aparece} ${s.botPortada}`} style={{ ["--d" as string]: 2 }}>
            <Bot traje="carpeta" tam={220} />
          </div>
        </div>
      </section>
      <div className={s.wrap}>
        <div className={`${s.semana} ${s.leccion}`}>
          {abiertos.map((r, i) => (
            <div key={r.titulo} className={`${s.recurso} ${s.aparece}`} style={{ ["--d" as string]: i }}>
              <div>
                <b>{r.titulo}</b>
                <small>{r.semana}</small>
              </div>
              <a className={`${s.boton} ${s.botonPeque}`} href={`/programa/aula/descargas/${r.archivo}`}>
                Descargar
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

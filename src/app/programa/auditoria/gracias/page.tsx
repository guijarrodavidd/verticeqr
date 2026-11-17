import type { Metadata } from "next";
import s from "../../punto-de-partida/punto.module.css";
import { Marca } from "../../Marca";
import { BorrarBorrador } from "./BorrarBorrador";
import { alumnoActual } from "@/lib/programa";
import { estaAbierto } from "@/lib/programa-curriculo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function GraciasAuditoriaPage() {
  // Si la manda un alumno desde su aula, vuelve a ella.
  const alumno = await alumnoActual();
  return (
    <main className={s.pagina}>
      <Marca />
      <BorrarBorrador />
      <section className={s.centro}>
        <div className={s.portada}>
          <div className={s.hecho} aria-hidden="true">✓</div>
          <h1 className={s.titulo}>Ya tengo tu auditoría</h1>
          {!alumno && (
            <p className={s.entrada}>
              La leo con calma antes de nuestra llamada. Ahí repasamos juntos lo que no me quede claro, y una semana después
              tienes el plano de tu sistema.
            </p>
          )}
          {alumno && (
            <>
              <p className={s.entrada}>La leo con calma y te dejo en tu aula mis sugerencias para tu hotel.</p>
              <p className={s.entrada}>
                {estaAbierto(alumno.fecha_alta, 1) ? "Ya tienes abiertas las bases en tu aula." : "Mañana se abren las bases en tu aula."}
              </p>
              <a className={s.empezar} href="/programa/aula">
                Volver a mi aula
              </a>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

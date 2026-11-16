import type { Metadata } from "next";
import s from "../../punto-de-partida/punto.module.css";
import { Marca } from "../../Marca";
import { BorrarBorrador } from "./BorrarBorrador";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function GraciasAuditoriaPage() {
  return (
    <main className={s.pagina}>
      <Marca />
      <BorrarBorrador />
      <section className={s.centro}>
        <div className={s.portada}>
          <div className={s.hecho} aria-hidden="true">✓</div>
          <h1 className={s.titulo}>Ya tengo tu auditoría</h1>
          <p className={s.entrada}>
            La leo con calma antes de nuestra llamada. Ahí repasamos juntos lo que no me quede claro, y una semana después
            tienes el plano de tu sistema.
          </p>
        </div>
      </section>
    </main>
  );
}

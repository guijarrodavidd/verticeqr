import type { Metadata } from "next";
import s from "../punto.module.css";
import { Marca } from "../../Marca";

type Props = { searchParams: Promise<{ wa?: string }> };

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function GraciasPuntoDePartidaPage({ searchParams }: Props) {
  const { wa } = await searchParams;
  const canal = wa ? "por WhatsApp" : "por correo";
  return (
    <main className={s.pagina}>
      <Marca />
      <section className={s.centro}>
        <div className={s.portada}>
          <div className={s.hecho} aria-hidden="true">✓</div>
          <h1 className={s.titulo}>Ya tengo tu auditoría</h1>
          <p className={s.entrada}>
            Lo leo yo y te escribo {canal} con tu hoja de ruta. Te diré en qué días pararte más según tu hotel y cómo
            será el agente que vas a montar en la última semana.
          </p>
          <a className={s.empezar} href="/programa/aula/auditoria">
            Ver mi auditoría
          </a>
        </div>
      </section>
    </main>
  );
}

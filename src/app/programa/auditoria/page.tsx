import type { Metadata } from "next";
import s from "../punto-de-partida/punto.module.css";
import { FormularioAuditoria } from "./FormularioAuditoria";
import { Marca } from "../Marca";
import { alumnoActual } from "@/lib/programa";

type Props = { searchParams: Promise<{ error?: string }> };

export const metadata: Metadata = {
  metadataBase: new URL("https://verticeqr.com"),
  title: "Tu auditoría · Implantación con Héctor",
  description: "Antes de nuestra llamada, cuéntame tu semana, lo que buscas y las tareas que te quieres quitar de encima.",
  robots: { index: false, follow: false },
};

export default async function AuditoriaPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const alumno = await alumnoActual();
  return (
    <main className={s.pagina}>
      <Marca />
      <section className={s.centro}>
        <FormularioAuditoria conocido={alumno ? { nombre: alumno.nombre, email: alumno.email } : null} error={error} />
      </section>
    </main>
  );
}

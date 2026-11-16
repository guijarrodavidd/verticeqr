import type { Metadata } from "next";
import s from "./punto.module.css";
import { Cuestionario } from "./Cuestionario";
import { Marca } from "../Marca";

type Props = { searchParams: Promise<{ error?: string; email?: string }> };

const TITULO = "Tu auditoría";
const SUBTITULO = "Antes de empezar los 21 días, cuéntame cómo es tu hotel y tu semana.";

export const metadata: Metadata = {
  metadataBase: new URL("https://verticeqr.com"),
  title: `${TITULO} · Director con Claude`,
  description: SUBTITULO,
  robots: { index: false, follow: false },
};

export default async function PuntoDePartidaPage({ searchParams }: Props) {
  const { error, email } = await searchParams;
  return (
    <main className={s.pagina}>
      <Marca />
      <section className={s.centro}>
        <Cuestionario error={error} email={email} />
      </section>
    </main>
  );
}

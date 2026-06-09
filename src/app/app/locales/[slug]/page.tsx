import { redirect } from "next/navigation";

// El layout ya valida que el local existe y muestra cabecera+tabs.
// El index del local redirige directamente a la pestaña por defecto: Carta.
export default async function LocalIndex({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/app/locales/${slug}/carta`);
}

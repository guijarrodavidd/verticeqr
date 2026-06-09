import type { ReactNode } from "react";
import { listarLocales } from "@/lib/locales";
import LocalesSidebar from "./_components/LocalesSidebar";

export const dynamic = "force-dynamic";

export default async function LocalesLayout({ children }: { children: ReactNode }) {
  // El sidebar interno muestra TODOS los locales del tenant (activos e inactivos),
  // así el usuario navega entre ellos sin volver a la lista cada vez.
  const locales = await listarLocales({ estado: "todos", sector: "todos" });

  return (
    <div className="vqr-loc-shell">
      <LocalesSidebar locales={locales} />
      <div className="vqr-loc-main">{children}</div>
    </div>
  );
}

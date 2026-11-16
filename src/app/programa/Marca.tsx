import type { ReactNode } from "react";
import s from "./marca.module.css";

// La barra de la landing del programa (/programa): firma, «Director con Claude»
// y, a la derecha, lo que haga falta («Salir»).
export function Marca({ derecha }: { derecha?: ReactNode }) {
  return (
    <header className={s.top}>
      <div className={s.wrap}>
        <a className={s.marca} href="/programa/aula">
          <b className={s.firma}>Héctor García</b>
          <span className={s.marcaC}>
            Director con{" "}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/programa/claude-logo.svg" alt="Claude" width={75} height={16} />
          </span>
        </a>
        {derecha && <nav className={s.nav}>{derecha}</nav>}
      </div>
    </header>
  );
}

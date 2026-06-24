"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./CookieBanner.module.css";

const KEY = "vqr_cookie_consent";
export const COOKIE_EVENT = "vqr:open-cookie-preferences";

// Banner de consentimiento (RGPD + LSSI). Sin analítica activa de momento:
// guarda la elección en localStorage y deja listo el gate para cuando se añada
// Google Analytics u otros (cargar solo si consent.analytics === true).
export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
    const reopen = () => setOpen(true);
    window.addEventListener(COOKIE_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_EVENT, reopen);
  }, []);

  function decide(analytics: boolean) {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ v: 1, necessary: true, analytics, ts: Date.now() }),
      );
    } catch {
      /* sin localStorage: simplemente cerramos */
    }
    // Cuando exista analítica, cargarla aquí condicionada a `analytics`.
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className={styles.wrap} role="dialog" aria-label="Aviso de cookies">
      <div className={styles.card}>
        <div className={styles.body}>
          <div className={styles.title}>Tu privacidad</div>
          <p className={styles.text}>
            Usamos cookies <strong>técnicas</strong> necesarias para que la web
            funcione. Si lo aceptas, en el futuro podremos usar cookies de{" "}
            <strong>analítica</strong> para entender cómo se usa la web y
            mejorarla. Tú decides.{" "}
            <Link href="/cookies" className={styles.link}>
              Más información
            </Link>
            .
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => decide(false)}
          >
            Solo necesarias
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => decide(true)}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

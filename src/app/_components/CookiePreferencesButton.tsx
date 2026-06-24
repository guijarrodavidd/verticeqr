"use client";

import { COOKIE_EVENT } from "./CookieBanner";
import styles from "../legal.module.css";

// Reabre el banner de cookies para cambiar el consentimiento desde /cookies.
export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className={styles.prefBtn}
      onClick={() => window.dispatchEvent(new Event(COOKIE_EVENT))}
    >
      Cambiar mis preferencias de cookies
    </button>
  );
}

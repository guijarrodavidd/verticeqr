"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../landing.module.css";

/**
 * Formulario de contacto.
 *
 * Vive en cliente por un motivo de velocidad: es lo ÚNICO de la landing que
 * dependía del querystring (?ok=1, ?error=…, ?origen=…), y eso obligaba a
 * renderizar la página entera en el servidor en cada visita. Sacándolo aquí,
 * el resto de la landing se sirve ya hecha desde la caché.
 */
function FormularioInterno({ enviarLead }: { enviarLead: (fd: FormData) => Promise<void> }) {
  const qs = useSearchParams();
  const ok = qs.get("ok");
  const error = qs.get("error");
  const origen = qs.get("origen");

  return (
    <>
      {ok === "1" ? (
        <div className={styles.formSuccess}>
          <div style={{ fontSize: "1.8rem", color: "#1a7f4f", marginBottom: "0.5rem" }}>✓</div>
          <div style={{ fontWeight: 700, fontSize: "1.15rem" }}>¡Solicitud recibida!</div>
          <div style={{ color: "#4f4f4c", marginTop: "0.5rem", fontSize: "0.94rem" }}>
            Nos pondremos en contacto contigo en menos de 24h. Mientras,{" "}
            <a href="#producto" style={{ color: "#111111", textDecoration: "underline" }}>
              mira cómo funciona
            </a>
            .
          </div>
        </div>
      ) : (
        <form action={enviarLead} className={styles.form}>
          <input type="hidden" name="origen" value={origen ?? "landing"} />
          <input type="text" name="hp" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden />

          {error && (
            <div className={styles.formError}>
              {error === "email" ? "El email no parece válido." : "Faltan campos obligatorios."}
            </div>
          )}

          <div>
            <label htmlFor="lead-nombre" className={styles.formLabel}>Tu nombre *</label>
            <input id="lead-nombre" name="nombre" type="text" required placeholder="Cómo te llamas" className={styles.formInput} />
          </div>
          <div>
            <label htmlFor="lead-email" className={styles.formLabel}>Email *</label>
            <input id="lead-email" name="email" type="email" required placeholder="tu@email.com" className={styles.formInput} />
          </div>

          <div>
            <label htmlFor="lead-telefono" className={styles.formLabel}>Teléfono</label>
            <input id="lead-telefono" name="telefono" type="tel" placeholder="+34 600 000 000" className={styles.formInput} />
          </div>
          <div>
            <label htmlFor="lead-empresa" className={styles.formLabel}>Nombre del hotel</label>
            <input id="lead-empresa" name="empresa" type="text" placeholder="Tu hotel" className={styles.formInput} />
          </div>

          <div>
            <label htmlFor="lead-sector" className={styles.formLabel}>Tipo de hotel</label>
            <select id="lead-sector" name="sector" defaultValue="" className={styles.formSelect}>
              <option value="">— Elige uno —</option>
              <option value="hotel-boutique">Hotel boutique</option>
              <option value="hotel-independiente">Hotel independiente</option>
              <option value="hotel-lujo">Hotel de lujo / 5★</option>
              <option value="resort">Resort</option>
              <option value="hostal-bb">Hostal / B&amp;B</option>
              <option value="apartamentos">Apartamentos turísticos</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label htmlFor="lead-mesas" className={styles.formLabel}>Habitaciones aprox.</label>
            <input id="lead-mesas" name="mesas" type="number" min="1" max="999" placeholder="ej. 40" className={styles.formInput} />
          </div>

          <div className={styles.formFull}>
            <label htmlFor="lead-mensaje" className={styles.formLabel}>Cuéntanos lo que necesitas</label>
            <textarea id="lead-mensaje" name="mensaje" rows={4} placeholder="Lo que quieras: nº de habitaciones, si ya tienes room service, tu PMS, dudas…" className={styles.formTextarea} />
          </div>

          <div className={styles.formFull} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ fontSize: "0.78rem", color: "#9a9a96" }}>
              * campos obligatorios
            </div>
            <button type="submit" className={styles.ctaPrimary}>
              Enviar <span>→</span>
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default function FormularioContacto(props: { enviarLead: (fd: FormData) => Promise<void> }) {
  return (
    <Suspense fallback={null}>
      <FormularioInterno {...props} />
    </Suspense>
  );
}

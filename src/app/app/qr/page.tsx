import Link from "next/link";
import QRCode from "qrcode";
import { getSession } from "@/lib/auth";
import { listarLocales, sectorInfo } from "@/lib/locales";
import type { Local } from "@/lib/locales-shared";
import QrActions from "./QrActions";

export const dynamic = "force-dynamic";

const MAX_MESAS = 200;

function parseMesas(raw: string | undefined): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) return 0;
  return Math.min(MAX_MESAS, n);
}

async function generarSvgQR(url: string, color: string): Promise<string> {
  // Genera el SVG del QR con color de marca como módulo "dark".
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "H", // H = soporta logo encima sin perder lectura
    margin: 1,
    width: 220,
    color: {
      dark: color,
      light: "#00000000", // transparente: encaja con cualquier fondo
    },
  });
}

export default async function QrPage({
  searchParams,
}: {
  searchParams: Promise<{ local?: string; mesas?: string }>;
}) {
  await getSession();
  const sp = await searchParams;

  // Solo locales activos para evitar generar QR a un negocio dado de baja.
  const locales = (await listarLocales({ estado: "activos", sector: "todos" }));

  const slugSel = sp.local && locales.some((l) => l.slug === sp.local) ? sp.local : "";
  const mesas = parseMesas(sp.mesas);
  const local: Local | undefined = locales.find((l) => l.slug === slugSel);

  const qrs: Array<{ n: number; svg: string }> = [];
  if (local && mesas > 0) {
    const color = local.color_primario || sectorInfo(local.sector).color;
    for (let n = 1; n <= mesas; n++) {
      const url = `https://verticeqr.com/m/${local.slug}/${n}`;
      const svg = await generarSvgQR(url, color);
      qrs.push({ n, svg });
    }
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ fontSize: "0.78rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
        Herramientas
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0, letterSpacing: "-0.02em" }}>
          Generador de QR
        </h1>
        {local && qrs.length > 0 && (
          <QrActions />
        )}
      </div>
      <p style={{ color: "#9ca3af", marginTop: "0.4rem", marginBottom: "2rem" }}>
        Un QR por mesa, con el branding del local. Cada QR apunta a{" "}
        <code style={{ background: "#15151f", padding: "0.15rem 0.4rem", borderRadius: 6 }}>
          verticeqr.com/m/[slug]/[mesa]
        </code>
        . Lo de "imprimir bonito" lo afinaremos por cliente.
      </p>

      {/* Wizard de configuración */}
      <form
        method="get"
        action="/app/qr"
        className="vqr-qr-form vqr-no-print"
      >
        <div className="vqr-todo-field">
          <label htmlFor="qr-local">1 · ¿Para qué negocio?</label>
          {locales.length === 0 ? (
            <div style={{ padding: "0.7rem 0.9rem", border: "1px solid #2a2a3a", borderRadius: 9, background: "#15151f", color: "#9ca3af" }}>
              No hay locales activos.{" "}
              <Link href="/app/locales" style={{ color: "#a78bfa" }}>
                Crea uno →
              </Link>
            </div>
          ) : (
            <select id="qr-local" name="local" defaultValue={slugSel} required>
              <option value="">— Elige un local —</option>
              {locales.map((l) => {
                const s = sectorInfo(l.sector);
                return (
                  <option key={l.id} value={l.slug}>
                    {l.nombre} · {s.label}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        <div className="vqr-todo-field">
          <label htmlFor="qr-mesas">2 · ¿Cuántas mesas?</label>
          <input
            id="qr-mesas"
            name="mesas"
            type="number"
            min="1"
            max={MAX_MESAS}
            defaultValue={mesas || ""}
            placeholder="ej. 12"
            required
          />
        </div>

        <button type="submit" className="vqr-todo-add" style={{ alignSelf: "end" }}>
          Generar QRs →
        </button>
      </form>

      {/* Estado vacío */}
      {!local && (
        <div className="vqr-todo-empty" style={{ marginTop: "1.5rem" }}>
          Elige un local y un número de mesas para generar los QRs.
        </div>
      )}

      {/* Estado: local seleccionado pero sin mesas */}
      {local && mesas === 0 && (
        <div className="vqr-todo-empty" style={{ marginTop: "1.5rem" }}>
          Indica cuántas mesas tiene <strong>{local.nombre}</strong>.
        </div>
      )}

      {/* Cabecera del local + grid de QRs */}
      {local && qrs.length > 0 && (
        <>
          <div className="vqr-qr-summary vqr-no-print">
            Generados <strong>{qrs.length}</strong> QR{qrs.length > 1 ? "s" : ""} para{" "}
            <strong style={{ color: local.color_primario || sectorInfo(local.sector).color }}>
              {local.nombre}
            </strong>{" "}
            · <span style={{ color: "#6b7280" }}>
              verticeqr.com/m/{local.slug}/[1…{mesas}]
            </span>
          </div>

          <div className="vqr-qr-grid">
            {qrs.map(({ n, svg }) => (
              <QrCard
                key={n}
                mesa={n}
                local={local}
                svg={svg}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function QrCard({
  mesa,
  local,
  svg,
}: {
  mesa: number;
  local: Local;
  svg: string;
}) {
  const color = local.color_primario || sectorInfo(local.sector).color;
  const sector = sectorInfo(local.sector);
  return (
    <div
      className="vqr-qr-card"
      style={{
        borderColor: color,
      }}
    >
      <div className="vqr-qr-card-head">
        <div
          className="vqr-qr-card-logo"
          style={{ background: color, color: "#0a0a0f" }}
        >
          {local.logo_url ? <img src={local.logo_url} alt="" /> : <span>{sector.icono}</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="vqr-qr-card-brand">{local.nombre}</div>
          <div className="vqr-qr-card-tagline">Tu carta, en un escaneo</div>
        </div>
      </div>

      <div
        className="vqr-qr-canvas"
        style={{ borderColor: `${color}55`, background: "#fff" }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      <div className="vqr-qr-card-mesa" style={{ color }}>
        <span style={{ opacity: 0.55, letterSpacing: "0.2em" }}>MESA</span>
        <span style={{ fontSize: "2.4rem", fontWeight: 900, lineHeight: 1, marginTop: "0.15rem" }}>
          {String(mesa).padStart(2, "0")}
        </span>
      </div>

      <div className="vqr-qr-card-foot">
        Apunta tu cámara para ver la carta y pedir
      </div>
    </div>
  );
}

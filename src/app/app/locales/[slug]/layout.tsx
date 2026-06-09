import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerLocalPorSlug, planInfo, sectorInfo } from "@/lib/locales";
import LocalTabs from "./_components/LocalTabs";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const local = await obtenerLocalPorSlug(slug);
  return {
    title: local ? `${local.nombre} — VerticeQR` : "Local no encontrado",
  };
}

export default async function LocalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const local = await obtenerLocalPorSlug(slug);
  if (!local) notFound();

  const sector = sectorInfo(local.sector);
  const plan = planInfo(local.plan);
  const activo = local.activo === 1;
  const color = local.color_primario || sector.color;

  return (
    <>
      {/* Breadcrumb compacto */}
      <div style={{ fontSize: "0.82rem", color: "#9ca3af", marginBottom: "1rem" }}>
        <Link href="/app/locales" style={{ color: "#9ca3af", textDecoration: "none" }}>
          Locales
        </Link>
        <span style={{ margin: "0 0.4rem", color: "#4b5563" }}>/</span>
        <span style={{ color: "#cdcdd9" }}>{local.nombre}</span>
      </div>

      {/* Cabecera del local */}
      <div className="vqr-loc-detail-head" style={{ borderTop: `3px solid ${color}` }}>
        <div
          className="vqr-loc-avatar"
          style={{
            background: color,
            color: "#0a0a0f",
            width: 56,
            height: 56,
            fontSize: "1.7rem",
          }}
        >
          {local.logo_url ? <img src={local.logo_url} alt="" /> : <span>{sector.icono}</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: "1.7rem", margin: 0, letterSpacing: "-0.02em" }}>
            {local.nombre}
          </h1>
          <div className="vqr-loc-slug" style={{ marginTop: "0.2rem" }}>
            /{local.slug}
          </div>
          <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.55rem", flexWrap: "wrap" }}>
            <span
              className="vqr-prio-badge"
              style={{ color: sector.color, background: `${sector.color}1f`, borderColor: `${sector.color}55` }}
            >
              {sector.label}
            </span>
            <span
              className="vqr-prio-badge"
              style={{ color: plan.color, background: `${plan.color}1f`, borderColor: `${plan.color}55` }}
            >
              {plan.label}
            </span>
            <span
              className="vqr-prio-badge"
              style={{
                color: activo ? "#4ade80" : "#9ca3af",
                background: activo ? "#4ade801f" : "#9ca3af1f",
                borderColor: activo ? "#4ade8055" : "#9ca3af55",
              }}
            >
              {activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <LocalTabs slug={local.slug} />

      {/* Contenido de la sub-ruta */}
      {children}
    </>
  );
}

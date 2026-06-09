import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerLocalPorSlug, sectorInfo } from "@/lib/locales";
import { listarCategorias, listarProductos } from "@/lib/productos";
import Tpv, { type MenuCat } from "../_components/Tpv";
import "../_components/tpv.css";

export const dynamic = "force-dynamic";

export default async function LocalTpvPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const local = await obtenerLocalPorSlug(slug);
  if (!local) notFound();

  const [cats, prods] = await Promise.all([
    listarCategorias(local.id),
    listarProductos(local.id),
  ]);
  const activos = prods.filter((p) => p.activo);
  const menu: MenuCat[] = cats
    .map((c) => ({
      cat: c.nombre,
      items: activos
        .filter((p) => p.categoria_id === c.id)
        .map((p) => ({ id: p.id, name: p.nombre, cents: p.precio_cents })),
    }))
    .filter((g) => g.items.length > 0);
  const sueltos = activos.filter((p) => p.categoria_id == null);
  if (sueltos.length) {
    menu.push({
      cat: "Otros",
      items: sueltos.map((p) => ({
        id: p.id,
        name: p.nombre,
        cents: p.precio_cents,
      })),
    });
  }

  const accent = local.color_primario || sectorInfo(local.sector).color;

  // Sin productos activos no podemos abrir la sala.
  if (menu.length === 0) {
    return (
      <div className="vqr-todo-empty" style={{ marginTop: "2rem" }}>
        <strong>{local.nombre}</strong> no tiene productos activos todavía.{" "}
        <Link href={`/app/locales/${slug}/carta`} style={{ color: "#a78bfa" }}>
          Añade su carta →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1.75rem" }}>
      <p style={{ color: "#9ca3af", marginTop: 0, marginBottom: "1.6rem" }}>
        Mesas, ticket por mesa y cobro. Pensado también para quien{" "}
        <strong style={{ color: "#d1d5db" }}>no escanea el QR</strong>: el
        camarero añade productos a mano desde la carta.
      </p>
      <Tpv
        localSlug={local.slug}
        localNombre={local.nombre}
        accent={accent}
        menu={menu}
      />
    </div>
  );
}

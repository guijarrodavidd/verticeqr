// Catálogo de recursos que se entregan desde /recurso/[slug].
//
// Para publicar un recurso nuevo solo se añade una entrada aquí: la landing,
// el formulario y la página de entrega salen de la misma plantilla. El lead
// se guarda en la tabla `leads` con origen "recurso:<slug>", así que aparece
// en /app/leads sin tocar nada más.

export type Recurso = {
  slug: string;
  // Etiqueta del sello de arriba ("Recurso gratuito", "Plantilla"…).
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  // Lo que se lleva, en 3-5 líneas cortas. Opcional.
  incluye?: string[];
  // A dónde se le manda tras rellenar el formulario.
  destino: string;
  // Texto del botón de la página de entrega.
  cta: string;
};

export const RECURSOS: Recurso[] = [
  // Plantilla: copia este bloque, cambia el slug, el título y el enlace, y ya
  // está publicada en /recurso/<slug>.
  {
    slug: "plantilla",
    etiqueta: "Recurso gratuito",
    titulo: "Título del recurso",
    subtitulo: "Una o dos frases que expliquen qué se lleva el director y para qué le sirve.",
    incluye: [
      "Lo primero que incluye",
      "Lo segundo que incluye",
      "Lo tercero que incluye",
    ],
    destino: "",
    cta: "Abrir el recurso",
  },
];

export function getRecurso(slug: string): Recurso | undefined {
  return RECURSOS.find((r) => r.slug === slug);
}

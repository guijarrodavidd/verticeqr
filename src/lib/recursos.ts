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
  {
    slug: "kits",
    etiqueta: "Recurso gratuito",
    titulo: "Los 3 Kits del Director",
    subtitulo:
      "12 prompts para Claude o ChatGPT: el cierre de mes para la propiedad, las fugas del F&B y lo que el huésped quiso comprar y no pudo.",
    incluye: [
      "kit-propiedad: el GOP explicado en una página y el PMS en 3 números",
      "kit-fnb: ingeniería de carta, fugas y ventas cruzadas",
      "kit-huesped: ventas perdidas en reseñas y email pre-llegada",
      "Cada prompt le prohíbe a la IA inventarse cifras",
    ],
    destino: "https://claude.ai/artifact/4ifrVwrAfvS7qzXUkjZ2N1",
    cta: "Abrir los 3 kits",
  },
  {
    slug: "agentes",
    etiqueta: "Recurso gratuito",
    titulo: "Los 9 Agentes del Director",
    subtitulo:
      "El equipo que no cuenta en plantilla: 9 agentes para Claude o ChatGPT que miden, venden y quitan fricción. Tú les pasas los datos y tú decides.",
    incluye: [
      "Métricas: cuánto ingreso por huésped se te escapa y el informe para la propiedad",
      "Venta: qué ofrecer a cada huésped, cuándo y con quién",
      "Fricción: por qué no te piden y cómo vender más sin sumar personal",
      "Ninguno inventa cifras ni te pide contratar a nadie",
    ],
    destino: "https://claude.ai/artifact/VzjAofCALgaVLfcq8ReWKG",
    cta: "Abrir los 9 agentes",
  },
  {
    slug: "prompts",
    etiqueta: "Recurso gratuito",
    titulo: "30 Prompts para Directores de Hotel",
    subtitulo:
      "Copias, pegas en Claude o ChatGPT y cambias lo que va entre corchetes. Del cierre de mes a la carta, las reseñas y el equipo.",
    incluye: [
      "30 prompts en 7 áreas del hotel",
      "Cada uno te dice qué datos pegar",
      "Ninguno te pide contratar a nadie",
    ],
    destino: "https://claude.ai/artifact/Ve6aw1pgqVms9LqD3uKHFC",
    cta: "Abrir los 30 prompts",
  },
  {
    slug: "fugas",
    etiqueta: "Plantilla gratuita",
    titulo: "Las 66 Fugas del F&B",
    subtitulo:
      "66 momentos en los que el huésped quiere gastar y no puede, en 6 zonas del hotel, y cómo se tapa cada uno sin sumar personal.",
    incluye: [
      "66 fugas en 6 zonas, urbano y vacacional",
      "Cómo se tapa cada una, paso a paso",
      "El primer paso de esta semana y cómo medirlo",
    ],
    // Cuando esté en Drive como Hoja de Google compartida, cambia esto por su enlace.
    destino: "/descargables/las-66-fugas-del-fb.xlsx",
    cta: "Descargar la hoja",
  },
  {
    slug: "biblioteca",
    etiqueta: "Recurso gratuito",
    titulo: "La Biblioteca de Ingresos Hoteleros",
    subtitulo:
      "19 carpetas para subir el margen del hotel sin sumar una persona: propiedad, margen, datos, room service, experiencias y plantillas.",
    incluye: [
      "19 carpetas, 30 documentos",
      "El informe de una página para la propiedad",
      "Checklists de turno listos para imprimir",
    ],
    destino: "/biblioteca",
    cta: "Abrir la biblioteca",
  },
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

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
    destino: "/kits",
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
    destino: "/agentes",
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
    destino: "/prompts",
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
  {
    slug: "recepcionista",
    etiqueta: "Recurso gratuito",
    titulo: "El Recepcionista IA",
    subtitulo:
      "Contesta a tus huéspedes a cualquier hora, en su idioma y con el tono de tu hotel. Y cuando la pregunta esconde una venta, la hace.",
    incluye: [
      "Las instrucciones completas para Claude o ChatGPT, listas para copiar",
      "La ficha de tu hotel para rellenar en 5 minutos",
      "Dos conversaciones reales de ejemplo, en inglés y en español",
      "Seis mensajes de prueba para ver si detecta la venta",
    ],
    destino: "/recepcionista",
    cta: "Abrir el Recepcionista IA",
  },
  {
    slug: "claude",
    etiqueta: "Recurso gratuito",
    titulo: "Claude Opus 5.5 para Hoteles",
    subtitulo:
      "Un solo proyecto de Claude que hace el trabajo de 9 personas en tu hotel: el cierre de mes, los márgenes, la venta antes del check-in y lo que recepción repite cada día.",
    incluye: [
      "Las instrucciones completas, en un solo bloque para copiar",
      "Los 9 especialistas dentro: del cierre de mes a la venta antes del check-in",
      "Cómo pedirle cada tarea, lista para copiar",
      "La ficha de tu hotel para rellenar en 5 minutos",
    ],
    destino: "/claude",
    cta: "Abrir Claude para Hoteles",
  },
  // Los 7 recursos de los posts del 17 de octubre de 2026.
  {
    slug: "cerebro",
    etiqueta: "Recurso gratuito",
    titulo: "Tu hotel entero, dentro de Claude",
    subtitulo:
      "El cerebro de tu hotel dentro de Claude: un CLAUDE.md con todo el contexto y 6 Skills listas para subir. Todo para ganar más con cada huésped sin sumar a nadie.",
    incluye: [
      "CLAUDE.md: la plantilla con el contexto de tu hotel",
      "6 Skills de Claude: Carta, Room service, Experiencias, Alianzas, Huésped y Dirección",
      "60 prompts listos para copiar",
      "Calculadora: cuánto se te escapa cada mes",
    ],
    destino: "/cerebro",
    cta: "Abrir el cerebro y los 60 prompts",
  },
  {
    slug: "50-prompts",
    etiqueta: "Recurso gratuito",
    titulo: "50 prompts para directores de hotel",
    subtitulo:
      "Lo que te lleva una semana de despacho, Claude lo hace en una tarde. Copias, pegas tus datos y cambias lo que va entre corchetes.",
    incluye: [
      "Dueños: resumen de una página, cierre de mes y presupuesto",
      "Equipo: turnos, formación de nuevos y checklists de cada puesto",
      "Huésped y ventas: reseñas, quejas convertidas en tareas, carta y excursiones",
      "Marketing: posts, web y ofertas de temporada",
    ],
    destino: "/50-prompts",
    cta: "Abrir los 50 prompts",
  },
  {
    slug: "equipo",
    etiqueta: "Recurso gratuito",
    titulo: "El equipo que no tienes que contratar",
    subtitulo:
      "7 asistentes de Claude, uno por área de tu hotel, con sus instrucciones listas para pegar. Tú solo les pasas tus datos; te proponen y tú eliges.",
    incluye: [
      "Cómo montar el espacio de tu hotel en Claude, todo organizado",
      "La ficha de tu hotel lista para rellenar",
      "7 asistentes: Dirección, Equipo, Huéspedes, Ventas, Reseñas, Marketing y Cuentas",
      "21 peticiones para probarlos hoy",
    ],
    destino: "/equipo",
    cta: "Abrir los 7 asistentes",
  },
  {
    slug: "15-prompts",
    etiqueta: "Recurso gratuito",
    titulo: "15 prompts para que tu hotel gane más sin contratar a nadie",
    subtitulo:
      "Hechos con Claude: del dinero que se escapa cada mes al plan de temporada. Copias, pegas tus datos y listo.",
    incluye: [
      "Calculadora del dinero perdido, informe para los dueños y cierre de mes",
      "Carta que vende en 5 idiomas, excursiones y acuerdos con negocios de tu zona",
      "Mensaje antes de llegar, precios por temporada, reseñas y quejas",
      "Turnos, formación de nuevos, posts y plan de temporada",
    ],
    destino: "/15-prompts",
    cta: "Abrir los 15 prompts",
  },
  {
    slug: "ventas",
    etiqueta: "Recurso gratuito",
    titulo: "Todo tu hotel, en automático con Claude",
    subtitulo:
      "20 asistentes de Claude para las 5 áreas de tu hotel, cada uno con sus instrucciones. Tú solo le pasas tus datos y Claude te prepara el informe, los turnos, las respuestas o la carta.",
    incluye: [
      "20 asistentes listos para copiar en un Proyecto de Claude",
      "Dirección, Equipo, Huésped, Ventas y Marketing",
      "Qué datos pasarle a cada uno y un ejemplo de petición",
      "La ficha de tu hotel para no explicárselo de cero",
    ],
    destino: "/ventas",
    cta: "Abrir los 20 asistentes",
  },
  {
    slug: "asistentes",
    etiqueta: "Recurso gratuito",
    titulo: "15 asistentes de Claude que todo director de hotel debería tener",
    subtitulo:
      "Uno por tarea, del informe para los dueños al plan de la temporada. Los configuras una vez con los datos de tu hotel y después solo les pasas lo de cada día.",
    incluye: [
      "15 asistentes listos para pegar en Claude",
      "La petición de cada día, con huecos para rellenar",
      "Una ficha del hotel que sirve para los 15",
      "Lista para ir marcando los que ya tienes",
    ],
    destino: "/asistentes",
    cta: "Abrir los 15 asistentes",
  },
  {
    slug: "nivel",
    etiqueta: "Recurso gratuito",
    titulo: "Los 7 niveles de un director con Claude",
    subtitulo:
      "Un test de 7 preguntas para saber en qué nivel estás y el sistema completo para subir de uno a otro. Ninguno pide saber de tecnología: tú decides, Claude prepara.",
    incluye: [
      "Test de 7 preguntas: tu nivel en un minuto",
      "5 prompts base y la ficha de tu hotel para que Claude lo conozca",
      "4 asistentes por área: carta, equipo, reseñas y dueños",
      "El resumen del mes desde el informe del sistema y dos asistentes encadenados",
    ],
    destino: "/nivel",
    cta: "Hacer el test y subir de nivel",
  },
  {
    slug: "gm",
    etiqueta: "Recurso gratuito",
    titulo: "La guía completa GM 2026",
    subtitulo:
      "Todo lo que necesitas saber para dirigir tu hotel con IA. El trabajo de despacho de cada semana, listo para copiar en Claude o en ChatGPT, con ejemplos hechos y lo que tienes que revisar antes de enviarlo.",
    incluye: [
      "50 prompts por área: dirección, equipo, huésped, carta, experiencias, reseñas y precios",
      "20 asistentes con sus instrucciones completas, para pegar una vez y usar cada semana",
      "19 plantillas para rellenar, del cierre de mes al parte de turno",
      "Tu semana con IA: 4 horas y 25 minutos al mes y un plan de 30 días",
    ],
    destino: "/gm",
    cta: "Abrir la guía",
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

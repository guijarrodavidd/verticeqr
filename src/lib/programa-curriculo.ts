// Estructura del programa Director con Claude (aparte de Vértice).
// Cada módulo se abre a los `abre` días del alta del alumno: la semana 1 al
// entrar, la 2 a los 7, la 3 a los 14, la 4 a los 21 y el día 21 a los 28.
// Una lección con `listo: false` sale en el índice como «En preparación».

export type Plan = "director" | "hotel";

export type Leccion = {
  slug: string;
  numero?: number; // el día del programa (1 a 21)
  titulo: string;
  resumen: string;
  video?: string; // enlace de Loom
  listo: boolean;
  // "auditoria": el punto de partida, que se marca solo al enviarlo.
  // "documento": el documento de trabajo con el que acaba cada semana.
  tipo?: "auditoria" | "documento";
};

export type Modulo = {
  id: string;
  titulo: string;
  subtitulo: string;
  abre: number;
  soloPlan?: Plan;
  compacto?: boolean; // la biblioteca: lecciones cortas, en rejilla
  lecciones: Leccion[];
};

export type Recurso = {
  titulo: string;
  semana: string;
  abre: number;
  archivo?: string; // clave de DESCARGAS; sin archivo, «En preparación»
};

const documento = (semana: number): Leccion => ({
  slug: `documento-${semana}`,
  titulo: "Revisión de la semana",
  resumen: `El documento de trabajo de la semana ${semana}: lo que has dejado funcionando y las horas que te devuelve.`,
  listo: false,
  tipo: "documento",
});

const dia = (numero: number, titulo: string, resumen: string, listo = false): Leccion => ({
  slug: `dia-${String(numero).padStart(2, "0")}`,
  numero,
  titulo,
  resumen,
  listo,
});

export const MODULOS: Modulo[] = [
  {
    id: "inicio",
    titulo: "Antes de empezar",
    subtitulo: "Cómo funciona el programa",
    abre: 0,
    lecciones: [
      {
        slug: "bienvenida",
        titulo: "Bienvenida",
        resumen: "Cómo se abren las semanas y dónde está todo.",
        listo: true,
      },
    ],
  },
  {
    id: "biblioteca",
    titulo: "Biblioteca de Claude",
    subtitulo: "Lo básico de Claude, explicado para el día a día de un hotel. Vídeos de uno a tres minutos.",
    abre: 0,
    compacto: true,
    lecciones: [
      { slug: "b-cuenta", titulo: "Tu cuenta, en el ordenador y en el móvil", resumen: "La misma conversación te sigue de la oficina a la ronda por el hotel.", listo: false },
      { slug: "b-plan", titulo: "Qué plan de Claude te sale a cuenta", resumen: "Gratis, Pro o el de empresa, y cuándo compensa pagar con lo que usa un director.", listo: false },
      { slug: "b-datos", titulo: "Lo que puedes pegarle y lo que nunca", resumen: "Totales sí, nombres de huéspedes y nóminas no. La regla que firma tu equipo.", listo: false },
      { slug: "b-chat", titulo: "Reintentar y editar cuando no te convence", resumen: "Tres versiones de un correo en un minuto y te quedas con lo mejor de cada una.", listo: false },
      { slug: "b-archivos", titulo: "Subirle un Excel y que te lo explique", resumen: "El informe del programa de reservas, la carta en PDF o la foto de la pizarra de cocina.", listo: false },
      { slug: "b-artefactos", titulo: "Documentos que se quedan: los artefactos", resumen: "El cuadrante o el informe en una ventana aparte que copias, editas y descargas.", listo: false },
      { slug: "b-descargar", titulo: "Sacarlo a Word, Excel o PDF", resumen: "Lo que te prepara Claude, listo para mandar a la propiedad sin rehacerlo.", listo: false },
      { slug: "b-proyecto", titulo: "Proyectos: que Claude se sepa tu hotel", resumen: "Subes la ficha una vez y deja de contestarte como si fuera un hotel cualquiera.", listo: false },
      { slug: "b-instrucciones", titulo: "Las instrucciones del proyecto, tu manual de estilo", resumen: "De usted o de tú, tu firma y lo que nunca debe prometer a un huésped.", listo: false },
      { slug: "b-estilo", titulo: "Que escriba como tú", resumen: "Le enseñas dos correos tuyos y los siguientes salen con tu tono.", listo: false },
      { slug: "b-voz", titulo: "Dictar en la ronda", resumen: "Hablas mientras recorres el hotel y te devuelve las tareas por departamento.", listo: false },
      { slug: "b-web", titulo: "Que busque en internet por ti", resumen: "Preparar la reunión con un proveedor o ver qué cobra la competencia por la salida tardía.", listo: false },
      { slug: "b-buscar", titulo: "Encontrar lo que hablaste hace un mes", resumen: "Buscar en tus chats y en tus proyectos sin volver a empezar.", listo: false },
      { slug: "b-corregir", titulo: "Cuando se equivoca: cómo corregirle", resumen: "Se le corrige como a alguien del equipo, y qué hacer si te da una cifra que no cuadra.", listo: false },
      { slug: "b-conectar", titulo: "Conectar Claude con tu Google o tu Microsoft", resumen: "Que lea tu correo y tus carpetas sin que le pegues nada.", listo: false },
      { slug: "b-programar", titulo: "Tareas que se hacen solas", resumen: "El resumen del lunes te llega sin pedirlo.", listo: false },
    ],
  },
  {
    id: "semana-1",
    titulo: "Semana 1 · Tu punto de partida",
    subtitulo: "Del nivel 1 al 3",
    abre: 0,
    lecciones: [
      {
        slug: "auditoria",
        titulo: "Tu auditoría",
        resumen: "Tu punto de partida en 3 minutos. Con tus respuestas te preparo tu hoja de ruta.",
        listo: true,
        tipo: "auditoria",
      },
      dia(1, "La radiografía de tu despacho", "Sabes cuántas horas te comen los turnos y los informes, y por dónde empiezas."),
      dia(2, "Cómo pedirle las cosas", "Le pides las cosas para que la respuesta salga bien a la primera.", true),
      dia(3, "La ficha de tu hotel", "Claude conoce tu hotel y cómo trabajas.", true),
      dia(4, "Tu primer agente", "Tu hotel queda dentro de un proyecto y creas tu primer agente."),
      dia(5, "Claude en el bolsillo", "Dictas los partes desde el móvil mientras haces la ronda."),
      documento(1),
    ],
  },
  {
    id: "semana-2",
    titulo: "Semana 2 · Los turnos",
    subtitulo: "Nivel 4",
    abre: 7,
    lecciones: [
      dia(6, "Las reglas de tu equipo", "Contratos, horas, libranzas y mínimos por ocupación quedan en una ficha."),
      dia(7, "El cuadrante de la semana", "El cuadrante sale de la ocupación prevista y de tus reglas."),
      dia(8, "Cuando alguien falla", "Le dices quién falta y te propone el cambio y el mensaje para el equipo."),
      dia(9, "Vacaciones y temporada alta", "El cuadrante del mes cuadra con las vacaciones y los picos."),
      dia(10, "Revisarlo y publicarlo", "Compruebas horas y descansos y lo cuelgas para tu equipo."),
      documento(2),
    ],
  },
  {
    id: "semana-3",
    titulo: "Semana 3 · Los informes",
    subtitulo: "Nivel 5",
    abre: 14,
    lecciones: [
      dia(11, "Los informes que haces hoy", "Tienes el mapa de lo que haces cada día, cada semana y cada mes."),
      dia(12, "El parte de tus jefes", "Tus jefes mandan el parte con un formulario, todos con el mismo formato."),
      dia(13, "El cierre de mes", "Subes los totales y Claude te marca lo que no cuadra."),
      dia(14, "El informe para los dueños", "El informe queda en una página, con tu firma."),
      dia(15, "Lo real contra el presupuesto", "Cada desviación sale con su explicación."),
      documento(3),
    ],
  },
  {
    id: "semana-4",
    titulo: "Semana 4 · En automático",
    subtitulo: "Niveles 6 y 7",
    abre: 21,
    lecciones: [
      dia(16, "Tu carpeta y tus formularios", "Lo que te manda tu equipo cae solo en una carpeta de tu Google."),
      dia(17, "Claude conectado a tu Google", "Tus agentes leen esa carpeta sin que les pases nada."),
      dia(18, "Tu primera tarea programada", "El resumen del lunes te llega solo, sin que lo pidas."),
      dia(19, "Tu registro", "Cada tarea queda apuntada y ves el tiempo que te devuelve."),
      dia(20, "Dos agentes encadenados", "El cierre de mes va de los números al informe para los dueños sin que lo toques."),
      documento(4),
    ],
  },
  {
    id: "final",
    titulo: "Día 21 · Método Fricción 0",
    subtitulo: "Ya lo haces tú solo",
    abre: 28,
    lecciones: [
      dia(21, "Tu agente, de principio a fin", "Conviertes cualquier tarea de tu hotel en tu propio agente y repites la radiografía del día 1."),
    ],
  },
  {
    id: "avanzado",
    titulo: "Avanzado · Tu equipo con Claude",
    subtitulo: "Para ti, tu número dos y tus jefes de departamento",
    abre: 14,
    soloPlan: "hotel",
    lecciones: [
      { slug: "a-jefes", titulo: "Cada jefe con Claude en su área", resumen: "De recepción a mantenimiento, cada uno con su asistente.", listo: false },
      { slug: "a-parte", titulo: "El parte semanal de cada departamento", resumen: "Todos con el mismo formato, y tu asistente del cierre los junta.", listo: false },
      { slug: "a-cuadrante", titulo: "El cuadrante de cada departamento", resumen: "Cada jefe rehace el suyo sin pasar por ti.", listo: false },
      { slug: "a-manuales", titulo: "Los manuales para el que entra nuevo", resumen: "Los escribe quien sabe hacer el trabajo.", listo: false },
      { slug: "a-politica", titulo: "La política de IA del hotel", resumen: "Todo el equipo firma la misma.", listo: false },
    ],
  },
];

export const RECURSOS: Recurso[] = [
  { titulo: "Plantilla de la ficha del hotel (Word)", semana: "Semana 1", abre: 0, archivo: "ficha-del-hotel" },
  { titulo: "Ficha del Hotel Brisalta rellena, de ejemplo (Word)", semana: "Semana 1", abre: 0, archivo: "ficha-brisalta" },
  { titulo: "6 asistentes por departamento", semana: "Semana 1", abre: 0 },
  { titulo: "Plantilla del cuadrante", semana: "Semana 2", abre: 7 },
  { titulo: "Plantillas del informe del mes y de la presentación para los dueños", semana: "Semana 3", abre: 14 },
  { titulo: "El Excel del presupuesto del año que viene", semana: "Semana 3", abre: 14 },
  { titulo: "Plantilla de propuestas para grupos y eventos", semana: "Semana 3", abre: 14 },
  { titulo: "La política de IA del hotel", semana: "Semana 4", abre: 21 },
  { titulo: "El Método Fricción 0 en una página", semana: "Día 21", abre: 28 },
];

// Los archivos viven en privado/programa/ (fuera de public/): solo se
// descargan con sesión de alumno y con su semana abierta.
export const DESCARGAS: Record<string, { fichero: string; nombre: string }> = {
  "ficha-del-hotel": { fichero: "ficha-del-hotel.docx", nombre: "Ficha del hotel.docx" },
  "ficha-brisalta": { fichero: "ficha-hotel-brisalta.docx", nombre: "Ficha del Hotel Brisalta.docx" },
};

export const TOTAL_DIAS = 21;

// ---------- Fechas ----------

// Hoy en España, como "AAAA-MM-DD".
export function hoyMadrid(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
}

export function sumarDias(fecha: string, dias: number): string {
  const d = new Date(`${fecha}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function fechaLarga(fecha: string): string {
  return new Intl.DateTimeFormat("es-ES", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(
    new Date(`${fecha}T00:00:00Z`),
  ).replace(",", "");
}

// "20 nov", para las casillas del planning.
export function fechaCorta(fecha: string): string {
  return new Intl.DateTimeFormat("es-ES", { timeZone: "UTC", day: "numeric", month: "short" })
    .format(new Date(`${fecha}T00:00:00Z`))
    .replace(".", "");
}

export function fechaApertura(alta: string, abre: number): string {
  return sumarDias(alta, abre);
}

export function estaAbierto(alta: string, abre: number, hoy = hoyMadrid()): boolean {
  return hoy >= fechaApertura(alta, abre);
}

export function puedeVer(modulo: Modulo, plan: Plan): boolean {
  return !modulo.soloPlan || modulo.soloPlan === plan;
}

export function buscarLeccion(slug: string): { modulo: Modulo; leccion: Leccion; indice: number } | null {
  for (const modulo of MODULOS) {
    const indice = modulo.lecciones.findIndex((l) => l.slug === slug);
    if (indice >= 0) return { modulo, leccion: modulo.lecciones[indice], indice };
  }
  return null;
}

// Las lecciones en orden de lectura, para «anterior» y «siguiente».
export function leccionesEnOrden(plan: Plan): Leccion[] {
  const orden = ["inicio", "semana-1", "semana-2", "semana-3", "semana-4", "final", "avanzado"];
  return orden
    .map((id) => MODULOS.find((m) => m.id === id)!)
    .filter((m) => puedeVer(m, plan))
    .flatMap((m) => m.lecciones);
}

// La semana en la que va el alumno según su alta (1 a 4, o 5 si ya está el día 21).
export function semanaActual(alta: string, hoy = hoyMadrid()): number {
  const semanas = MODULOS.filter((m) => m.id.startsWith("semana-") || m.id === "final");
  let n = 0;
  semanas.forEach((m, i) => {
    if (estaAbierto(alta, m.abre, hoy)) n = i + 1;
  });
  return n;
}

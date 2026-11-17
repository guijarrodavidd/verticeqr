// La auditoría de la Implantación con Héctor: la escribe el alumno antes de la
// llamada de 90 minutos. Casi todo es para escribir con calma (o dictar); los
// toques solo para los datos que no necesitan explicación. Una pregunta por
// pantalla, con el apartado encima. Los ejemplos cambian según su puesto.

export type Respuestas = Record<string, string[]>;

// Donde se guarda la auditoría a medias en el navegador del alumno.
export const BORRADOR = "dc-auditoria-implantacion";

export type Pregunta = {
  id: string;
  apartado: string;
  texto: string;
  tipo: "toque" | "varias" | "escribir" | "corta";
  ayuda?: string;
  opciones?: string[];
  opcional?: boolean;
  // Ejemplo para quien dirige el hotel y para un jefe de área.
  ejemplo?: { director: string; jefe: string };
  marcador?: string;
  // Solo se pregunta si se cumple.
  si?: (r: Respuestas) => boolean;
};

export const JEFE_DE_AREA = "Jefe de un área";
const primera = (r: Respuestas, id: string) => r[id]?.[0] ?? "";
export const perfil = (r: Respuestas) => (primera(r, "puesto") === JEFE_DE_AREA ? "jefe" : "director");

const OTRA_SI = "Sí, te cuento otra";
const OTRA_NO = "No, con esta vale";

type Tarea = { que: [string, string]; como: [string, string]; reglas: [string, string]; mal: [string, string] };

function tarea(n: number, apartado: string, ej: Tarea, si?: (r: Respuestas) => boolean): Pregunta[] {
  const p = `t${n}_`;
  return [
    {
      id: `${p}que`,
      apartado,
      texto: n === 1 ? "¿Qué tarea te quitarías primero? ¿Quién la hace y quién la recibe?" : "¿Qué tarea es? ¿Quién la hace y quién la recibe?",
      tipo: "escribir",
      ejemplo: { director: ej.que[0], jefe: ej.que[1] },
      si,
    },
    {
      id: `${p}como`,
      apartado,
      texto: "Cuéntame cómo se hace hoy, paso a paso.",
      ayuda: "Qué programas abres, qué copias y adónde, y a quién se lo mandas.",
      tipo: "escribir",
      ejemplo: { director: ej.como[0], jefe: ej.como[1] },
      si,
    },
    {
      id: `${p}reglas`,
      apartado,
      texto: "¿Qué reglas sigues que no están escritas en ningún sitio?",
      ayuda: "Lo que sabes tú y no sabría alguien que entra nuevo.",
      tipo: "escribir",
      ejemplo: { director: ej.reglas[0], jefe: ej.reglas[1] },
      si,
    },
    {
      id: `${p}mal`,
      apartado,
      texto: "¿Qué pasa cuando sale mal o tarde? Cuéntame una vez que pasó.",
      tipo: "escribir",
      ejemplo: { director: ej.mal[0], jefe: ej.mal[1] },
      si,
    },
    {
      id: `${p}tiempo`,
      apartado,
      texto: "¿Cuánto tiempo te lleva y cada cuánto?",
      tipo: "corta",
      marcador: "Ej.: unas 12 horas, una vez al mes",
      si,
    },
  ];
}

const EJ_TAREA_1: Tarea = {
  que: [
    "El cierre de mes. Lo hago yo con la de administración y lo reciben los dueños.",
    "El informe de la competencia. Lo hago yo y lo recibe el director cada lunes.",
  ],
  como: [
    "Saco del programa de reservas el informe de producción del mes en Excel. Copio los totales a mi plantilla, pido a contabilidad los gastos, lo comparo con el presupuesto, escribo un resumen y lo mando por correo con el Excel adjunto.",
    "Entro en Booking y en la web de cinco hoteles, apunto el precio de la doble de los próximos 14 días en un Excel, coloreo lo que está por encima o por debajo y se lo mando al director.",
  ],
  reglas: [
    "Si una partida se desvía más de un 10 % del presupuesto, la explico. El spa lo separo de habitaciones aunque el programa lo junte.",
    "Si la competencia baja más de 15 € y vamos por encima del 80 % de ocupación, no bajo. Los sábados de agosto no miro la competencia.",
  ],
  mal: [
    "En marzo mandé el cierre con el spa contado dos veces. Me llamaron los dueños y tuve que rehacerlo un sábado.",
    "En un puente dejé la doble 20 € por debajo de la competencia dos días porque no lo vi a tiempo.",
  ],
};

const EJ_TAREA_2: Tarea = {
  que: [
    "Las propuestas a grupos. Las prepara la comercial y las firmo yo.",
    "El ritmo de reservas de cada mañana. Lo hago yo para mí y para el director.",
  ],
  como: [
    "Llega el correo, la comercial mira la disponibilidad en el programa, calcula con las tarifas de grupo en una hoja y me pasa la propuesta en Word para que la revise.",
    "Saco del programa las reservas que entraron ayer, las pego en mi Excel, las comparo con la misma fecha del año pasado y marco los días que van lentos.",
  ],
  reglas: [
    "A más de 20 personas entre semana, un 10 % de descuento. El traslado del aeropuerto, en autobuses de 50 plazas.",
    "Si un día va un 20 % por debajo del año pasado a 30 días vista, lo aviso.",
  ],
  mal: [
    "En septiembre un grupo de 40 se fue a otro hotel porque contestamos al tercer día.",
    "Un lunes no lo hice y no vimos que el puente iba lento hasta el jueves.",
  ],
};

export const PREGUNTAS: Pregunta[] = [
  // Tu puesto
  {
    id: "puesto",
    apartado: "Tu puesto",
    texto: "¿Cuál es tu puesto?",
    tipo: "toque",
    opciones: ["Dirección general", "Subdirección o número dos", JEFE_DE_AREA, "Propiedad", "Otro"],
  },
  {
    id: "area",
    apartado: "Tu puesto",
    texto: "¿De qué área?",
    tipo: "corta",
    marcador: "Revenue, recepción, comida y bebida…",
    si: (r) => primera(r, "puesto") === JEFE_DE_AREA,
  },

  // Lo que buscas
  {
    id: "semana",
    apartado: "Lo que buscas",
    texto: "Cuéntame tu semana de verdad, de lunes a domingo. ¿Qué haces en la oficina y cuánto te lleva cada cosa?",
    ayuda: "Día a día y con las horas aproximadas. Incluye lo que haces fuera de hora: noches, domingos, vacaciones.",
    tipo: "escribir",
    ejemplo: {
      director:
        "Lunes, 2 horas juntando los partes de los jefes para la reunión de las 10. Martes y miércoles, correos de grupos, unas 3 horas. Jueves, el cuadrante con la jefa de pisos, toda la tarde. Viernes, facturas. Y a fin de mes el cierre, que me lleva el sábado y parte del domingo.",
      jefe:
        "Cada mañana, una hora sacando el ritmo de reservas del programa y pasándolo a mi Excel. Los lunes, 2 horas con los precios de la competencia, hotel por hotel. Los miércoles, el informe para el director. Y cada mes la previsión, que me lleva un día entero.",
    },
  },
  {
    id: "dia90",
    apartado: "Lo que buscas",
    texto: "Imagina que han pasado 90 días y ha salido bien. Descríbeme un lunes: a qué hora llegas, qué tienes ya hecho y dónde estás.",
    ayuda: "Cuanto más concreto, mejor. Es lo que vamos a medir.",
    tipo: "escribir",
    ejemplo: {
      director:
        "Llego a las 8 y en el móvil tengo la semana de los jefes en una página. A las 9 estoy en el restaurante con el desayuno, no en la oficina. El cierre de octubre lo mandé el día 3 y el domingo no abrí el ordenador.",
      jefe:
        "A las 8:30 tengo el ritmo de reservas y la competencia en una página. En media hora decido los precios del fin de semana y el resto de la mañana lo dedico a grupos y canales.",
    },
  },
  {
    id: "rendir",
    apartado: "Lo que buscas",
    texto: "¿Ante quién respondes de tu trabajo y qué quieres poder enseñarle el día 90?",
    ayuda: "Escríbelo como se lo dirías en la reunión.",
    tipo: "escribir",
    ejemplo: {
      director:
        "A los dueños: «El cierre os llega antes del día 5 y el equipo ha dejado de pasar 19 horas a la semana en la oficina. Ese tiempo está ahora en la operación».",
      jefe: "Al director: «El ritmo de reservas y la competencia salen solos cada mañana, y yo dedico ese tiempo a decidir precios».",
    },
  },
  {
    id: "porque",
    apartado: "Lo que buscas",
    texto: "¿Por qué ahora? ¿Qué ha pasado para que quieras hacerlo ya?",
    tipo: "escribir",
    ejemplo: {
      director: "Este verano perdimos dos grupos por contestar tarde, y los dueños me han pedido una persona menos en administración.",
      jefe: "Llevo dos fines de semana poniendo precios a ojo porque no me da tiempo a mirar la competencia.",
    },
  },
  {
    id: "probado",
    apartado: "Lo que buscas",
    texto: "¿Qué has probado ya y cómo te fue?",
    ayuda: "ChatGPT, algún programa, una consultora, un Excel con macros… Lo que no funcionó también me sirve.",
    tipo: "escribir",
    ejemplo: {
      director: "Uso ChatGPT para algún correo. Probamos un programa de turnos y el equipo lo dejó a los dos meses porque había que meterlo todo a mano.",
      jefe: "Tengo un Excel con macros que hizo quien estaba antes que yo. Cuando se rompe, no sé arreglarlo.",
    },
  },

  // Las tareas
  ...tarea(1, "Tu primera tarea", EJ_TAREA_1),
  {
    id: "otra2",
    apartado: "Otra tarea",
    texto: "¿Hay otra tarea que te pese y quieras contarme?",
    tipo: "toque",
    opciones: [OTRA_SI, OTRA_NO],
  },
  ...tarea(2, "Tu segunda tarea", EJ_TAREA_2, (r) => primera(r, "otra2") === OTRA_SI),
  {
    id: "otra3",
    apartado: "Otra tarea",
    texto: "¿Y una tercera?",
    tipo: "toque",
    opciones: [OTRA_SI, OTRA_NO],
    si: (r) => primera(r, "otra2") === OTRA_SI,
  },
  ...tarea(3, "Tu tercera tarea", EJ_TAREA_2, (r) => primera(r, "otra2") === OTRA_SI && primera(r, "otra3") === OTRA_SI),

  // Tu equipo
  {
    id: "equipo",
    apartado: "Tu equipo",
    texto: "Háblame de tu equipo y de las personas con las que trabajas cada semana: qué te mandan, cómo te lo mandan y qué echas en falta.",
    ayuda: "Por cargos, sin nombres.",
    tipo: "escribir",
    ejemplo: {
      director:
        "Cinco jefes: recepción, pisos, cocina, mantenimiento y comercial. Me mandan el parte por WhatsApp cuando se acuerdan, cada uno a su manera. Me falta tenerlo todo junto el lunes.",
      jefe:
        "Trabajo con el director, recepción y comercial. Recepción me pasa las cancelaciones por correo y comercial los grupos de palabra. Me falta enterarme de los grupos antes de que estén cerrados.",
    },
  },
  {
    id: "ganas",
    apartado: "Tu equipo",
    texto: "¿Quién crees que lo va a usar con ganas y a quién le va a costar? ¿Por qué?",
    ayuda: "Por cargos.",
    tipo: "escribir",
    ejemplo: {
      director: "La jefa de pisos, con ganas: el cuadrante la mata. Al de mantenimiento le va a costar, no es de móvil.",
      jefe: "Recepción lo va a usar. A comercial le cuesta mandar nada por escrito.",
    },
  },

  // Lo técnico
  {
    id: "claude",
    apartado: "Lo técnico",
    texto: "¿Qué cuenta de Claude tienes?",
    tipo: "toque",
    opciones: ["No tengo", "Gratis", "Pro", "Max", "Team o Empresa", "No lo sé"],
  },
  {
    id: "correo",
    apartado: "Lo técnico",
    texto: "¿El correo del hotel es de Google o de Microsoft?",
    tipo: "toque",
    opciones: ["Google (Gmail)", "Microsoft (Outlook)", "Otro", "No lo sé"],
  },
  {
    id: "aparatos",
    apartado: "Lo técnico",
    texto: "¿Con qué trabajas?",
    ayuda: "Marca todos los que uses.",
    tipo: "varias",
    opciones: ["Ordenador con Windows", "Mac", "iPhone", "Móvil Android"],
  },
  {
    id: "programas",
    apartado: "Lo técnico",
    texto: "Escríbeme todos los programas que usáis y para qué.",
    ayuda: "Reservas, caja del restaurante, turnos, contabilidad, reseñas… Si algo va en Excel o en papel, dímelo también.",
    tipo: "escribir",
    ejemplo: {
      director:
        "Reservas: Avirato. Caja del restaurante: Ágora. Turnos: en Excel. Contabilidad: A3, la lleva una gestoría. Reseñas: las miro en Google y en Booking directamente.",
      jefe: "Reservas: Mews. Las tarifas las subo a los canales con SiteMinder. La competencia, a mano. Los informes, en Excel.",
    },
  },
  {
    id: "informes",
    apartado: "Lo técnico",
    texto: "¿Qué informes sacas del programa de reservas y cómo los sacas? ¿Te llega alguno solo al correo?",
    tipo: "escribir",
    ejemplo: {
      director:
        "El de producción del mes y el de ocupación de cada día, los dos en Excel desde el menú de informes. Cada mañana me llega solo al correo un PDF con las llegadas.",
      jefe: "Las reservas creadas por día y las cancelaciones, en CSV. No me llega nada solo, todo lo saco a mano.",
    },
  },
  {
    id: "comunicacion",
    apartado: "Lo técnico",
    texto: "¿Cómo os comunicáis en el equipo? ¿Qué va por WhatsApp, qué por correo y qué en persona?",
    tipo: "escribir",
    ejemplo: {
      director: "Un grupo de WhatsApp por departamento y otro de jefes. Lo oficial, por correo. Los cambios de turno, en persona o por llamada.",
      jefe: "Con el director, por correo y WhatsApp. Con recepción, en persona.",
    },
  },
  {
    id: "informatica",
    apartado: "Lo técnico",
    texto: "¿Quién lleva la informática del hotel y quién puede dar permisos para conectar cosas?",
    tipo: "escribir",
    ejemplo: {
      director: "Una empresa de fuera que viene cuando hay algo. Los permisos del correo los tengo yo.",
      jefe: "La cadena tiene un departamento de informática. Para conectar algo hay que pedírselo al director y él lo pide.",
    },
  },

  // Para acabar
  {
    id: "limites",
    apartado: "Para acabar",
    texto: "¿Hay algo que no quieras delegar nunca, o alguna norma de datos que tengamos que respetar?",
    tipo: "escribir",
    opcional: true,
    ejemplo: {
      director: "Las respuestas a reseñas de una estrella las quiero leer yo siempre. La cadena no deja meter nombres de huéspedes en ninguna herramienta.",
      jefe: "Los precios los decido yo, que me lo prepare pero que no cambie nada.",
    },
  },
  {
    id: "carpeta",
    apartado: "Para acabar",
    texto: "Si ya tienes una carpeta con informes y plantillas, pega aquí el enlace.",
    ayuda: "Si no la tienes, sáltala.",
    tipo: "corta",
    opcional: true,
    marcador: "https://drive.google.com/…",
  },
];

export const visibles = (r: Respuestas) => PREGUNTAS.filter((p) => !p.si || p.si(r));

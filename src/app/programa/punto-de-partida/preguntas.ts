// «Tu auditoría» (el punto de partida): la entrega quien entra en el programa
// Director con Claude. Breve, una pregunta por pantalla: lo básico de un toque
// y cuatro preguntas abiertas para que lo cuente con sus palabras (se puede
// dictar con el micrófono del móvil). Con las respuestas, Héctor le prepara su
// hoja de ruta.

export type Pregunta = {
  id: string;
  texto: string;
  ayuda?: string;
  multiple?: boolean;
  libre?: boolean;
  opcional?: boolean;
  ejemplo?: string;
  // Las opciones salen de lo que marcó en otra pregunta.
  desde?: string;
  opciones: string[];
};

export const TAREAS = [
  "El cierre de mes",
  "El informe para la propiedad",
  "Los correos de reservas",
  "Contestar reseñas",
  "Los cuadrantes y turnos",
  "Facturas y cobros",
  "Comunicados al equipo",
  "Previsiones y presupuesto",
];

const DICTAR = "Cuéntamelo como me lo contarías a mí. Si te es más fácil, díctalo con el micrófono del teclado.";

export const PREGUNTAS: Pregunta[] = [
  {
    id: "momento",
    texto: "¿En qué momento estás?",
    opciones: ["Dirijo un hotel", "Voy a entrar en un hotel", "Estoy entre hoteles"],
  },
  {
    id: "puesto",
    texto: "¿Cuál es tu puesto?",
    ayuda: "El de ahora o el que vas a tener.",
    opciones: ["Dirección general", "Subdirección o número dos", "Jefatura de un área", "Propiedad", "Otro"],
  },
  {
    id: "habitaciones",
    texto: "¿Cuántas habitaciones tiene el hotel?",
    ayuda: "Si llevas varios, el principal.",
    opciones: ["Menos de 50", "De 50 a 150", "De 150 a 300", "Más de 300"],
  },
  {
    id: "tareas",
    texto: "¿Qué te quita más tiempo de despacho?",
    ayuda: "Marca todas las que quieras.",
    multiple: true,
    opciones: TAREAS,
  },
  {
    id: "principal",
    texto: "Si pudieras quitarte solo una, ¿cuál sería?",
    ayuda: "Con esta vas a montar tu primer agente.",
    desde: "tareas",
    opciones: TAREAS,
  },
  {
    id: "como_hoy",
    texto: "¿Cómo la haces hoy, paso a paso?",
    ayuda: DICTAR,
    libre: true,
    ejemplo:
      "Ej.: el lunes saco tres informes del programa de reservas, copio los números a un Excel, lo reviso con recepción y se lo mando a la propiedad. Se me va la mañana entera.",
    opciones: [],
  },
  {
    id: "semana",
    texto: "¿Y el resto de tu semana en el despacho?",
    ayuda: "Qué haces y cuánto te lleva más o menos. " + DICTAR,
    libre: true,
    ejemplo: "Ej.: unas 2 horas al día de correos, el cuadrante los jueves, reseñas cuando saco un rato y el cierre me lleva dos días a final de mes.",
    opciones: [],
  },
  {
    id: "objetivo",
    texto: "Al acabar los 21 días, ¿qué te gustaría tener funcionando?",
    ayuda: DICTAR,
    libre: true,
    ejemplo: "Ej.: que el informe del lunes salga solo y yo solo lo revise, y llegar al cierre de mes sin quedarme hasta las 10 de la noche.",
    opciones: [],
  },
  {
    id: "freno",
    texto: "¿Qué te preocupa o te frena de usar la IA en tu hotel?",
    ayuda: "Si no te preocupa nada, sáltala.",
    libre: true,
    opcional: true,
    ejemplo: "Ej.: no sé qué datos puedo meterle, y mi equipo no es muy de tecnología.",
    opciones: [],
  },
  {
    id: "ofimatica",
    texto: "¿Dónde tenéis el correo y los documentos?",
    ayuda: "Lo necesito para la semana 4, cuando conectes Claude con tus cosas.",
    opciones: ["En Google (Gmail y Drive)", "En Microsoft (Outlook y OneDrive)", "Un poco en cada uno", "En el ordenador"],
  },
];

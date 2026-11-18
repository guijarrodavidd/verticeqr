// Formulario de /conectar (y conectar.verticeqr.com): qué programas usa el
// hotel y qué hay que conectar con Vértice. Todo se elige con un clic; si la
// respuesta es «Otro», se escribe al lado.

export type Pregunta = {
  id: string;
  texto: string;
  ayuda?: string;
  multiple?: boolean;
  opciones: string[];
  // Texto del campo libre que sale debajo de las opciones.
  otro?: string;
};

export const PREGUNTAS: Pregunta[] = [
  {
    id: "reservas",
    texto: "¿Qué programa de reservas usa el hotel?",
    opciones: ["Avirato", "Cloudbeds", "Mews", "Opera", "Sihot", "Ulyses", "Otro"],
    otro: "Si es otro, ¿cuál?",
  },
  {
    id: "api",
    texto: "¿Ese programa se puede conectar con otros (API)?",
    ayuda: "Suele verse en los ajustes, en un apartado de integraciones o API. Si no lo sabes, marca «No lo sé».",
    opciones: ["Sí", "No", "No lo sé"],
  },
  {
    id: "para",
    texto: "¿Qué tiene que hacer Vértice con el programa de reservas?",
    ayuda: "Puedes marcar varias.",
    multiple: true,
    opciones: [
      "Cargar los pedidos a la habitación",
      "Saber quién está alojado y en qué habitación",
      "Mandar mensajes a los huéspedes",
      "Pasar las reservas de spa o experiencias",
      "No lo sé todavía",
    ],
  },
  {
    id: "caja",
    texto: "¿Qué caja o punto de venta usa el restaurante o el bar?",
    opciones: ["Ágora", "Glop", "Infocaja", "Revo", "La del programa de reservas", "No tenemos", "Otra"],
    otro: "Si es otra, ¿cuál?",
  },
  {
    id: "mensajes",
    texto: "¿Por dónde se habla hoy con los huéspedes?",
    ayuda: "Puedes marcar varias.",
    multiple: true,
    opciones: ["WhatsApp del hotel", "La mensajería del programa de reservas", "Correo", "Teléfono", "Otra herramienta"],
    otro: "Si es otra herramienta, ¿cuál?",
  },
  {
    id: "spa",
    texto: "¿Cómo se reservan hoy el spa y las experiencias?",
    opciones: ["En una agenda o un Excel", "En Google Calendar", "En un programa de spa", "Llamando al proveedor", "No tenemos"],
    otro: "Si es un programa, ¿cuál?",
  },
  {
    id: "acceso",
    texto: "¿Quién nos puede dar acceso a estos programas?",
    opciones: ["Yo", "Informática o la cadena", "El proveedor del programa", "No lo sé"],
  },
];

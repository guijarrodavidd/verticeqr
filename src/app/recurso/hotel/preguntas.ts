// Cuestionario de /recurso/hotel. Todo se elige con un clic salvo el nombre
// del hotel: con eso se monta la demo y se prepara la llamada.

export type Pregunta = {
  id: string;
  texto: string;
  ayuda?: string;
  multiple?: boolean;
  opciones: string[];
};

export const PREGUNTAS: Pregunta[] = [
  {
    id: "hoteles",
    texto: "¿Cuántos hoteles gestionas?",
    opciones: ["1", "De 2 a 5", "De 6 a 20", "Más de 20"],
  },
  {
    id: "puesto",
    texto: "¿Cuál es tu puesto?",
    opciones: ["Director/a general", "Dirección de F&B", "Propiedad", "Otro"],
  },
  {
    id: "tipo",
    texto: "¿Cómo es el hotel?",
    ayuda: "Si son varios, el hotel donde lo probarías.",
    opciones: ["Urbano", "Vacacional", "Resort"],
  },
  {
    id: "habitaciones",
    texto: "¿Cuántas habitaciones tiene?",
    opciones: ["Menos de 50", "50-150", "150-300", "Más de 300"],
  },
  {
    id: "vende",
    texto: "¿Qué vendéis además de la habitación?",
    ayuda: "Puedes marcar varias.",
    multiple: true,
    opciones: ["Restaurante", "Bar o terraza", "Room service", "Spa", "Experiencias", "Productos o tienda", "Parking o traslados"],
  },
  {
    id: "pide",
    texto: "Hoy, ¿cómo pide un huésped algo a la habitación o a la piscina?",
    opciones: ["Llamando a recepción", "Por WhatsApp", "Con un QR que abre un PDF", "Con la app de la cadena", "No se puede"],
  },
  {
    id: "objetivo",
    texto: "¿Qué es lo que más te están pidiendo ahora?",
    opciones: ["Subir el ingreso por huésped", "Bajar costes de personal", "Mejorar las reseñas", "Llegar al cierre de mes con mejores números"],
  },
  {
    id: "mas",
    texto: "¿Qué te gustaría vender más?",
    ayuda: "Puedes marcar varias.",
    multiple: true,
    opciones: ["Room service", "Restaurante", "Bar", "Experiencias", "Spa", "Productos", "Mejoras de habitación o salida tardía"],
  },
  {
    id: "decide",
    texto: "Si funciona en tu hotel, ¿quién más tendría que verlo?",
    opciones: ["Nadie, decido yo", "Dirección general", "Corporativo o cadena", "La propiedad"],
  },
];

// Del «Punto de partida» de cada alumno a su aula: los días que más le sirven
// según la tarea que quiere quitarse primero, y un consejo según lo que le frena.

export const DIAS_POR_TAREA: Record<string, number[]> = {
  "El cierre de mes": [13, 20],
  "El informe para la propiedad": [14, 15, 20],
  "Los correos de reservas": [2, 4],
  "Contestar reseñas": [4],
  "Los cuadrantes y turnos": [6, 7, 8, 9, 10],
  "Facturas y cobros": [11, 16],
  "Comunicados al equipo": [5, 8],
  "Previsiones y presupuesto": [15],
};

export const CONSEJO_POR_FRENO: Record<string, string> = {
  "Sacar tiempo":
    "Haz cada lección a la misma hora, con el ordenador ya abierto. Si un día no puedes, la lección te espera.",
  "No me llevo bien con la tecnología":
    "Cuando no encuentres un botón, ve a la Biblioteca de Claude. Y si te atascas, escríbeme por WhatsApp.",
  "Meter datos del hotel":
    "Trabajas con totales y con tus notas, nunca con datos de huéspedes. Las reglas las tienes el día 1.",
  "Ya lo probé y no me sirvió":
    "Te salía genérico porque no conocía tu hotel. El día 3 le das la ficha y desde ahí te contesta con tus servicios y tu tono.",
  "Nada, tengo ganas":
    "Si acabas la semana antes de tiempo, adelanta tu ficha del hotel y repasa la biblioteca.",
};

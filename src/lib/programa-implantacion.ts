// La mentoría «Implantación con Héctor»: 52 lecciones repartidas por llamadas en 6 meses.
// Generado por curso-director-con-claude/oferta/aula-mentoria/generar.py. El vídeo de cada lección
// se añade con su enlace de Loom en `VIDEOS`.
import type { Modulo } from "./programa-curriculo";

// slug de la lección → enlace de Loom, cuando esté grabada.
const VIDEOS: Record<string, string> = {};

const BASE: Modulo[] = [
  {
    id: "imp-0",
    titulo: "Antes de empezar · Tu punto de partida",
    subtitulo: "Antes de la auditoría",
    abre: 0,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-0-1", titulo: "0.1 · El mapa del sistema", resumen: "Saben qué tendrán en el mes 6 y en qué orden lo van a montar.", listo: true },
      { slug: "m-0-2", titulo: "0.2 · Lo que necesitas", resumen: "Tienen preparado todo lo de la lista de requisitos.", listo: true },
      { slug: "m-0-3", titulo: "0.3 · Qué datos sí y cuáles no", resumen: "Tienen el visto bueno de su dirección por escrito.", listo: true },
      { slug: "m-0-4", titulo: "0.4 · Tu auditoría", resumen: "Entregan su auditoría antes de la llamada de 90 minutos.", listo: true },
    ],
  },
  {
    id: "imp-1",
    titulo: "Semana 1 · Tu mesa y tu primer agente",
    subtitulo: "Antes de la llamada 1 y en la llamada 1",
    abre: 2,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-1-1", titulo: "1.1 · Instalar VS Code", resumen: "VS Code abierto y entendido.", listo: true },
      { slug: "m-1-2", titulo: "1.2 · Conectar Claude", resumen: "Claude contesta dentro de VS Code.", listo: true },
      { slug: "m-1-3", titulo: "1.3 · La carpeta de tu hotel", resumen: "El proyecto del hotel con sus cajones.", listo: true },
      { slug: "m-1-4", titulo: "1.4 · Tu primera petición", resumen: "Han hecho un primer cambio y saben aceptar o rechazar.", listo: true },
      { slug: "m-1-5", titulo: "1.5 · Las reglas del proyecto", resumen: "Claude conoce su hotel y cómo quieren trabajar.", listo: true },
      { slug: "m-1-6", titulo: "1.6 · Reglas fijas", resumen: "Dos o tres reglas suyas guardadas para siempre.", listo: true },
      { slug: "m-1-7", titulo: "1.7 · Qué modelo para qué", resumen: "Su regla de modelos escrita y el límite semanal controlado.", listo: true },
      { slug: "m-1-8", titulo: "1.8 · Trabajos grandes", resumen: "Saben planificar antes de construir.", listo: true },
      { slug: "m-1-9", titulo: "1.9 · Puntos de guardado", resumen: "No pueden perder el trabajo.", listo: true },
      { slug: "m-1-10", titulo: "1.10 · La ficha de tu hotel", resumen: "La ficha que leen todos sus agentes.", listo: true },
      { slug: "m-2-1", titulo: "2.1 · Anatomía de un agente", resumen: "La ficha de montaje de su primer agente.", listo: true },
      { slug: "m-2-2", titulo: "2.2 · El programa que lanza los agentes", resumen: "Un programa pequeño que lee las instrucciones, la ficha y las entradas y llama a Claude.", listo: true },
      { slug: "m-2-3", titulo: "2.3 · Sus instrucciones", resumen: "Las instrucciones del primer agente.", listo: true },
      { slug: "m-2-4", titulo: "2.4 · Las reglas de todos", resumen: "Las reglas comunes que leen todos sus agentes.", listo: true },
      { slug: "m-2-5", titulo: "2.5 · Probarlo con una semana real", resumen: "Su primer documento hecho por el agente.", listo: true },
      { slug: "m-2-6", titulo: "2.6 · El Registro", resumen: "Cada agente apunta una fila cada vez que trabaja.", listo: true },
    ],
  },
  {
    id: "imp-2",
    titulo: "Semana 2 · El cierre de mes",
    subtitulo: "Llamada 2",
    abre: 9,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-3-1", titulo: "3.1 · Agentes con dinero", resumen: "El cierre de mes con cifras exactas.", listo: true },
      { slug: "m-3-2", titulo: "3.2 · El revisor", resumen: "Doble comprobación en todo lo que lleva euros.", listo: true },
      { slug: "m-3-3", titulo: "3.3 · El Excel que cambia", resumen: "Su Excel leído tal como lo exportan.", listo: true },
    ],
  },
  {
    id: "imp-3",
    titulo: "Semana 4 · El cuadrante",
    subtitulo: "Llamada 4",
    abre: 23,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-3-4", titulo: "3.4 · Turnos y cuadrantes", resumen: "Su agente del cuadrante.", listo: true },
    ],
  },
  {
    id: "imp-4",
    titulo: "Semana 5 · Tu equipo",
    subtitulo: "Llamada 5",
    abre: 30,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-3-5", titulo: "3.5 · Agentes que leen correo y partes", resumen: "Las bajas de última hora y los partes del equipo, preparados.", listo: true },
    ],
  },
  {
    id: "imp-5",
    titulo: "Semana 6 · Pruebas y agentes nuevos",
    subtitulo: "Llamada 6",
    abre: 37,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-3-6", titulo: "3.6 · El agente que eligen", resumen: "El agente que salió en su plano.", listo: true },
      { slug: "m-3-7", titulo: "3.7 · Pruebas trampa", resumen: "Agentes que no se dejan engañar, probado.", listo: true },
      { slug: "m-3-8", titulo: "3.8 · Un agente nuevo en 20 minutos", resumen: "Su comando para crear agentes siempre igual.", listo: true },
    ],
  },
  {
    id: "imp-6",
    titulo: "Semana 7 · Que trabajen solos",
    subtitulo: "Llamada 7",
    abre: 44,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-4-1", titulo: "4.1 · Cada agente a su hora", resumen: "El resumen llega el lunes a las 8:00 sin tocar nada.", listo: true },
      { slug: "m-4-2", titulo: "4.2 · Dónde vive el sistema", resumen: "El sistema encendido las 24 horas.", listo: true },
      { slug: "m-4-3", titulo: "4.3 · Agentes que saltan cuando llega algo", resumen: "Los agentes por evento funcionando.", listo: true },
      { slug: "m-4-4", titulo: "4.4 · Contraseñas y claves", resumen: "Ninguna clave a la vista.", listo: true },
      { slug: "m-4-5", titulo: "4.5 · Informes programados del programa de reservas", resumen: "Que nadie exporte informes a mano.", listo: true },
    ],
  },
  {
    id: "imp-7",
    titulo: "Semana 8 · El panel de dirección",
    subtitulo: "Llamada 8",
    abre: 51,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-5-1", titulo: "5.1 · Lo que espera tu OK", resumen: "Su panel leyendo lo que preparan los agentes.", listo: true },
      { slug: "m-5-2", titulo: "5.2 · Decidir", resumen: "Deciden desde el panel.", listo: true },
      { slug: "m-5-3", titulo: "5.3 · Cada jefe ve lo suyo", resumen: "El equipo dentro, cada uno con su parte.", listo: true },
      { slug: "m-5-4", titulo: "5.4 · Desde el móvil", resumen: "El panel en el bolsillo.", listo: true },
      { slug: "m-5-5", titulo: "5.5 · Varios hoteles", resumen: "Listo para un grupo.", listo: true },
    ],
  },
  {
    id: "imp-8",
    titulo: "Mes 3 · El panel de control",
    subtitulo: "Llamada 9",
    abre: 60,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-6-1", titulo: "6.1 · El estado de cada agente", resumen: "Ven quién trabaja, quién falla y quién está apagado.", listo: true },
      { slug: "m-6-2", titulo: "6.2 · La oficina en 8 bits", resumen: "Su hotel en corte, con cada agente en su mesa.", listo: true },
    ],
  },
  {
    id: "imp-9",
    titulo: "Mes 3 · Los errores",
    subtitulo: "Llamada 10",
    abre: 74,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-6-3", titulo: "6.3 · Los errores en llano", resumen: "Cada error dice qué ha pasado y a quién le toca.", listo: true },
      { slug: "m-6-4", titulo: "6.4 · El mapa de errores", resumen: "Ven dónde falla su sistema.", listo: true },
    ],
  },
  {
    id: "imp-10",
    titulo: "Mes 4 · El vigía y los avisos",
    subtitulo: "Llamada 11",
    abre: 90,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-6-5", titulo: "6.5 · El vigía", resumen: "Se enteran antes que nadie si algo no salió.", listo: true },
      { slug: "m-6-6", titulo: "6.6 · Los avisos", resumen: "Avisos en el móvil.", listo: true },
      { slug: "m-6-7", titulo: "6.7 · Fallos que se arreglan solos", resumen: "Sin avisos de más.", listo: true },
    ],
  },
  {
    id: "imp-11",
    titulo: "Mes 4 · Lo que gasta y lo que devuelve",
    subtitulo: "Llamada 12",
    abre: 104,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-6-8", titulo: "6.8 · La revisión del lunes", resumen: "Una rutina de mejora cada semana.", listo: true },
      { slug: "m-6-9", titulo: "6.9 · Lo que gasta y lo que devuelve", resumen: "Los números de su sistema para enseñarlos.", listo: true },
    ],
  },
  {
    id: "imp-12",
    titulo: "Mes 5 · La revisión del mes",
    subtitulo: "Llamada 13",
    abre: 120,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-7-1", titulo: "7.1 · La revisión del mes", resumen: "Su rutina mensual.", listo: true },
      { slug: "m-7-2", titulo: "7.2 · Apuntar lo aprendido", resumen: "Un sistema que no repite errores.", listo: true },
    ],
  },
  {
    id: "imp-13",
    titulo: "Mes 6 · Seguir solo",
    subtitulo: "Llamada 14",
    abre: 150,
    soloPlan: "implantacion",
    lecciones: [
      { slug: "m-7-3", titulo: "7.3 · Un agente sin mí", resumen: "La prueba de que saben seguir.", listo: true },
      { slug: "m-7-4", titulo: "7.4 · Cuando sale un modelo nuevo", resumen: "Saben actualizarse sin romper nada.", listo: true },
      { slug: "m-7-5", titulo: "7.5 · El mapa de tu sistema", resumen: "Su sistema documentado.", listo: true },
    ],
  }
];

export const MODULOS_IMPLANTACION: Modulo[] = BASE.map((m) => ({
  ...m,
  lecciones: m.lecciones.map((l) => (VIDEOS[l.slug] ? { ...l, video: VIDEOS[l.slug] } : l)),
}));

export const TOTAL_IMPLANTACION = 52;

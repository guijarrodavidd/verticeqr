// Catálogo de tipos de demo que ofrece VerticeQR.
// Cada entrada se renderiza como un item del sidebar y como una página
// /demos/[slug] con su placeholder. Cuando integremos manualmente el
// diseño real, este array sigue siendo la fuente de verdad — solo cambia
// el contenido de las páginas.

export type TipoDemo = {
  slug: string;
  nombre: string;
  icono: string;
  tagline: string;
  acento: string;
  // Campos placeholder para la maqueta hasta que se integre el diseño real.
  productosEjemplo: string[];
  ticketMedio: string;
};

export const DEMOS: TipoDemo[] = [
  {
    slug: "lounge-club",
    nombre: "Lounge Club",
    icono: "✦",
    tagline: "Carta premium con maridajes, reservados y servicio VIP.",
    acento: "#a78bfa",
    productosEjemplo: ["Champagne Dom Pérignon", "Tabla de quesos curados", "Sushi de autor", "Cócteles signature"],
    ticketMedio: "85 €",
  },
  {
    slug: "cocteleria",
    nombre: "Coctelería",
    icono: "◆",
    tagline: "Cocktails de autor, ingredientes frescos y carta dinámica.",
    acento: "#f472b6",
    productosEjemplo: ["Old Fashioned", "Espresso Martini", "Margarita ahumada", "Mocktail temporada"],
    ticketMedio: "22 €",
  },
  {
    slug: "pub",
    nombre: "Pub",
    icono: "◐",
    tagline: "Cervezas de grifo, raciones y ambiente para grupo.",
    acento: "#fbbf24",
    productosEjemplo: ["IPA local", "Pinta Guinness", "Patatas bravas", "Hamburguesa de la casa"],
    ticketMedio: "14 €",
  },
  {
    slug: "bar-restaurante",
    nombre: "Bar / Restaurante",
    icono: "▢",
    tagline: "Menú del día, tapas y carta completa noche.",
    acento: "#4ade80",
    productosEjemplo: ["Menú del día", "Tapa de jamón", "Pulpo a la gallega", "Solomillo al pimienta"],
    ticketMedio: "18 €",
  },
  {
    slug: "cafeteria",
    nombre: "Cafetería",
    icono: "◯",
    tagline: "Specialty coffee, brunch y bollería artesana.",
    acento: "#fb923c",
    productosEjemplo: ["Flat White", "Tostada de aguacate", "Croissant artesano", "Té matcha latte"],
    ticketMedio: "9 €",
  },
  {
    slug: "discoteca",
    nombre: "Discoteca",
    icono: "✧",
    tagline: "Botellas, combinados y reservados con servicio rápido.",
    acento: "#ec4899",
    productosEjemplo: ["Botella Grey Goose", "Combinado premium", "Magnum champagne", "Chupitos surtidos"],
    ticketMedio: "120 €",
  },
  {
    slug: "cerveceria",
    nombre: "Cervecería",
    icono: "▤",
    tagline: "Cervezas propias, tablas degustación y maridaje.",
    acento: "#facc15",
    productosEjemplo: ["Flight de 4 cervezas", "Tabla de embutidos", "Pretzel artesano", "Stout edición limitada"],
    ticketMedio: "20 €",
  },
  {
    slug: "hotel",
    nombre: "Hotel",
    icono: "▥",
    tagline: "Room service, restaurante y eventos, todo desde el QR de habitación.",
    acento: "#60a5fa",
    productosEjemplo: ["Desayuno completo", "Room service 24h", "Spa", "Cena en habitación"],
    ticketMedio: "65 €",
  },
];

export function findDemo(slug: string): TipoDemo | undefined {
  return DEMOS.find((d) => d.slug === slug);
}

// Seed de los 8 locales DEMO que aparecen en la landing.
// Idempotente: si un local con ese slug ya existe, lo salta (no duplica).
// Crea categorías + productos iniciales para cada uno.

import { crearLocal, obtenerLocalPorSlug } from "./locales";
import { crearCategoria, crearProducto } from "./productos";
import type { PlanLocal, SectorLocal } from "./locales-shared";

type Prod = {
  nombre: string;
  precio: number; // céntimos
  descripcion?: string;
  alergenos?: string[];
  destacado?: boolean;
  imagen?: string;
};

type Cat = { nombre: string; productos: Prod[] };

type DemoLocal = {
  slug: string;
  nombre: string;
  sector: SectorLocal;
  plan: PlanLocal;
  color: string;
  cif: string;
  direccion: string;
  ciudad: string;
  email: string;
  telefono: string;
  cats: Cat[];
};

const DEMO_LOCALES: DemoLocal[] = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: "romanssera",
    nombre: "Romanssera",
    sector: "bar-restaurante",
    plan: "pro",
    color: "#b03326",
    cif: "B85101010",
    direccion: "C/ Augusto Figueroa, 14",
    ciudad: "Madrid",
    email: "hola@romanssera.es",
    telefono: "+34 911 010 101",
    cats: [
      {
        nombre: "Tapas frías",
        productos: [
          { nombre: "Pulpo a feira", precio: 1490, descripcion: "Patata cocida, aceite y pimentón de la Vera.", alergenos: ["moluscos"], destacado: true },
          { nombre: "Boquerones en vinagre", precio: 890, descripcion: "En mariposa, con pan de pueblo.", alergenos: ["pescado"] },
          { nombre: "Ensaladilla rusa", precio: 750, descripcion: "Receta de la abuela, bonito y mahonesa casera.", alergenos: ["pescado", "huevo"] },
          { nombre: "Tabla de ibéricos", precio: 1690, descripcion: "Jamón, lomo y chorizo de bellota.", destacado: true },
        ],
      },
      {
        nombre: "Tapas calientes",
        productos: [
          { nombre: "Croquetas de jamón", precio: 890, descripcion: "Bechamel cremosa, jamón ibérico.", alergenos: ["gluten", "lactosa", "huevo"], destacado: true },
          { nombre: "Pimientos de Padrón", precio: 750, descripcion: "Fritos con sal en escamas." },
          { nombre: "Calamares a la andaluza", precio: 1090, descripcion: "Anillas de calamar fresco con harina de garbanzo.", alergenos: ["moluscos"] },
          { nombre: "Gambas al ajillo", precio: 1290, descripcion: "Con cayena y un toque de jerez.", alergenos: ["marisco"] },
        ],
      },
      {
        nombre: "Arroces y especialidades",
        productos: [
          { nombre: "Arroz negro de sepia", precio: 1890, descripcion: "Caldo de pescado, alioli aparte.", alergenos: ["moluscos"], destacado: true },
          { nombre: "Fideuá del Mediterráneo", precio: 1790, descripcion: "Fideo cabello de ángel y mariscos.", alergenos: ["gluten", "marisco"] },
          { nombre: "Paella de marisco", precio: 2290, descripcion: "Mínimo 2 personas. Arroz bomba.", alergenos: ["marisco"] },
        ],
      },
      {
        nombre: "Postres",
        productos: [
          { nombre: "Crema catalana", precio: 590, alergenos: ["lactosa", "huevo"] },
          { nombre: "Tarta de queso al horno", precio: 690, descripcion: "Cremosa por dentro.", alergenos: ["lactosa", "huevo"] },
        ],
      },
      {
        nombre: "Bebidas",
        productos: [
          { nombre: "Caña Estrella", precio: 280, alergenos: ["gluten", "sulfitos"] },
          { nombre: "Vino tinto Rioja", precio: 420, alergenos: ["sulfitos"] },
          { nombre: "Vermut casero", precio: 380, alergenos: ["sulfitos"] },
          { nombre: "Agua mineral", precio: 220 },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    slug: "pizzeria",
    nombre: "Forno Sessanta",
    sector: "bar-restaurante",
    plan: "pro",
    color: "#cf6233",
    cif: "B85202020",
    direccion: "Calle Pelayo, 23",
    ciudad: "Madrid",
    email: "ciao@fornosessanta.it",
    telefono: "+34 911 020 202",
    cats: [
      {
        nombre: "Antipasti",
        productos: [
          { nombre: "Bruschetta clásica", precio: 690, descripcion: "Tomate, ajo y albahaca sobre pan rústico.", alergenos: ["gluten"] },
          { nombre: "Caprese di búfala", precio: 1190, descripcion: "Mozzarella de búfala, tomate raf y pesto.", alergenos: ["lactosa", "frutos-secos"] },
          { nombre: "Burrata pugliese", precio: 1390, descripcion: "Burrata fresca con aceite de albahaca.", alergenos: ["lactosa"], destacado: true },
        ],
      },
      {
        nombre: "Pizzas tradicionales",
        productos: [
          { nombre: "Margherita", precio: 1090, descripcion: "Tomate San Marzano, mozzarella fior di latte, albahaca.", alergenos: ["gluten", "lactosa"], destacado: true },
          { nombre: "Napoletana", precio: 1190, descripcion: "Anchoas, alcaparras, aceitunas.", alergenos: ["gluten", "lactosa", "pescado"] },
          { nombre: "Diavola", precio: 1290, descripcion: "Mozzarella y salame piccante.", alergenos: ["gluten", "lactosa"] },
          { nombre: "Quattro Formaggi", precio: 1390, descripcion: "Gorgonzola, mozzarella, parmesano y fontina.", alergenos: ["gluten", "lactosa"] },
          { nombre: "Capricciosa", precio: 1390, descripcion: "Jamón cocido, champiñones, alcachofas, aceitunas.", alergenos: ["gluten", "lactosa"] },
          { nombre: "Bianca tartufo", precio: 1690, descripcion: "Crema de trufa, mozzarella y rúcula.", alergenos: ["gluten", "lactosa"], destacado: true },
        ],
      },
      {
        nombre: "Pasta fresca",
        productos: [
          { nombre: "Carbonara romana", precio: 1290, descripcion: "Guanciale, pecorino, yema y pimienta.", alergenos: ["gluten", "lactosa", "huevo"] },
          { nombre: "Tagliatelle al ragú", precio: 1390, descripcion: "12 horas de cocción, parmesano.", alergenos: ["gluten", "lactosa"] },
          { nombre: "Lasagna boloñesa", precio: 1290, descripcion: "Bechamel y queso gratinado.", alergenos: ["gluten", "lactosa", "huevo"] },
        ],
      },
      {
        nombre: "Postres",
        productos: [
          { nombre: "Tiramisú della casa", precio: 590, alergenos: ["gluten", "lactosa", "huevo"], destacado: true },
          { nombre: "Panna cotta de frutos rojos", precio: 590, alergenos: ["lactosa"] },
          { nombre: "Cannoli sicilianos", precio: 590, alergenos: ["gluten", "lactosa", "frutos-secos"] },
        ],
      },
      {
        nombre: "Bebidas",
        productos: [
          { nombre: "Birra Moretti", precio: 380, alergenos: ["gluten", "sulfitos"] },
          { nombre: "Aperol Spritz", precio: 690, alergenos: ["sulfitos"] },
          { nombre: "Chianti DOCG copa", precio: 490, alergenos: ["sulfitos"] },
          { nombre: "Limoncello chupito", precio: 320 },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    slug: "hamburgueseria",
    nombre: "Bonfire Burger",
    sector: "bar-restaurante",
    plan: "pro",
    color: "#d4402f",
    cif: "B85303030",
    direccion: "C/ Doctor Cortezo, 8",
    ciudad: "Madrid",
    email: "hello@bonfireburger.com",
    telefono: "+34 911 030 303",
    cats: [
      {
        nombre: "Burgers",
        productos: [
          { nombre: "Classic Bonfire", precio: 1190, descripcion: "Cheddar fundido, lechuga, tomate, salsa secreta.", alergenos: ["gluten", "lactosa", "huevo", "mostaza"], destacado: true },
          { nombre: "BBQ smoky", precio: 1390, descripcion: "Bacon ahumado, queso cheddar, salsa BBQ casera.", alergenos: ["gluten", "lactosa", "soja", "mostaza"] },
          { nombre: "Double cheese", precio: 1590, descripcion: "Doble carne, triple queso.", alergenos: ["gluten", "lactosa"], destacado: true },
          { nombre: "Truffle royale", precio: 1790, descripcion: "Mayonesa de trufa, rúcula, parmesano.", alergenos: ["gluten", "lactosa", "huevo"] },
          { nombre: "Crispy chicken", precio: 1290, descripcion: "Pollo crujiente, kimchi, sriracha.", alergenos: ["gluten", "huevo", "soja"] },
          { nombre: "Veggie portobello", precio: 1190, descripcion: "Portobello a la brasa, queso de cabra.", alergenos: ["gluten", "lactosa"] },
        ],
      },
      {
        nombre: "Sides",
        productos: [
          { nombre: "Patatas hand-cut", precio: 490, descripcion: "Cortadas a mano, sal Maldon." },
          { nombre: "Onion rings", precio: 590, alergenos: ["gluten"] },
          { nombre: "Mac & cheese", precio: 690, descripcion: "Cremoso, gratinado.", alergenos: ["gluten", "lactosa"], destacado: true },
          { nombre: "Boniato frito", precio: 590, descripcion: "Con mayo de chipotle.", alergenos: ["huevo", "mostaza"] },
        ],
      },
      {
        nombre: "Para compartir",
        productos: [
          { nombre: "Chicken wings BBQ", precio: 990, descripcion: "8 alitas glaseadas.", alergenos: ["soja", "sulfitos"] },
          { nombre: "Nachos supreme", precio: 890, descripcion: "Queso, jalapeños, guacamole.", alergenos: ["lactosa"] },
          { nombre: "Mozzarella sticks", precio: 690, alergenos: ["gluten", "lactosa", "huevo"] },
        ],
      },
      {
        nombre: "Postres y bebidas",
        productos: [
          { nombre: "Brownie con helado", precio: 590, alergenos: ["gluten", "lactosa", "huevo", "frutos-secos"], destacado: true },
          { nombre: "Milkshake Oreo", precio: 590, alergenos: ["gluten", "lactosa"] },
          { nombre: "IPA local", precio: 420, alergenos: ["gluten", "sulfitos"] },
          { nombre: "Coca-Cola", precio: 280 },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    slug: "cafeteria",
    nombre: "Ostra & Sol",
    sector: "cafeteria",
    plan: "basic",
    color: "#c07a4a",
    cif: "B65404040",
    direccion: "C/ Verdi, 41",
    ciudad: "Barcelona",
    email: "hola@ostrasol.cafe",
    telefono: "+34 911 040 404",
    cats: [
      {
        nombre: "Cafés",
        productos: [
          { nombre: "Espresso", precio: 180 },
          { nombre: "Cortado", precio: 220, alergenos: ["lactosa"] },
          { nombre: "Flat White", precio: 320, alergenos: ["lactosa"], destacado: true },
          { nombre: "Cappuccino", precio: 320, alergenos: ["lactosa"] },
          { nombre: "Latte de avena", precio: 380, alergenos: [] },
          { nombre: "Cold brew", precio: 380, descripcion: "Lento, 18h de extracción." },
        ],
      },
      {
        nombre: "Brunch",
        productos: [
          { nombre: "Tostada aguacate", precio: 890, descripcion: "Pan masa madre, aguacate, huevo poché, semillas.", alergenos: ["gluten", "huevo"], destacado: true },
          { nombre: "Huevos Benedict", precio: 1190, descripcion: "Salsa holandesa casera.", alergenos: ["gluten", "huevo", "lactosa"], destacado: true },
          { nombre: "Pancakes con sirope", precio: 890, descripcion: "Frutos rojos, mantequilla y arce.", alergenos: ["gluten", "lactosa", "huevo"] },
          { nombre: "French toast", precio: 890, alergenos: ["gluten", "lactosa", "huevo"] },
        ],
      },
      {
        nombre: "Bowls",
        productos: [
          { nombre: "Açaí bowl tropical", precio: 990, descripcion: "Granola, plátano, coco y mango.", alergenos: ["frutos-secos"] },
          { nombre: "Yogurt griego", precio: 690, descripcion: "Miel, frutos rojos y granola.", alergenos: ["lactosa", "frutos-secos"] },
        ],
      },
      {
        nombre: "Bollería",
        productos: [
          { nombre: "Croissant de mantequilla", precio: 250, alergenos: ["gluten", "lactosa", "huevo"] },
          { nombre: "Pain au chocolat", precio: 290, alergenos: ["gluten", "lactosa", "huevo"] },
          { nombre: "Cinnamon roll", precio: 320, descripcion: "Glaseado.", alergenos: ["gluten", "lactosa", "huevo"], destacado: true },
        ],
      },
      {
        nombre: "Otras bebidas",
        productos: [
          { nombre: "Zumo natural de naranja", precio: 380 },
          { nombre: "Té matcha latte", precio: 380, alergenos: ["lactosa"] },
          { nombre: "Kombucha de jengibre", precio: 390 },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    slug: "cachimbas",
    nombre: "Magma",
    sector: "lounge-club",
    plan: "pro",
    color: "#c2871f",
    cif: "B97505050",
    direccion: "C/ Caballeros, 17",
    ciudad: "Valencia",
    email: "info@magmalounge.com",
    telefono: "+34 911 050 505",
    cats: [
      {
        nombre: "Cachimbas",
        productos: [
          { nombre: "Cachimba clásica", precio: 1500, descripcion: "Sabor a elegir, cabeza tradicional." },
          { nombre: "Cachimba premium", precio: 1900, descripcion: "Cabeza phunnel, melaza premium.", destacado: true },
          { nombre: "Mix de frutos rojos", precio: 1700, descripcion: "Arándano, frambuesa y menta." },
          { nombre: "Mint chill", precio: 1700, descripcion: "Menta fresca con hielo extra." },
        ],
      },
      {
        nombre: "Cócteles signature",
        productos: [
          { nombre: "Magma punch", precio: 1100, descripcion: "Ron, mango, lima y especias.", destacado: true },
          { nombre: "Smoky old fashioned", precio: 1200, descripcion: "Whisky ahumado en mesa.", alergenos: ["sulfitos"] },
          { nombre: "Espresso martini", precio: 1100, alergenos: ["lactosa"] },
          { nombre: "Lava margarita", precio: 1000, descripcion: "Tequila, lima y guindilla." },
        ],
      },
      {
        nombre: "Botellas",
        productos: [
          { nombre: "Champagne Moët Brut", precio: 9500, descripcion: "Botella 75cl.", alergenos: ["sulfitos"], destacado: true },
          { nombre: "Vodka Grey Goose", precio: 8500, alergenos: ["sulfitos"] },
          { nombre: "Whisky Johnnie Walker Black", precio: 7500, alergenos: ["sulfitos"] },
          { nombre: "Ron Zacapa 23", precio: 8900, alergenos: ["sulfitos"] },
        ],
      },
      {
        nombre: "Picoteo",
        productos: [
          { nombre: "Tabla de quesos", precio: 1690, alergenos: ["lactosa", "frutos-secos"] },
          { nombre: "Ibéricos selección", precio: 1990, descripcion: "Jamón, lomo y chorizo bellota." },
          { nombre: "Patatas trufadas", precio: 990, descripcion: "Con parmesano.", alergenos: ["lactosa"] },
          { nombre: "Olivas marinadas", precio: 490 },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    slug: "el-fogon-paisa",
    nombre: "El Fogón Paisa",
    sector: "bar-restaurante",
    plan: "pro",
    color: "#b3392f",
    cif: "B85606060",
    direccion: "C/ Embajadores, 35",
    ciudad: "Madrid",
    email: "contacto@elfogonpaisa.com",
    telefono: "+34 911 060 606",
    cats: [
      {
        nombre: "Entrantes",
        productos: [
          { nombre: "Empanadas paisas (3 uds.)", precio: 650, descripcion: "Crujientes de maíz, carne desmechada con hogao.", alergenos: ["gluten", "huevo"] },
          { nombre: "Arepa rellena de queso", precio: 480, descripcion: "Plancha al momento.", alergenos: ["gluten", "lactosa"] },
          { nombre: "Patacones con hogao", precio: 590, descripcion: "Plátano verde frito, salsa criolla." },
        ],
      },
      {
        nombre: "Sopas",
        productos: [
          { nombre: "Sancocho trifásico", precio: 1150, descripcion: "Res, cerdo y pollo. Yuca, plátano, mazorca.", alergenos: ["apio"], destacado: true },
          { nombre: "Ajiaco santafereño", precio: 1450, descripcion: "Pollo, tres papas, mazorca, alcaparras y crema.", alergenos: ["lactosa", "apio"] },
        ],
      },
      {
        nombre: "Especialidades",
        productos: [
          { nombre: "Bandeja paisa completa", precio: 1890, descripcion: "Frijoles, arroz, carne, chicharrón, chorizo, huevo, plátano y arepa.", alergenos: ["gluten", "huevo"], destacado: true },
          { nombre: "Churrasco con chimichurri", precio: 2200, descripcion: "Solomillo a la parrilla.", alergenos: ["sulfitos"] },
        ],
      },
      {
        nombre: "Postres",
        productos: [
          { nombre: "Tres leches casero", precio: 620, descripcion: "Crema y canela.", alergenos: ["lactosa", "huevo", "frutos-secos"], destacado: true },
          { nombre: "Obleas con arequipe", precio: 450, alergenos: ["lactosa", "huevo"] },
        ],
      },
      {
        nombre: "Bebidas",
        productos: [
          { nombre: "Cerveza Águila", precio: 380, alergenos: ["gluten", "sulfitos"] },
          { nombre: "Limonada de coco", precio: 420, descripcion: "Cremosa, frappé.", alergenos: ["lactosa"], destacado: true },
          { nombre: "Tinto colombiano", precio: 240, descripcion: "Café negro filtrado." },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    slug: "sereno",
    nombre: "Sereno",
    sector: "cocteleria",
    plan: "pro",
    color: "#b58620",
    cif: "B95707070",
    direccion: "Gran Vía, 24",
    ciudad: "Bilbao",
    email: "reservas@serenococktail.com",
    telefono: "+34 911 070 707",
    cats: [
      {
        nombre: "Signature",
        productos: [
          { nombre: "Sereno", precio: 1400, descripcion: "Mezcal, lavanda, lima y miel.", alergenos: ["sulfitos"], destacado: true },
          { nombre: "Espuma del mar", precio: 1500, descripcion: "Gin, pepino, espuma cítrica.", alergenos: ["sulfitos"], destacado: true },
          { nombre: "Niebla de invierno", precio: 1400, descripcion: "Whisky, vermut blanco, humo de romero.", alergenos: ["sulfitos"] },
        ],
      },
      {
        nombre: "Clásicos",
        productos: [
          { nombre: "Old Fashioned", precio: 1200, alergenos: ["sulfitos"] },
          { nombre: "Negroni", precio: 1200, alergenos: ["sulfitos"] },
          { nombre: "Manhattan", precio: 1200, alergenos: ["sulfitos"] },
          { nombre: "Daiquiri", precio: 1100, alergenos: ["sulfitos"] },
          { nombre: "Whiskey Sour", precio: 1100, descripcion: "Con clara de huevo.", alergenos: ["huevo", "sulfitos"] },
        ],
      },
      {
        nombre: "Mocktails",
        productos: [
          { nombre: "Garden mojito", precio: 800, descripcion: "Sin alcohol, menta y soda." },
          { nombre: "Sweet ginger", precio: 800, descripcion: "Jengibre, lima y miel." },
        ],
      },
      {
        nombre: "Vinos y picoteo",
        productos: [
          { nombre: "Champagne Veuve copa", precio: 1500, alergenos: ["sulfitos"] },
          { nombre: "Cava Brut Nature", precio: 600, alergenos: ["sulfitos"] },
          { nombre: "Tabla de queso curado", precio: 1490, alergenos: ["lactosa", "frutos-secos"] },
          { nombre: "Tartar de atún", precio: 1690, alergenos: ["pescado", "soja"], destacado: true },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    slug: "isabellas",
    nombre: "Isabella's Llafranc",
    sector: "hotel",
    plan: "enterprise",
    color: "#1f4d56",
    cif: "B17909090",
    direccion: "Carrer Francesc Blanes, 5",
    ciudad: "Llafranc (Girona)",
    email: "hello@isabellasllafranc.com",
    telefono: "+34 872 552 788",
    cats: [
      {
        nombre: "Restaurante mediterráneo",
        productos: [
          { nombre: "Burrata di Puglia", precio: 1850, descripcion: "Burrata fresca, tomate ramaillete del Maresme, albahaca y AOVE de Pals.", alergenos: ["lactosa"], destacado: true },
          { nombre: "Tartar de atún rojo", precio: 2400, descripcion: "Almadraba, aguacate, soja envejecida y wasabi fresco. Crujiente de arroz negro.", alergenos: ["pescado", "soja"] },
          { nombre: "Spaghetti alle vongole", precio: 2200, descripcion: "Pasta artesanal, almejas de la costa, ajo, perejil y vino blanco del Empordà.", alergenos: ["gluten", "moluscos", "sulfitos"], destacado: true },
          { nombre: "Lubina a la sal", precio: 3200, descripcion: "Lubina salvaje del día bajo costra de sal, patata confitada y mojo verde. Para 2.", alergenos: ["pescado"] },
          { nombre: "Risotto al limone", precio: 1950, descripcion: "Carnaroli, mantequilla noisette, limón de Amalfi y parmesano 24 meses.", alergenos: ["lactosa"] },
          { nombre: "Tiramisú della casa", precio: 900, descripcion: "Receta de la nonna, espresso, mascarpone montado a mano, cacao Valrhona.", alergenos: ["gluten", "lactosa", "huevo"] },
        ],
      },
      {
        nombre: "Vinos & cócteles",
        productos: [
          { nombre: "Vino blanco Empordà copa", precio: 650, descripcion: "Garnatxa blanca, fresco y mineral.", alergenos: ["sulfitos"] },
          { nombre: "Cava Brut Nature copa", precio: 750, alergenos: ["sulfitos"] },
          { nombre: "Negroni della casa", precio: 1200, descripcion: "Vermut artesano del Empordà." },
          { nombre: "Aperol Spritz", precio: 950, alergenos: ["sulfitos"] },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────
  {
    slug: "trellat",
    nombre: "Trellat",
    sector: "bar-restaurante",
    plan: "basic",
    color: "#7a7a4a",
    cif: "B91808080",
    direccion: "C/ Sierpes, 67",
    ciudad: "Sevilla",
    email: "trellat@trellat.es",
    telefono: "+34 911 080 808",
    cats: [
      {
        nombre: "Tapas",
        productos: [
          { nombre: "Tortilla española", precio: 350, descripcion: "Pincho. Poco hecha o cuajada.", alergenos: ["huevo"], destacado: true },
          { nombre: "Croquetas caseras (4 uds.)", precio: 690, alergenos: ["gluten", "lactosa", "huevo"] },
          { nombre: "Patatas bravas", precio: 590, descripcion: "Salsa picante y alioli.", alergenos: ["huevo"] },
          { nombre: "Boquerones en vinagre", precio: 590, alergenos: ["pescado"] },
        ],
      },
      {
        nombre: "Bocadillos",
        productos: [
          { nombre: "Bocadillo de tortilla", precio: 450, alergenos: ["gluten", "huevo"] },
          { nombre: "De calamares", precio: 590, descripcion: "Pan con mahonesa de limón.", alergenos: ["gluten", "huevo", "moluscos"], destacado: true },
          { nombre: "Lomo con queso", precio: 590, alergenos: ["gluten", "lactosa"] },
          { nombre: "Jamón con tomate", precio: 590, alergenos: ["gluten"] },
        ],
      },
      {
        nombre: "Raciones",
        productos: [
          { nombre: "Pulpo a la plancha", precio: 1490, alergenos: ["moluscos"], destacado: true },
          { nombre: "Pimientos del padrón", precio: 590 },
          { nombre: "Champis al ajillo", precio: 690 },
        ],
      },
      {
        nombre: "Postres y bebidas",
        productos: [
          { nombre: "Flan de huevo casero", precio: 380, alergenos: ["lactosa", "huevo"] },
          { nombre: "Caña Mahou", precio: 220, alergenos: ["gluten", "sulfitos"] },
          { nombre: "Vermut rojo casero", precio: 280, alergenos: ["sulfitos"] },
          { nombre: "Vino de la casa", precio: 250, alergenos: ["sulfitos"] },
        ],
      },
    ],
  },
];

export async function seedAllDemoLocales(): Promise<{
  creados: string[];
  saltados: string[];
}> {
  const creados: string[] = [];
  const saltados: string[] = [];

  for (const dl of DEMO_LOCALES) {
    const existente = await obtenerLocalPorSlug(dl.slug);
    if (existente) {
      saltados.push(dl.slug);
      continue;
    }

    const { id } = await crearLocal({
      nombre: dl.nombre,
      slug: dl.slug,
      sector: dl.sector,
      plan: dl.plan,
      color_primario: dl.color,
      cif: dl.cif,
      direccion: dl.direccion,
      ciudad: dl.ciudad,
      email: dl.email,
      telefono: dl.telefono,
    });

    for (const cat of dl.cats) {
      const catId = await crearCategoria(id, cat.nombre);
      for (const it of cat.productos) {
        await crearProducto({
          local_id: id,
          categoria_id: catId,
          nombre: it.nombre,
          descripcion: it.descripcion || null,
          precio_cents: it.precio,
          alergenos: it.alergenos && it.alergenos.length ? it.alergenos : null,
          destacado: it.destacado ? 1 : 0,
          iva_pct: 10,
        });
      }
    }
    creados.push(dl.slug);
  }

  return { creados, saltados };
}

// Alias para mantener compatibilidad con el botón antiguo que llamaba a
// seedLocalDemo. Ahora siembra los 8, y devuelve el primero recién creado
// (para redirigir) o "romanssera" si todos existían.
export async function seedLocalDemo(): Promise<{ slug: string }> {
  const { creados, saltados } = await seedAllDemoLocales();
  return { slug: creados[0] || saltados[0] || "romanssera" };
}

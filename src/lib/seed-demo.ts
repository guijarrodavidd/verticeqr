// Solo SERVIDOR. Carga un local de demostración completo ("El Fogón Paisa")
// con categorías, productos, alérgenos e imágenes. Útil para ver la app
// poblada sin tener que crearlo todo a mano.

import { crearLocal } from "./locales";
import { crearCategoria, crearProducto } from "./productos";

// URLs de Unsplash estables (CDN público). Las elegimos genéricas para que
// vivan tiempo. El usuario puede sustituir las imágenes desde el modal.
const IMG = {
  empanadas:   "https://images.unsplash.com/photo-1601001815853-3835274403b3?w=800&q=80",
  arepa:       "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
  patacones:   "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
  sancocho:    "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
  bandeja:     "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=800&q=80",
  ajiaco:      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
  churrasco:   "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
  costilla:    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  pescado:     "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
  ceviche:     "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80",
  tresLeches:  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
  obleas:      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
  cerveza:     "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80",
  limonada:    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
  cafe:        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
};

type SeedProducto = {
  cat: number;
  nombre: string;
  desc: string;
  precio_cents: number;
  imagen_url: string | null;
  alergenos: string[];
  destacado?: boolean;
};

export async function seedLocalDemo(): Promise<{ slug: string; id: number }> {
  const { id, slug } = await crearLocal({
    nombre: "El Fogón Paisa",
    sector: "bar-restaurante",
    plan: "pro",
    email: "contacto@elfogonpaisa.com",
    telefono: "+34 911 234 567",
    color_primario: "#d4a017",
  });

  // Categorías en el orden lógico de una carta
  const cats = {
    entrantes:       await crearCategoria(id, "Entrantes"),
    sopas:           await crearCategoria(id, "Sopas y caldos"),
    especialidades:  await crearCategoria(id, "Especialidades de la casa"),
    carnes:          await crearCategoria(id, "Carnes a la parrilla"),
    pescados:        await crearCategoria(id, "Pescados"),
    postres:         await crearCategoria(id, "Postres"),
    bebidas:         await crearCategoria(id, "Bebidas"),
    cafes:           await crearCategoria(id, "Cafés"),
  };

  const productos: SeedProducto[] = [
    // ENTRANTES
    { cat: cats.entrantes, nombre: "Empanadas paisas (3 uds.)",
      desc: "Empanadas crujientes de maíz rellenas de carne desmechada con hogao casero.",
      precio_cents: 650, imagen_url: IMG.empanadas, alergenos: ["gluten", "huevo"] },
    { cat: cats.entrantes, nombre: "Arepa rellena de queso",
      desc: "Arepa de maíz blanco rellena de queso fundido, plancha al momento.",
      precio_cents: 480, imagen_url: IMG.arepa, alergenos: ["gluten", "lactosa"] },
    { cat: cats.entrantes, nombre: "Patacones con hogao",
      desc: "Plátano verde frito doble cocción con salsa criolla de tomate y cebolla.",
      precio_cents: 590, imagen_url: IMG.patacones, alergenos: [] },

    // SOPAS
    { cat: cats.sopas, nombre: "Sancocho trifásico",
      desc: "Sopa tradicional con res, cerdo y pollo. Yuca, plátano, mazorca y cilantro fresco.",
      precio_cents: 1150, imagen_url: IMG.sancocho, alergenos: ["apio"], destacado: true },
    { cat: cats.sopas, nombre: "Mondongo paisa",
      desc: "Sopa de mondongo cocinada a fuego lento con verduras y arroz blanco.",
      precio_cents: 990, imagen_url: null, alergenos: ["apio"] },

    // ESPECIALIDADES
    { cat: cats.especialidades, nombre: "Bandeja paisa completa",
      desc: "Frijoles, arroz, carne molida, chicharrón, chorizo, huevo frito, plátano maduro, aguacate y arepa.",
      precio_cents: 1890, imagen_url: IMG.bandeja, alergenos: ["gluten", "huevo"], destacado: true },
    { cat: cats.especialidades, nombre: "Ajiaco santafereño",
      desc: "Sopa cremosa de pollo con tres tipos de papa, mazorca, alcaparras y crema fresca.",
      precio_cents: 1450, imagen_url: IMG.ajiaco, alergenos: ["lactosa", "apio"] },

    // CARNES
    { cat: cats.carnes, nombre: "Churrasco con chimichurri",
      desc: "Solomillo a la parrilla con chimichurri casero, papas criollas y maíz tierno.",
      precio_cents: 2200, imagen_url: IMG.churrasco, alergenos: ["sulfitos"] },
    { cat: cats.carnes, nombre: "Costilla BBQ a baja temperatura",
      desc: "Costillas de cerdo glaseadas en BBQ casero, 6 horas a 95°C. Caen del hueso.",
      precio_cents: 1750, imagen_url: IMG.costilla, alergenos: ["soja", "sulfitos", "mostaza"] },
    { cat: cats.carnes, nombre: "Pechuga a la plancha",
      desc: "Pechuga jugosa con verduras al wok y arroz blanco.",
      precio_cents: 1580, imagen_url: null, alergenos: [] },

    // PESCADOS
    { cat: cats.pescados, nombre: "Pescado del día a la parrilla",
      desc: "Pescado fresco con limón, ajo, perejil y patatas al horno.",
      precio_cents: 1980, imagen_url: IMG.pescado, alergenos: ["pescado"] },
    { cat: cats.pescados, nombre: "Ceviche colombiano",
      desc: "Pescado blanco marinado en limón con cebolla morada, cilantro y maíz tostado.",
      precio_cents: 1490, imagen_url: IMG.ceviche, alergenos: ["pescado", "mostaza"] },

    // POSTRES
    { cat: cats.postres, nombre: "Tres leches casero",
      desc: "Bizcocho empapado en mezcla de tres leches, crema montada y un toque de canela.",
      precio_cents: 620, imagen_url: IMG.tresLeches, alergenos: ["lactosa", "huevo", "frutos-secos"], destacado: true },
    { cat: cats.postres, nombre: "Obleas con arequipe",
      desc: "Obleas crujientes con dulce de leche, queso rallado y mermelada.",
      precio_cents: 450, imagen_url: IMG.obleas, alergenos: ["lactosa", "huevo"] },

    // BEBIDAS
    { cat: cats.bebidas, nombre: "Cerveza Águila",
      desc: "Cerveza colombiana lager. Botella 33 cl.",
      precio_cents: 380, imagen_url: IMG.cerveza, alergenos: ["gluten", "sulfitos"] },
    { cat: cats.bebidas, nombre: "Limonada de coco",
      desc: "Limonada cremosa con coco rallado y hielo frappé. Refrescante.",
      precio_cents: 420, imagen_url: IMG.limonada, alergenos: ["lactosa"], destacado: true },
    { cat: cats.bebidas, nombre: "Aguardiente Antioqueño",
      desc: "Chupito 4 cl. Servido frío como manda la tradición.",
      precio_cents: 350, imagen_url: null, alergenos: ["sulfitos"] },
    { cat: cats.bebidas, nombre: "Refajo",
      desc: "Mezcla típica de cerveza con refresco rojo.",
      precio_cents: 480, imagen_url: null, alergenos: ["gluten"] },

    // CAFÉS
    { cat: cats.cafes, nombre: "Tinto colombiano",
      desc: "Café negro recién filtrado.",
      precio_cents: 240, imagen_url: IMG.cafe, alergenos: [] },
    { cat: cats.cafes, nombre: "Café con leche",
      desc: "Espresso doble con leche caliente.",
      precio_cents: 320, imagen_url: null, alergenos: ["lactosa"] },
  ];

  for (const p of productos) {
    await crearProducto({
      local_id: id,
      categoria_id: p.cat,
      nombre: p.nombre,
      descripcion: p.desc,
      precio_cents: p.precio_cents,
      imagen_url: p.imagen_url,
      alergenos: p.alergenos.length ? p.alergenos : null,
      destacado: p.destacado ? 1 : 0,
      iva_pct: 10,
    });
  }

  return { id, slug };
}

import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";
import { crearLead } from "@/lib/leads";
import Nav from "./_components/Nav";
import Reveal from "./_components/Reveal";
import Counter from "./_components/Counter";
import {
  DiscoBallScene,
  ShishaScene,
  GlassesScene,
  BeerMugsScene,
  HotelBellScene,
  PubGamesScene,
  MeatCutScene,
  EmojiScene,
} from "./_components/SectorScenes";
import styles from "./landing.module.css";

export const dynamic = "force-dynamic";

type CasoExito = {
  id: number;
  empresa: string;
  sector: string;
  qr_activos: number;
  escaneos_mes: number;
  destacado: number;
};

const SEED_CASOS: Array<Omit<CasoExito, "id">> = [
  { empresa: "Cervezas Volcán", sector: "Hostelería", qr_activos: 24, escaneos_mes: 18452, destacado: 1 },
  { empresa: "Floristería Lila", sector: "Retail", qr_activos: 8, escaneos_mes: 3210, destacado: 0 },
  { empresa: "Hotel Mediterránea", sector: "Turismo", qr_activos: 56, escaneos_mes: 41200, destacado: 1 },
  { empresa: "Museo de Artes Vivas", sector: "Cultura", qr_activos: 12, escaneos_mes: 9870, destacado: 0 },
  { empresa: "Logística Norte", sector: "B2B", qr_activos: 132, escaneos_mes: 73500, destacado: 1 },
];

async function asegurarCasos() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS casos_exito (
      id INT AUTO_INCREMENT PRIMARY KEY,
      empresa VARCHAR(100) NOT NULL,
      sector VARCHAR(50) NOT NULL,
      qr_activos INT NOT NULL DEFAULT 0,
      escaneos_mes INT NOT NULL DEFAULT 0,
      destacado TINYINT(1) NOT NULL DEFAULT 0
    )
  `);
  const [c] = await pool.query("SELECT COUNT(*) AS n FROM casos_exito");
  if ((c as Array<{ n: number }>)[0]?.n === 0) {
    const values = SEED_CASOS.map(() => "(?,?,?,?,?)").join(",");
    const params = SEED_CASOS.flatMap((x) => [x.empresa, x.sector, x.qr_activos, x.escaneos_mes, x.destacado]);
    await pool.query(
      `INSERT INTO casos_exito (empresa, sector, qr_activos, escaneos_mes, destacado) VALUES ${values}`,
      params,
    );
  }
}

async function leerCasos(): Promise<{ casos: CasoExito[]; totalEscaneos: number }> {
  try {
    await asegurarCasos();
    const [rows] = await getPool().query(
      "SELECT id, empresa, sector, qr_activos, escaneos_mes, destacado FROM casos_exito ORDER BY escaneos_mes DESC",
    );
    const casos = rows as CasoExito[];
    return {
      casos,
      totalEscaneos: casos.reduce((s, c) => s + c.escaneos_mes, 0),
    };
  } catch {
    return { casos: [], totalEscaneos: 0 };
  }
}

type LandingSP = { origen?: string; ok?: string; error?: string };

async function enviarLead(formData: FormData) {
  "use server";
  if (String(formData.get("hp") ?? "").trim() !== "") redirect("/?ok=1#contacto");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!nombre || !email) redirect("/?error=campos#contacto");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect("/?error=email#contacto");
  const mesasRaw = Number(formData.get("mesas"));
  const num_mesas = Number.isInteger(mesasRaw) && mesasRaw > 0 && mesasRaw < 1000 ? mesasRaw : null;
  await crearLead({
    nombre,
    email,
    telefono: String(formData.get("telefono") ?? "").trim() || null,
    empresa: String(formData.get("empresa") ?? "").trim() || null,
    sector: String(formData.get("sector") ?? "").trim() || null,
    num_mesas,
    mensaje: String(formData.get("mensaje") ?? "").trim() || null,
    origen: String(formData.get("origen") ?? "").trim() || "landing",
  });
  redirect("/?ok=1#contacto");
}

// bg = emoji temático que va de fondo en la tarjeta, animado en hover
const DEMOS_PREVIEW = [
  { slug: "lounge-club", nombre: "Lounge Club", icono: "✦", color: "#a78bfa", bg: "🥂" },
  { slug: "cocteleria", nombre: "Coctelería", icono: "◆", color: "#f472b6", bg: "🍸" },
  { slug: "pub", nombre: "Pub", icono: "◐", color: "#fbbf24", bg: "🍺" },
  { slug: "bar-restaurante", nombre: "Bar / Restaurante", icono: "▢", color: "#4ade80", bg: "🍽️" },
  { slug: "cafeteria", nombre: "Cafetería", icono: "◯", color: "#fb923c", bg: "☕" },
  { slug: "discoteca", nombre: "Discoteca", icono: "✧", color: "#ec4899", bg: "🪩" },
  { slug: "cerveceria", nombre: "Cervecería", icono: "▤", color: "#facc15", bg: "🍻" },
  { slug: "hotel", nombre: "Hotel", icono: "▥", color: "#60a5fa", bg: "🛎️" },
];

// Bento: cada feature lleva su "size" — big (col-7) o small (col-5).
// Filas: row1 = big + small, row2 = small + big. Asimétrico.
type FeatureSize = "big" | "small";
const FEATURES: {
  size: FeatureSize;
  icono: string;
  color: string;
  titulo: string;
  desc: string;
  statNum?: string;
  statLabel?: string;
}[] = [
  {
    size: "big",
    icono: "💸",
    color: "#4ade80",
    titulo: "Vende más por mesa",
    desc: "Upsells automáticos, productos destacados con foto, sugerencias inteligentes. La gente pide más cuando lo ve.",
    statNum: "+30%",
    statLabel: "ticket medio reportado por nuestros locales en los primeros 90 días",
  },
  {
    size: "small",
    icono: "⏱",
    color: "#fbbf24",
    titulo: "Sirve más rápido",
    desc: "El pedido sale directo a cocina y barra. Tu equipo deja de tomar nota.",
  },
  {
    size: "small",
    icono: "⚡",
    color: "#a78bfa",
    titulo: "Cero apps",
    desc: "El cliente escanea con la cámara y abre tu carta. Nada que instalar.",
  },
  {
    size: "big",
    icono: "📊",
    color: "#60a5fa",
    titulo: "Tu carta convertida en datos",
    desc: "Qué se pide, cuándo, con qué se combina, qué se queda en el carrito. Decidir el menú deja de ser intuición — pasa a ser información.",
    statNum: "12 min",
    statLabel: "que ahorra cada mesa, según el reporte de Sunday sobre la industria",
  },
];

const TESTIMONIOS = [
  {
    quote: "Pasamos de 4 a 7 rotaciones por noche sin contratar a nadie. El cliente pide cuando quiere y no buscamos al camarero como locos.",
    nombre: "Laura Vega",
    rol: "Propietaria",
    local: "El Fogón Paisa",
    avatar: "LV",
    color: "#a78bfa",
  },
  {
    quote: "En tres meses, ticket medio +27%. La gente cuando ve la foto del cocktail signature lo pide, así de simple.",
    nombre: "Marcos Rey",
    rol: "Manager",
    local: "Hotel Mediterránea",
    avatar: "MR",
    color: "#f472b6",
  },
  {
    quote: "Los chicos del turno de tarde ahora se centran en servir mesas y no en cobrar. Las propinas se han disparado.",
    nombre: "Elena Costa",
    rol: "CEO",
    local: "Logística Norte",
    avatar: "EC",
    color: "#60a5fa",
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<LandingSP>;
}) {
  const sp = await searchParams;
  const { casos, totalEscaneos } = await leerCasos();

  return (
    <div className={styles.page}>
      <Nav />

      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot}>NUEVO</span>
              Pedidos por QR para hostelería
            </div>
            <h1 className={styles.heroTitle}>
              Tu cliente <span className={styles.heroAccent}>escanea</span>,
              <br /> pide y paga.
            </h1>
            <p className={styles.heroSub}>
              VerticeQR es la carta digital con la que tu cliente pide y paga
              desde su mesa. Tu equipo sirve más rápido, vendes más por ticket
              y dejas atrás las apps que nunca instala nadie.
            </p>
            <div className={styles.heroCtas}>
              <a href="#contacto" className={styles.ctaPrimary}>
                Solicita una demo <span>→</span>
              </a>
              <a href="#producto" className={styles.ctaSecondary}>
                Ver cómo funciona
              </a>
            </div>
            <div className={styles.heroTrust}>
              <span className={styles.heroTrustStars}>★★★★★</span>
              <span>
                <strong>4.9/5</strong> · valoración media
              </span>
              <span style={{ color: "#4b5563" }}>•</span>
              <span>
                Confían <strong>+2.500</strong> locales
              </span>
            </div>
          </div>

          <div className={styles.heroMockup}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneScreen}>
                <div className={styles.phoneTop}>
                  <span>verticeqr.com/m</span>
                  <span>9:41</span>
                </div>
                <div>
                  <div className={styles.phoneBrand}>El Fogón Paisa</div>
                  <div className={styles.phoneMesa}>MESA 07 · Abierta</div>
                </div>
                <div className={styles.phoneItem}>
                  <div>
                    <div className={styles.phoneItemName}>Bandeja paisa</div>
                    <div className={styles.phoneItemDesc}>Plato estrella · 6 ingredientes</div>
                  </div>
                  <div className={styles.phoneItemPrice}>18,90 €</div>
                </div>
                <div className={styles.phoneItem}>
                  <div>
                    <div className={styles.phoneItemName}>Sancocho trifásico</div>
                    <div className={styles.phoneItemDesc}>Sopa tradicional</div>
                  </div>
                  <div className={styles.phoneItemPrice}>11,50 €</div>
                </div>
                <div className={styles.phoneItem}>
                  <div>
                    <div className={styles.phoneItemName}>Limonada de coco</div>
                    <div className={styles.phoneItemDesc}>Refrescante</div>
                  </div>
                  <div className={styles.phoneItemPrice}>4,20 €</div>
                </div>
                <div className={styles.phoneCart}>3 productos · Pedir 34,60 €</div>
              </div>
            </div>
            <div className={styles.qrFloat}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#fff" />
                <g fill="#0a0a0f">
                  <rect x="8" y="8" width="22" height="22" rx="2" />
                  <rect x="70" y="8" width="22" height="22" rx="2" />
                  <rect x="8" y="70" width="22" height="22" rx="2" />
                  <rect x="14" y="14" width="10" height="10" fill="#fff" />
                  <rect x="76" y="14" width="10" height="10" fill="#fff" />
                  <rect x="14" y="76" width="10" height="10" fill="#fff" />
                  <rect x="38" y="8" width="6" height="6" />
                  <rect x="50" y="14" width="6" height="6" />
                  <rect x="38" y="22" width="14" height="6" />
                  <rect x="42" y="38" width="6" height="6" />
                  <rect x="56" y="42" width="6" height="14" />
                  <rect x="38" y="56" width="20" height="6" />
                  <rect x="68" y="40" width="6" height="6" />
                  <rect x="80" y="56" width="6" height="6" />
                  <rect x="44" y="72" width="6" height="6" />
                  <rect x="60" y="78" width="14" height="6" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          <Stat valor={2500} suffix="+" label="locales que confían" />
          <Stat valor={Math.max(30000000, totalEscaneos * 1000)} suffix="" label="escaneos al mes" />
          <Stat valor={30} suffix="%" label="más de ticket medio" />
          <Stat valor={12} suffix=" min" label="ahorrados por mesa" />
        </div>
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <section className={styles.section} id="como-funciona">
        <Reveal>
          <div className={styles.sectionEyebrow}>Cómo funciona</div>
          <h2 className={styles.sectionTitle}>Tres pasos. Cero apps.</h2>
          <p className={styles.sectionSub}>
            No prometemos un cambio de software. Prometemos que la próxima
            mesa que se siente, en menos de 30 segundos esté pidiendo.
          </p>
        </Reveal>

        <div className={styles.steps}>
          <Reveal delay={0}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>01 · ESCANEA</div>
              <h3 className={styles.stepTitle}>Apunta la cámara</h3>
              <p className={styles.stepDesc}>
                Cada mesa tiene su QR único impreso. Lo escanea, se le abre la
                carta de tu local en su móvil — sin descargar nada.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>02 · PIDE</div>
              <h3 className={styles.stepTitle}>Elige y pide</h3>
              <p className={styles.stepDesc}>
                Ve fotos, alérgenos, descripciones. Añade lo que quiera al
                carrito y manda el pedido. Llega directo a tu cocina.
              </p>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className={styles.stepCard}>
              <div className={styles.stepNum}>03 · PAGA</div>
              <h3 className={styles.stepTitle}>Cobra sin tocarlo</h3>
              <p className={styles.stepDesc}>
                Cuando termina, paga desde el mismo móvil. Reseña automática
                en Google. Tu equipo libera la mesa más rápido.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className={styles.section} id="producto" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className={styles.sectionEyebrow}>Producto</div>
          <h2 className={styles.sectionTitle}>
            Pensado para la barra real, no para la oficina.
          </h2>
          <p className={styles.sectionSub}>
            Cada feature responde a una pelea concreta de un local. Si no
            ahorra tiempo o aumenta ingresos, no entra.
          </p>
        </Reveal>

        <div className={styles.features}>
          {FEATURES.map((f, i) => (
            <Reveal
              key={f.titulo}
              delay={i * 80}
              className={f.size === "big" ? styles.featureBig : styles.featureSmall}
            >
              <div
                className={styles.featureCard}
                style={{ ["--feature-color" as string]: f.color, height: "100%" }}
              >
                <div className={styles.featureIcon} style={{ background: f.color }}>
                  {f.icono}
                </div>
                <h3 className={styles.featureTitle}>{f.titulo}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
                {f.statNum && (
                  <div className={styles.featureStat}>
                    <div className={styles.featureStatNum}>{f.statNum}</div>
                    <div className={styles.featureStatLabel}>{f.statLabel}</div>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ DEMOS POR SECTOR ============ */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <Reveal>
          <div className={styles.sectionEyebrow}>Demos</div>
          <h2 className={styles.sectionTitle}>
            Cada sector tiene su carta. Y su demo.
          </h2>
          <p className={styles.sectionSub}>
            Elige el tipo de local que más se parece al tuyo y míralo
            funcionar. Después lo personalizamos con tu marca.
          </p>
        </Reveal>

        <div className={styles.demos}>
          {DEMOS_PREVIEW.map((d, i) => (
            <Reveal key={d.slug} delay={i * 40}>
              <a
                href={`/?origen=demo:${d.slug}#contacto`}
                className={styles.demoCard}
                data-sector={d.slug}
              >
                {/* Escena de fondo por sector */}
                {d.slug === "discoteca" ? (
                  <DiscoBallScene />
                ) : d.slug === "lounge-club" ? (
                  <ShishaScene />
                ) : d.slug === "cocteleria" ? (
                  <GlassesScene />
                ) : d.slug === "cerveceria" ? (
                  <BeerMugsScene />
                ) : d.slug === "hotel" ? (
                  <HotelBellScene />
                ) : d.slug === "pub" ? (
                  <PubGamesScene />
                ) : d.slug === "bar-restaurante" ? (
                  <MeatCutScene />
                ) : d.slug === "cafeteria" ? (
                  <EmojiScene glyph={d.bg} centered />
                ) : (
                  <EmojiScene glyph={d.bg} />
                )}
                <div className={styles.demoIcon} style={{ color: d.color }}>
                  {d.icono}
                </div>
                <div className={styles.demoName}>{d.nombre}</div>
                <div className={styles.demoLink}>Pedir demo de mi {d.nombre.toLowerCase()} →</div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CASOS DE ÉXITO ============ */}
      {casos.length > 0 && (
        <section className={styles.section} id="clientes" style={{ paddingTop: 0 }}>
          <Reveal>
            <div className={styles.sectionEyebrow}>Clientes</div>
            <h2 className={styles.sectionTitle}>Quienes ya confían en nosotros</h2>
            <p className={styles.sectionSub}>
              <strong style={{ color: "#a78bfa" }}>
                {totalEscaneos.toLocaleString("es-ES")}
              </strong>{" "}
              escaneos este mes entre los locales activos.
            </p>
          </Reveal>

          <div className={styles.casosMarqueeWrap}>
            <div className={styles.casosMarqueeTrack}>
              {/* Duplicamos la lista — el track se traslada -50% y reinicia
                  sin saltos: el segundo set ocupa el hueco del primero. */}
              {[...casos, ...casos].map((c, i) => (
                <div
                  key={`${c.id}-${i}`}
                  className={`${styles.casoCard} ${c.destacado === 1 ? styles.casoDestacado : ""}`}
                  aria-hidden={i >= casos.length}
                >
                  {c.destacado === 1 && <span className={styles.casoBadge}>DESTACADO</span>}
                  <div className={styles.casoEmpresa}>{c.empresa}</div>
                  <div className={styles.casoSector}>{c.sector}</div>
                  <div className={styles.casoStats}>
                    <div>
                      <div className={styles.casoStatLabel}>QR activos</div>
                      <div className={styles.casoStatValue}>{c.qr_activos}</div>
                    </div>
                    <div>
                      <div className={styles.casoStatLabel}>Escaneos/mes</div>
                      <div className={styles.casoStatValue}>
                        {c.escaneos_mes.toLocaleString("es-ES")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ TESTIMONIOS ============ */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <Reveal>
          <div className={styles.sectionEyebrow}>Lo que dicen</div>
          <h2 className={styles.sectionTitle}>
            Locales que dejaron de perseguir mesas.
          </h2>
        </Reveal>

        <div className={styles.testimonios}>
          {TESTIMONIOS.map((t, i) => (
            <Reveal key={t.nombre} delay={i * 100}>
              <div className={styles.testCard}>
                <div className={styles.testStars}>★★★★★</div>
                <p className={styles.testQuote}>"{t.quote}"</p>
                <div className={styles.testAuthor}>
                  <div className={styles.testAvatar} style={{ background: t.color }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className={styles.testName}>{t.nombre}</div>
                    <div className={styles.testRole}>
                      {t.rol} · {t.local}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ PLANES ============ */}
      <section className={styles.section} id="planes" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className={styles.sectionEyebrow}>Planes</div>
          <h2 className={styles.sectionTitle}>Empieza con lo que necesitas hoy.</h2>
          <p className={styles.sectionSub}>
            Precios por local. Sin permanencia, sin comisión sobre tus
            ventas. Si crece tu negocio, crece el plan — nunca al revés.
          </p>
        </Reveal>

        <div className={styles.planes}>
          <Reveal delay={0}>
            <div className={styles.planCard}>
              <div className={styles.planName}>Básico</div>
              <div className={styles.planPrice}>
                <span className={styles.planPriceAmount}>39 €</span>
                <span className={styles.planPriceUnit}>/local/mes</span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.92rem", margin: 0 }}>
                Para locales de hasta 30 mesas. Lo justo para arrancar.
              </p>
              <ul className={styles.planList}>
                <li>Hasta 30 QR de mesa</li>
                <li>Carta digital ilimitada</li>
                <li>Categorías y alérgenos</li>
                <li>Soporte por email</li>
              </ul>
              <a href="#contacto" className={styles.ctaSecondary} style={{ marginTop: "auto" }}>
                Empezar
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className={`${styles.planCard} ${styles.planPopular}`}>
              <span className={styles.planTag}>MÁS ELEGIDO</span>
              <div className={styles.planName}>Profesional</div>
              <div className={styles.planPrice}>
                <span className={styles.planPriceAmount}>79 €</span>
                <span className={styles.planPriceUnit}>/local/mes</span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.92rem", margin: 0 }}>
                Para locales que ya tienen volumen y quieren analytics.
              </p>
              <ul className={styles.planList}>
                <li>Hasta 80 QR de mesa</li>
                <li>Pago integrado en el QR</li>
                <li>Analítica completa por mesa</li>
                <li>Productos destacados y upsells</li>
                <li>Soporte por WhatsApp</li>
              </ul>
              <a href="#contacto" className={styles.ctaPrimary} style={{ marginTop: "auto", justifyContent: "center" }}>
                Probar 14 días <span>→</span>
              </a>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className={styles.planCard}>
              <div className={styles.planName}>Enterprise</div>
              <div className={styles.planPrice}>
                <span className={styles.planPriceAmount}>A medida</span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.92rem", margin: 0 }}>
                Cadenas, franquicias y grupos hoteleros con múltiples locales.
              </p>
              <ul className={styles.planList}>
                <li>Multilocal centralizado</li>
                <li>Integraciones POS, TPV, ERPs</li>
                <li>Branding personalizado</li>
                <li>Manager de cuenta dedicado</li>
                <li>SLA de soporte 24/7</li>
              </ul>
              <a href="#contacto" className={styles.ctaSecondary} style={{ marginTop: "auto" }}>
                Hablar con ventas
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CTA grande ============ */}
      <div className={styles.bigCta}>
        <Reveal>
          <div className={styles.bigCtaInner}>
            <h2 className={styles.bigCtaTitle}>
              ¿Listo para vaciar mesas más rápido y subir el ticket medio?
            </h2>
            <p className={styles.bigCtaSub}>
              Te enseñamos en 15 minutos cómo se vería en tu local. Sin compromiso,
              sin tarjeta. Empieza este mes.
            </p>
            <a href="#contacto" className={styles.ctaPrimary}>
              Solicitar demo <span>→</span>
            </a>
          </div>
        </Reveal>
      </div>

      {/* ============ FORM contacto ============ */}
      <section id="contacto" style={{ padding: "1rem 0 5rem" }}>
        <div className={styles.formWrap}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div className={styles.sectionEyebrow}>Contacto</div>
              <h2 className={styles.sectionTitle}>Cuéntanos tu caso</h2>
              <p style={{ color: "#b3b3c2", marginTop: 0 }}>
                Te respondemos en menos de 24 horas con una demo personalizada.
              </p>
            </div>
          </Reveal>

          {sp.ok === "1" ? (
            <div className={styles.formSuccess}>
              <div style={{ fontSize: "1.8rem", color: "#4ade80", marginBottom: "0.5rem" }}>✓</div>
              <div style={{ fontWeight: 700, fontSize: "1.15rem" }}>¡Solicitud recibida!</div>
              <div style={{ color: "#b3b3c2", marginTop: "0.5rem", fontSize: "0.94rem" }}>
                Nos pondremos en contacto contigo en menos de 24h. Mientras,{" "}
                <a href="#producto" style={{ color: "#a78bfa", textDecoration: "underline" }}>
                  mira cómo funciona
                </a>
                .
              </div>
            </div>
          ) : (
            <form action={enviarLead} className={styles.form}>
              <input type="hidden" name="origen" value={sp.origen ?? "landing"} />
              <input type="text" name="hp" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden />

              {sp.error && (
                <div className={styles.formError}>
                  {sp.error === "email" ? "El email no parece válido." : "Faltan campos obligatorios."}
                </div>
              )}

              <div>
                <label htmlFor="lead-nombre" className={styles.formLabel}>Tu nombre *</label>
                <input id="lead-nombre" name="nombre" type="text" required placeholder="Cómo te llamas" className={styles.formInput} />
              </div>
              <div>
                <label htmlFor="lead-email" className={styles.formLabel}>Email *</label>
                <input id="lead-email" name="email" type="email" required placeholder="tu@email.com" className={styles.formInput} />
              </div>

              <div>
                <label htmlFor="lead-telefono" className={styles.formLabel}>Teléfono</label>
                <input id="lead-telefono" name="telefono" type="tel" placeholder="+34 600 000 000" className={styles.formInput} />
              </div>
              <div>
                <label htmlFor="lead-empresa" className={styles.formLabel}>Nombre del local</label>
                <input id="lead-empresa" name="empresa" type="text" placeholder="Tu bar / restaurante" className={styles.formInput} />
              </div>

              <div>
                <label htmlFor="lead-sector" className={styles.formLabel}>Tipo de local</label>
                <select id="lead-sector" name="sector" defaultValue="" className={styles.formSelect}>
                  <option value="">— Elige uno —</option>
                  <option value="lounge-club">Lounge Club</option>
                  <option value="cocteleria">Coctelería</option>
                  <option value="pub">Pub</option>
                  <option value="bar-restaurante">Bar / Restaurante</option>
                  <option value="cafeteria">Cafetería</option>
                  <option value="discoteca">Discoteca</option>
                  <option value="cerveceria">Cervecería</option>
                  <option value="hotel">Hotel</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label htmlFor="lead-mesas" className={styles.formLabel}>Mesas aprox.</label>
                <input id="lead-mesas" name="mesas" type="number" min="1" max="999" placeholder="ej. 12" className={styles.formInput} />
              </div>

              <div className={styles.formFull}>
                <label htmlFor="lead-mensaje" className={styles.formLabel}>Cuéntanos lo que necesitas</label>
                <textarea id="lead-mensaje" name="mensaje" rows={4} placeholder="Lo que quieras: timing, dudas, lo que esperas de la herramienta…" className={styles.formTextarea} />
              </div>

              <div className={styles.formFull} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                  * campos obligatorios
                </div>
                <button type="submit" className={styles.ctaPrimary}>
                  Solicitar demo <span>→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <div className={styles.footerBrand}>
              <span style={{ color: "#a78bfa" }}>▲</span> VerticeQR
            </div>
            <p className={styles.footerTagline}>
              Carta digital y pedidos por QR para hostelería. Pensado para la
              barra real, no para la oficina.
            </p>
          </div>
          <div className={styles.footerCol}>
            <h4>Producto</h4>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#contacto">Pedir demo</a>
            <a href="#planes">Precios</a>
            <a href="/login">Acceder</a>
          </div>
          <div className={styles.footerCol}>
            <h4>Empresa</h4>
            <a href="#clientes">Clientes</a>
            <a href="#contacto">Contacto</a>
            <a href="mailto:vertice605@gmail.com">vertice605@gmail.com</a>
          </div>
          <div className={styles.footerCol}>
            <h4>Legal</h4>
            <a href="#">Términos</a>
            <a href="#">Privacidad</a>
            <a href="#">Cookies</a>
          </div>
        </div>
        <div className={styles.footerLegal}>
          <span>© {new Date().getFullYear()} VerticeQR · Hecho con cariño en España</span>
          <span>v0.3</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ valor, suffix, label }: { valor: number; suffix: string; label: string }) {
  return (
    <div className={styles.statCell}>
      <div className={styles.statNum}>
        <Counter value={valor} suffix={suffix} />
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

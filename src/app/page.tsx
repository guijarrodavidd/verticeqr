import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";
import { crearLead } from "@/lib/leads";
import Nav from "./_components/Nav";
import Reveal from "./_components/Reveal";
import Counter from "./_components/Counter";
import HeroPhone from "./_components/HeroPhone";
import ScrollProgress from "./_components/ScrollProgress";
import Logo from "./_components/Logo";
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

const DEMOS_PREVIEW = [
  { slug: "romanssera", nombre: "Romanssera", tipo: "Tapassería", color: "#b03326" },
  { slug: "pizzeria", nombre: "Forno Sessanta", tipo: "Pizzería", color: "#cf6233" },
  { slug: "hamburgueseria", nombre: "Bonfire Burger", tipo: "Burgers a la brasa", color: "#d4402f" },
  { slug: "cafeteria", nombre: "Ostra & Sol", tipo: "Cafetería & brunch", color: "#c07a4a" },
  { slug: "cachimbas", nombre: "Magma", tipo: "Lounge & cachimbas", color: "#c2871f" },
  { slug: "fogon-paisa", nombre: "El Fogón Paisa", tipo: "Cocina paisa", color: "#b3392f" },
  { slug: "sereno", nombre: "Sereno", tipo: "Coctelería de autor", color: "#b58620" },
  { slug: "trellat", nombre: "Trellat", tipo: "Bar de barrio", color: "#7a7a4a" },
];

// Bento 2×2 con captura real del producto (de nuestras demos).
type FeatureSize = "big" | "small";
const FEATURES: {
  size: FeatureSize;
  img: string;
  imgPos?: string;
  color: string;
  titulo: string;
  desc: string;
  statValue?: number;
  statPrefix?: string;
  statSuffix?: string;
  statLabel?: string;
}[] = [
  {
    size: "big",
    img: "/features/ticket.jpg",
    imgPos: "center center",
    color: "#9a1f2b",
    titulo: "Sube el ticket medio",
    desc: "Diseñamos los upsells y los destacados según TU carta: la sugerencia justa, en el momento justo. La gente pide más cuando se lo pones fácil.",
    statValue: 30,
    statPrefix: "+",
    statSuffix: "%",
    statLabel: "de ticket medio en los locales con upsells a medida, primeros 90 días",
  },
  {
    size: "small",
    img: "/features/rapido.jpg",
    imgPos: "center 32%",
    color: "#9a1f2b",
    titulo: "Sirve más rápido",
    desc: "El pedido sale directo a cocina y barra. Tu equipo deja de tomar nota y de perseguir mesas.",
  },
  {
    size: "small",
    img: "/features/apps.jpg",
    imgPos: "center center",
    color: "#6c7a43",
    titulo: "Cero apps",
    desc: "El cliente escanea con la cámara y abre tu carta. Nada que descargar ni instalar.",
  },
  {
    size: "big",
    img: "/features/datos.jpg",
    imgPos: "center center",
    color: "#8c1518",
    titulo: "Tu carta convertida en datos",
    desc: "Qué se pide, cuándo, con qué se combina, qué se queda en el carrito. Decidir el menú deja de ser intuición — y nosotros lo afinamos contigo.",
    statValue: 100,
    statSuffix: "%",
    statLabel: "de tus pedidos quedan medidos, sin apuntar nada a mano",
  },
];

// Cómo funciona: 3 pasos con foto real + texto corto.
const STEPS: { num: string; img: string; title: string; desc: string }[] = [
  { num: "01 · Escanea", img: "/steps/escanea.jpg", title: "Se sienta y ya tiene tu carta", desc: "Sin esperas y sin descargar nada." },
  { num: "02 · Pide", img: "/steps/pide.jpg", title: "Pide él, sin malentendidos", desc: "Entra tal cual a cocina. Cero errores de oído." },
  { num: "03 · Paga", img: "/steps/paga.jpg", title: "Paga y te deja reseña", desc: "Sin que tu equipo cruce la sala para cobrar." },
];

// Diferenciador: tabla comparativa criterio a criterio.
const COMPARE_ROWS: { crit: string; bad: string; good: string }[] = [
  { crit: "Tu carta", bad: "La misma plantilla que a todos", good: "Con tu branding: logo, colores y tus platos" },
  { crit: "Quién la monta", bad: "Te peleas tú con el editor", good: "La montamos nosotros, llave en mano" },
  { crit: "Las fotos", bad: "De stock, no venden", good: "Reales y profesionales, dan hambre" },
  { crit: "Upsells", bad: "Genéricos o ninguno", good: "Diseñados para tu margen" },
  { crit: "Operativa", bad: "Solo la carta", good: "Cocina, barra, TPV o reservas, según tu caso" },
  { crit: "Contabilidad", bad: "Aparte, a mano y en Excel", good: "Automatizada, dentro del sistema" },
  { crit: "Soporte", bad: "El enlace y a apañarte", good: "Te acompañamos y lo afinamos contigo" },
];

const TESTIMONIOS = [
  {
    quote: "Pasamos de 4 a 7 rotaciones por noche sin contratar a nadie. El cliente pide cuando quiere y no buscamos al camarero como locos.",
    nombre: "Laura Vega",
    rol: "Propietaria",
    local: "El Fogón Paisa",
    avatar: "LV",
    color: "#8c1518",
  },
  {
    quote: "En tres meses, ticket medio +27%. La gente cuando ve la foto del cocktail signature lo pide, así de simple.",
    nombre: "Marcos Rey",
    rol: "Manager",
    local: "Hotel Mediterránea",
    avatar: "MR",
    color: "#c2871f",
  },
  {
    quote: "Los chicos del turno de tarde ahora se centran en servir mesas y no en cobrar. Las propinas se han disparado.",
    nombre: "Elena Costa",
    rol: "CEO",
    local: "Logística Norte",
    avatar: "EC",
    color: "#6c7a43",
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
      <ScrollProgress />
      <Nav />

      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot}>A MEDIDA</span>
              No es una plantilla. Es tu sistema.
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroLine}>
                <span>Tu cliente <i className={styles.heroAccent}>escanea</i>,</span>
              </span>
              <span className={styles.heroLine}>
                <span>pide y paga.</span>
              </span>
            </h1>
            <p className={styles.heroSub}>
              No vendemos cartas digitales en serie. Estudiamos tu local y te
              montamos el sistema a medida — tu carta con tu branding, fotos,
              upsells y hasta la contabilidad automatizada — para servir más
              rápido y subir el ticket medio. Cada local es un mundo.
            </p>
            <div className={styles.heroCtas}>
              <a href="#contacto" className={styles.ctaPrimary}>
                Pide tu demo a medida <span>→</span>
              </a>
              <a href="#producto" className={styles.ctaSecondary}>
                Ver cómo funciona
              </a>
            </div>
            <p className={styles.heroCtaNote}>
              <strong>Hacemos la tuya en menos de 24 horas</strong>, con tu marca y
              tu carta. Sin compromiso.
            </p>
            <div className={styles.heroTrust}>
              <span className={styles.heroTrustStars}>★★★★★</span>
              <span>
                <strong>4.9/5</strong> · valoración media
              </span>
              <span style={{ color: "#b9a98f" }}>•</span>
              <span>
                Confían <strong>+2.500</strong> locales
              </span>
            </div>
          </div>

          <HeroPhone />
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          <Stat valor={30} prefix="+" suffix="%" label="de ticket medio con upsells pensados para tu carta" />
          <Stat valor={1} prefix="+" suffix=" ronda" label="por visita: el cliente repite sin tener que buscar al camarero" />
          <Stat valor={30} suffix=" seg" label="y el cliente ya está pidiendo, sin esperar a nadie" />
          <Stat valor={3} prefix="×" suffix="" label="más reseñas en Google, pedidas en automático al pagar" />
        </div>
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <section className={styles.section} id="como-funciona">
        <Reveal>
          <div className={styles.sectionEyebrow}>Cómo funciona</div>
          <h2 className={styles.sectionTitle}>Tres pasos para tu cliente. Cero líos para ti.</h2>
          <p className={styles.sectionSub}>
            No tienes que cambiar de software ni formar a nadie. Tu cliente
            escanea y pide en segundos — sin errores de comanda, sin que tu
            equipo cruce la sala diez veces, sin notas perdidas. Tú solo ves
            llegar los pedidos, listos para preparar.
          </p>
        </Reveal>

        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 120}>
              <div className={styles.stepCard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.stepImg} src={s.img} alt="" loading="lazy" />
                <div className={styles.stepBody}>
                  <div className={styles.stepNum}>{s.num}</div>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
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
                style={{ ["--feature-color" as string]: f.color }}
              >
                <div className={styles.featureShot}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.img}
                    alt=""
                    loading="lazy"
                    style={{ objectPosition: f.imgPos ?? "top center" }}
                  />
                </div>
                <div className={styles.featureInner}>
                  <h3 className={styles.featureTitle}>{f.titulo}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                  {f.statValue != null && (
                    <div className={styles.featureStat}>
                      <div className={styles.featureStatNum}>
                        {f.statPrefix}
                        <Counter value={f.statValue} suffix={f.statSuffix ?? ""} />
                      </div>
                      <div className={styles.featureStatLabel}>{f.statLabel}</div>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ A MEDIDA (diferenciador) ============ */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <Reveal>
          <div className={styles.sectionEyebrow}>Por qué nosotros</div>
          <h2 className={styles.sectionTitle}>
            Una plantilla no te resuelve el día. Tu sistema, sí.
          </h2>
          <p className={styles.sectionSub}>
            La mayoría te vende la misma carta digital que a todos y te deja
            solo. Nosotros estudiamos tu local y te lo montamos a medida. Mira
            la diferencia:
          </p>
        </Reveal>

        <Reveal>
          <div className={styles.vstable}>
            {/* cabecera */}
            <div className={`${styles.vstCell} ${styles.vstCorner}`} />
            <div className={`${styles.vstCell} ${styles.vstHeadBad}`}>Una plantilla</div>
            <div className={`${styles.vstCell} ${styles.vstHeadGood}`}>
              <span className={styles.vstBrand}>VerticeQR</span>
              <span className={styles.vstBadge}>a medida</span>
            </div>

            {/* filas */}
            {COMPARE_ROWS.map((r) => (
              <div key={r.crit} className={styles.vstRowContents}>
                <div className={`${styles.vstCell} ${styles.vstCrit}`}>{r.crit}</div>
                <div className={`${styles.vstCell} ${styles.vstBad}`}>
                  <span className={styles.vstX}>✕</span>
                  <span>{r.bad}</span>
                </div>
                <div className={`${styles.vstCell} ${styles.vstGood}`}>
                  <span className={styles.vstCheck}>✓</span>
                  <span>{r.good}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className={styles.compareFooter}>
          <p className={styles.compareClose}>
            Cada local es un mundo. <strong>El tuyo también.</strong>
          </p>
          <a href="#contacto" className={styles.compareCta}>
            Quiero el mío a medida <span>→</span>
          </a>
        </div>
      </section>

      {/* ============ DEMOS ============ */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <Reveal>
          <div className={styles.sectionEyebrow}>Demos</div>
          <h2 className={styles.sectionTitle}>
            Cartas reales, funcionando.
          </h2>
          <p className={styles.sectionSub}>
            Cada una es una carta digital de verdad. Ábrela, navega el menú y
            pide como lo haría tu cliente. Después la personalizamos con tu marca.
          </p>
        </Reveal>

        <div className={styles.demos}>
          {DEMOS_PREVIEW.map((d, i) => (
            <Reveal key={d.slug} delay={i * 40}>
              <a
                href={`/?origen=demo:${d.slug}#contacto`}
                className={styles.demoCard}
                style={{ ["--demo-color" as string]: d.color }}
              >
                <div className={styles.demoIcon}>{d.nombre.charAt(0)}</div>
                <div className={styles.demoName}>{d.nombre}</div>
                <div className={styles.demoTipo}>{d.tipo}</div>
                <div className={styles.demoLink}>Ver demo →</div>
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
              <strong style={{ color: "#7c1622" }}>
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
          <div className={styles.sectionEyebrow}>Presupuesto</div>
          <h2 className={styles.sectionTitle}>Sin planes de catálogo. Tu sistema, tu presupuesto.</h2>
          <p className={styles.sectionSub}>
            No tenemos paquetes cerrados con precio de góndola. Estudiamos tu
            local y te pasamos un presupuesto a medida — pagas por lo que tu
            negocio necesita, ni más ni menos.
          </p>
        </Reveal>

        <Reveal>
          <div className={styles.planMedida}>
            <div className={styles.planMedidaMain}>
              <span className={styles.planMedidaTag}>Hecho a medida</span>
              <div className={styles.planMedidaName}>Tu sistema, a tu medida</div>
              <p className={styles.planMedidaSub}>
                Cada local es un mundo. Montamos solo lo que mueve la aguja en el tuyo:
              </p>
              <ul className={styles.planMedidaList}>
                <li>Carta a medida con tu branding y tus fotos</li>
                <li>Upsells y destacados según tu carta</li>
                <li>QR por mesa con tu identidad</li>
                <li>Cocina, barra, TPV o reservas — según tu caso</li>
                <li>Contabilidad automatizada: ventas y cierres sin Excel</li>
                <li>Analítica por mesa y acompañamiento continuo</li>
                <li>Sin permanencia · sin comisión sobre tus ventas</li>
              </ul>
            </div>
            <div className={styles.planMedidaAside}>
              <div className={styles.planMedidaPriceLabel}>Inversión</div>
              <div className={styles.planMedidaPrice}>A medida</div>
              <p className={styles.planMedidaNote}>
                Te pasamos el presupuesto en menos de 24&nbsp;h, sin compromiso.
              </p>
              <a href="#contacto" className={styles.ctaPrimary} style={{ justifyContent: "center" }}>
                Pide tu presupuesto <span>→</span>
              </a>
            </div>
          </div>
        </Reveal>
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
              <p style={{ color: "#6d5f4e", marginTop: 0 }}>
                Te respondemos en menos de 24 horas con una demo personalizada.
              </p>
            </div>
          </Reveal>

          {sp.ok === "1" ? (
            <div className={styles.formSuccess}>
              <div style={{ fontSize: "1.8rem", color: "#6c7a43", marginBottom: "0.5rem" }}>✓</div>
              <div style={{ fontWeight: 700, fontSize: "1.15rem" }}>¡Solicitud recibida!</div>
              <div style={{ color: "#6d5f4e", marginTop: "0.5rem", fontSize: "0.94rem" }}>
                Nos pondremos en contacto contigo en menos de 24h. Mientras,{" "}
                <a href="#producto" style={{ color: "#7c1622", textDecoration: "underline" }}>
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
              <Logo />
            </div>
            <p className={styles.footerTagline}>
              Sistemas de pedido por QR hechos a medida para hostelería. No
              plantillas: el sistema que tu local necesita. Cada local es un mundo.
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

function Stat({
  valor,
  suffix,
  label,
  prefix = "",
}: {
  valor: number;
  suffix: string;
  label: string;
  prefix?: string;
}) {
  return (
    <div className={styles.statCell}>
      <div className={styles.statNum}>
        {prefix}
        <Counter value={valor} suffix={suffix} />
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

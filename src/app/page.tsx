import { redirect } from "next/navigation";
import { crearLead } from "@/lib/leads";
import { CALENDLY_URL } from "@/lib/site";
import Nav from "./_components/Nav";
import Reveal from "./_components/Reveal";
import Counter from "./_components/Counter";
import HeroPhone from "./_components/HeroPhone";
import Calculadora from "./_components/Calculadora";
import SmoothScroll from "./_components/SmoothScroll";
import ScrollProgress from "./_components/ScrollProgress";
import Logo from "./_components/Logo";
import styles from "./landing.module.css";

export const dynamic = "force-dynamic";

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
    color: "#7f5f2e",
    titulo: "Sube el GOP, no la plantilla",
    desc: "El huésped pide room service y extras desde la habitación, con los destacados que más margen te dejan. El ingreso de F&B sube y, casi sin coste añadido, va directo a tu GOP.",
    statValue: 0,
    statPrefix: "",
    statSuffix: "",
    statLabel: "personas que sumas a tu equipo para ofrecerlo — lo lleva el que ya tienes",
  },
  {
    size: "small",
    img: "/features/rapido.jpg",
    imgPos: "center 32%",
    color: "#7f5f2e",
    titulo: "Tu equipo deja de subir a las habitaciones",
    desc: "Sin llamadas a recepción ni recados perdidos. El pedido entra directo a cocina y office con el número de habitación.",
  },
  {
    size: "small",
    img: "/features/apps.jpg",
    imgPos: "center center",
    color: "#7c7b62",
    titulo: "Cero apps para el huésped",
    desc: "Escanea con la cámara el QR de su habitación y ya tiene tu carta. Nada que descargar ni instalar.",
  },
  {
    size: "big",
    img: "/features/datos.jpg",
    imgPos: "center center",
    color: "#46413a",
    titulo: "Tu F&B convertido en datos",
    desc: "Qué se pide en cada habitación, a qué hora, con qué se combina. Decides la carta y los precios con datos, no a intuición — y nosotros lo afinamos contigo.",
    statValue: 100,
    statSuffix: "%",
    statLabel: "de tu F&B medido, habitación a habitación, sin apuntar nada a mano",
  },
];

// Cómo funciona: 3 pasos con foto real + texto corto.
const STEPS: { num: string; img: string; title: string; desc: string }[] = [
  { num: "01 · Escanea", img: "/steps/escanea.jpg", title: "Escanea el QR de su habitación", desc: "Sin llamar a recepción y sin descargar nada." },
  { num: "02 · Pide", img: "/steps/pide.jpg", title: "Pide desde la habitación", desc: "Room service, restaurante o extras. Entra directo a cocina, sin malentendidos." },
  { num: "03 · Carga", img: "/steps/paga.jpg", title: "Lo carga a su cuenta", desc: "A la habitación o paga en el momento. Y te deja reseña al salir." },
];

// Diferenciador: tabla comparativa criterio a criterio.
const COMPARE_ROWS: { crit: string; bad: string; good: string }[] = [
  { crit: "El enfoque", bad: "Vender más volumen", good: "Subir tu GOP: más F&B sin sumar coste" },
  { crit: "Tu carta", bad: "La misma plantilla que a todos", good: "Con la identidad de tu hotel: marca, fotos y carta" },
  { crit: "Quién lo monta", bad: "Te peleas tú con el editor", good: "Lo montamos nosotros, llave en mano" },
  { crit: "Tus sistemas", bad: "Otra plataforma más que sumar", good: "Convive con tu PMS y tu TPV — o te instalamos el nuestro" },
  { crit: "El personal", bad: "Contratar para dar el servicio", good: "Lo lleva el equipo que ya tienes" },
  { crit: "Puesta en marcha", bad: "Proyecto grande y arriesgado", good: "Empiezas por una pieza, sin riesgo" },
  { crit: "Acompañamiento", bad: "El enlace y a apañarte", good: "Te enseñamos cuánto ganarías y lo afinamos contigo" },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<LandingSP>;
}) {
  const sp = await searchParams;

  return (
    <div className={styles.page}>
      <ScrollProgress />
      <SmoothScroll />
      <Nav />

      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} id="heroBg" />
        <div className={styles.heroGrid}>
          <div>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot}>HOTELES</span>
              A medida para tu hotel boutique.
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroLine}>
                <span>Vendes lo mismo.</span>
              </span>
              <span className={styles.heroLine}>
                <span>Ganas <i className={styles.heroAccent}>menos</i> cada año.</span>
              </span>
            </h1>
            <p className={styles.heroSub}>
              Las habitaciones ya no crecen y los costes se comen tu margen. El
              F&amp;B es el único ingreso que todavía sube — y la mayoría de tu
              hotel se queda sin pedir. Te montamos el sistema de room service a
              medida para capturarlo en cada habitación, <strong>sin sumar una
              sola persona a tu equipo</strong>.
            </p>
            <div className={styles.heroCtas}>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
                Reserva una reunión con el equipo <span>→</span>
              </a>
              <a href="#producto" className={styles.ctaSecondary}>
                Ver cómo funciona
              </a>
            </div>
            <p className={styles.heroCtaNote}>
              <strong>20 minutos, sin compromiso.</strong> Te enseñamos cuánto
              F&amp;B estás dejando en la mesa cada mes y cómo recuperarlo en tu
              hotel.
            </p>
          </div>

          <HeroPhone />
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          <Stat valor={80} suffix=" %" label="del ingreso no-habitación de un hotel sale del F&B — el punto que aún crece*" />
          <Stat valor={11} prefix="+" suffix=",2 %" label="de precio sostenible por cada punto que sube tu nota de reseñas*" />
          <Stat valor={0} suffix="" label="personas extra al equipo: el sistema lo lleva el que ya tienes" />
          <Stat valor={24} suffix=" h" label="y tienes tu demo a medida, con la marca del hotel, montada" />
        </div>
        <div className={styles.statsFootnote}>* Según estudios del sector (AHLA, CBRE 2025-26). Tendencias aplicables a España.</div>
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <section className={styles.section} id="como-funciona">
        <Reveal>
          <div className={styles.sectionEyebrow}>Cómo funciona</div>
          <h2 className={styles.sectionTitle}>Tres pasos para tu huésped. Cero líos para tu equipo.</h2>
          <p className={styles.sectionSub}>
            No cambias de PMS ni formas a nadie. El huésped escanea el QR de su
            habitación y pide en segundos — sin llamadas a recepción, sin recados
            perdidos, sin que nadie suba a tomar nota. Tú solo ves llegar los
            pedidos, listos para preparar y cargar a su cuenta.
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
            Solo lo que mueve tu margen.
          </h2>
          <p className={styles.sectionSub}>
            Cada función sube el F&amp;B o te quita coste de personal. Ni una
            pantalla de relleno.
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

      {/* ============ CALCULADORA F&B ============ */}
      <section className={styles.section} id="calculadora" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className={styles.sectionEyebrow}>Calculadora</div>
          <h2 className={styles.sectionTitle}>
            ¿Cuánto F&amp;B se te escapa cada mes?
          </h2>
          <p className={styles.sectionSub}>
            Ajusta los datos de tu hotel y te damos una estimación al instante.
            Sin dejar ningún dato.
          </p>
        </Reveal>
        <Reveal>
          <Calculadora />
        </Reveal>
      </section>

      {/* ============ A MEDIDA (diferenciador) ============ */}
      <section className={styles.section} style={{ paddingTop: 0 }}>
        <Reveal>
          <div className={styles.sectionEyebrow}>Por qué nosotros</div>
          <h2 className={styles.sectionTitle}>
            Una plantilla no sube tu GOP. Tu sistema, sí.
          </h2>
          <p className={styles.sectionSub}>
            La mayoría te vende la misma carta digital que a todos y te deja solo
            frente a tu PMS. Nosotros estudiamos tu hotel y te lo montamos a
            medida, conviviendo con lo que ya tienes. Mira la diferencia:
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
            Cada hotel es un mundo. <strong>El tuyo también.</strong>
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.compareCta}>
            Reserva una reunión <span>→</span>
          </a>
        </div>
      </section>

      {/* ============ PLANES ============ */}
      <section className={styles.section} id="planes" style={{ paddingTop: 0 }}>
        <Reveal>
          <div className={styles.sectionEyebrow}>Presupuesto</div>
          <h2 className={styles.sectionTitle}>Sin planes de catálogo. Tu hotel, tu presupuesto.</h2>
          <p className={styles.sectionSub}>
            No tenemos paquetes cerrados con precio de góndola. Estudiamos tu
            hotel y te pasamos un presupuesto a medida — y antes te enseñamos
            cuánto ganarías. Pagas por lo que mueve tu GOP, ni más ni menos.
          </p>
        </Reveal>

        <Reveal>
          <div className={styles.planMedida}>
            <div className={styles.planMedidaMain}>
              <span className={styles.planMedidaTag}>Hecho a medida</span>
              <div className={styles.planMedidaName}>Tu sistema de F&B, a tu medida</div>
              <p className={styles.planMedidaSub}>
                Cada hotel es un mundo. Montamos solo lo que mueve tu GOP:
              </p>
              <ul className={styles.planMedidaList}>
                <li>Carta de room service y restaurante con la marca del hotel</li>
                <li>Pedido desde la habitación, sin apps ni llamadas</li>
                <li>Carga a la cuenta del huésped o pago en el momento</li>
                <li>QR por habitación con tu identidad</li>
                <li>Convive con tu PMS y TPV — o te instalamos el nuestro</li>
                <li>Datos de F&B por habitación y acompañamiento continuo</li>
                <li>Sin permanencia · sin comisión sobre tus ventas</li>
              </ul>
            </div>
            <div className={styles.planMedidaAside}>
              <div className={styles.planMedidaPriceLabel}>Inversión</div>
              <div className={styles.planMedidaPrice}>A medida</div>
              <p className={styles.planMedidaNote}>
                En la reunión te enseñamos el cálculo y te pasamos el presupuesto
                a medida. Sin compromiso.
              </p>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary} style={{ justifyContent: "center" }}>
                Reserva una reunión <span>→</span>
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
              ¿Listo para subir tu GOP sin sumar personal?
            </h2>
            <p className={styles.bigCtaSub}>
              En 20 minutos con el equipo te enseñamos cuánto F&amp;B estás
              dejando en cada habitación y cómo recuperarlo. Sin compromiso, sin
              tarjeta.
            </p>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
              Reserva una reunión con el equipo <span>→</span>
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
              <h2 className={styles.sectionTitle}>Hablemos de tu hotel</h2>
              <p style={{ color: "var(--ink-soft)", marginTop: 0 }}>
                Lo mejor es verlo juntos:{" "}
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-deep)", fontWeight: 600, textDecoration: "underline" }}>
                  reserva una reunión con el equipo
                </a>
                . ¿Prefieres que te escribamos? Déjanos tus datos y te respondemos
                en menos de 24 h.
              </p>
            </div>
          </Reveal>

          {sp.ok === "1" ? (
            <div className={styles.formSuccess}>
              <div style={{ fontSize: "1.8rem", color: "#7d6038", marginBottom: "0.5rem" }}>✓</div>
              <div style={{ fontWeight: 700, fontSize: "1.15rem" }}>¡Solicitud recibida!</div>
              <div style={{ color: "#6d5f4e", marginTop: "0.5rem", fontSize: "0.94rem" }}>
                Nos pondremos en contacto contigo en menos de 24h. Mientras,{" "}
                <a href="#producto" style={{ color: "#7d6038", textDecoration: "underline" }}>
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
                <label htmlFor="lead-empresa" className={styles.formLabel}>Nombre del hotel</label>
                <input id="lead-empresa" name="empresa" type="text" placeholder="Tu hotel" className={styles.formInput} />
              </div>

              <div>
                <label htmlFor="lead-sector" className={styles.formLabel}>Tipo de hotel</label>
                <select id="lead-sector" name="sector" defaultValue="" className={styles.formSelect}>
                  <option value="">— Elige uno —</option>
                  <option value="hotel-boutique">Hotel boutique</option>
                  <option value="hotel-independiente">Hotel independiente</option>
                  <option value="hotel-lujo">Hotel de lujo / 5★</option>
                  <option value="resort">Resort</option>
                  <option value="hostal-bb">Hostal / B&amp;B</option>
                  <option value="apartamentos">Apartamentos turísticos</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label htmlFor="lead-mesas" className={styles.formLabel}>Habitaciones aprox.</label>
                <input id="lead-mesas" name="mesas" type="number" min="1" max="999" placeholder="ej. 40" className={styles.formInput} />
              </div>

              <div className={styles.formFull}>
                <label htmlFor="lead-mensaje" className={styles.formLabel}>Cuéntanos lo que necesitas</label>
                <textarea id="lead-mensaje" name="mensaje" rows={4} placeholder="Lo que quieras: nº de habitaciones, si ya tienes room service, tu PMS, dudas…" className={styles.formTextarea} />
              </div>

              <div className={styles.formFull} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                  * campos obligatorios
                </div>
                <button type="submit" className={styles.ctaPrimary}>
                  Enviar <span>→</span>
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
              Sistema de room service y F&amp;B digital a medida para hoteles
              boutique. Subes el GOP sin sumar personal. Cada hotel es un mundo.
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
            <a href="#contacto">Contacto</a>
            <a href="mailto:vertice605@gmail.com">vertice605@gmail.com</a>
          </div>
          <div className={styles.footerCol}>
            <h4>Legal</h4>
            <a href="/terminos">Términos</a>
            <a href="/privacidad">Privacidad</a>
            <a href="/cookies">Cookies</a>
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

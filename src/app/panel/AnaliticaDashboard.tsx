"use client";

import { useMemo, useState } from "react";
import s from "./analitica.module.css";

/* ============================================================
   Panel de Analítica — datos de DEMOSTRACIÓN.
   Blanco limpio · Montserrat · iconos de línea (sin emojis).
   ============================================================ */

const NAV = [
  { n: "chart", label: "Analítica", active: true },
  { n: "bag", label: "Pedidos" },
  { n: "utensils", label: "Room service" },
  { n: "users", label: "Huéspedes" },
  { n: "sparkles", label: "Experiencias" },
  { n: "star", label: "Reseñas" },
];

const PERIODS = [
  { key: "hoy", label: "Hoy", f: 0.034 },
  { key: "semana", label: "Esta semana", f: 0.24 },
  { key: "30d", label: "Últimos 30 días", f: 1 },
  { key: "mes", label: "Mes pasado", f: 1 },
  { key: "3m", label: "3 meses", f: 3.1 },
  { key: "6m", label: "6 meses", f: 6.3 },
  { key: "1a", label: "1 año", f: 12.6 },
] as const;

const BASE = {
  costeHora: 14, costeSistema: 299,
  pedidos: 1284, consultas: 1550, ingresos: 18640,
  huespedes: 2106, reseñas: 216, experiencias: 174,
};
const MIN_PEDIDO = 4.5;
const MIN_CONSULTA = 2;

const nf = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const eur = (n: number) => nf(n) + " €";

function conic(segs: { pct: number; color: string }[]) {
  let acc = 0;
  return `conic-gradient(${segs.map((sg) => { const from = acc; acc += sg.pct; return `${sg.color} ${from}% ${acc}%`; }).join(", ")})`;
}
function areaPath(vals: number[], w: number, h: number, pad = 6) {
  const max = Math.max(...vals) * 1.15;
  const stepX = (w - pad * 2) / (vals.length - 1);
  const pts = vals.map((val, i) => [pad + i * stepX, h - pad - (val / max) * (h - pad * 2)]);
  const line = pts.map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(" ");
  const area = `${line} L ${pts[pts.length - 1][0]},${h - pad} L ${pts[0][0]},${h - pad} Z`;
  return { line, area };
}

const IDIOMAS = [
  { name: "Español", pct: 45, color: "#17181C" },
  { name: "Inglés", pct: 33, color: "#4A4F57" },
  { name: "Alemán", pct: 9, color: "#7A828D" },
  { name: "Francés", pct: 7, color: "#A9B0BA" },
  { name: "Italiano", pct: 6, color: "#CFD4DB" },
];
const TOP = [
  { name: "Desayuno continental", val: 268 },
  { name: "Botella de vino de la casa", val: 194 },
  { name: "Tabla de quesos locales", val: 152 },
  { name: "Hamburguesa de la casa", val: 131 },
  { name: "Postre del día", val: 98 },
];
const CANALES = [
  { name: "Room service", sub: "Comida y bebida a la habitación", pct: 68, ico: "utensils", bg: "#EEEFF1", fg: "#17181C" },
  { name: "Restaurante", sub: "Reservas y pedidos", pct: 22, ico: "bag", bg: "#EEF1F4", fg: "#5B6270" },
  { name: "Experiencias y spa", sub: "Gestionadas por recepción", pct: 10, ico: "sparkles", bg: "#EFF0F2", fg: "#7A828D" },
];
const FLUJO = [120, 138, 128, 165, 150, 188, 172, 210, 195, 240, 262, 250, 288, 312];
const HORAS = [4, 6, 10, 22, 46, 60, 40, 28, 35, 58, 72, 30];

export default function AnaliticaDashboard() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["key"]>("mes");
  const f = PERIODS.find((p) => p.key === period)!.f;
  const v = (base: number) => Math.round(base * f);

  const pedidosN = v(BASE.pedidos);
  const consultasN = v(BASE.consultas);
  const horasPedidos = (pedidosN * MIN_PEDIDO) / 60;
  const horasConsultas = (consultasN * MIN_CONSULTA) / 60;
  const horas = Math.round(horasPedidos + horasConsultas);
  const jornadas = (horas / 8).toFixed(horas / 8 >= 10 ? 0 : 1);

  const flujo = useMemo(() => areaPath(FLUJO, 520, 160), []);
  const hotMax = Math.max(...HORAS);

  return (
    <div className={s.panel}>
      {/* ================= MENÚ IZQUIERDO ================= */}
      <aside className={s.side}>
        <div className={s.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vertice-logo-clean.png" alt="Vértice" className={s.logo} />
          <div className={s.brandSub}>Panel del hotel</div>
        </div>
        <nav className={s.nav}>
          <div className={s.navLabel}>Operación</div>
          {NAV.map((it) => (
            <div key={it.label} className={`${s.navItem} ${it.active ? s.navActive : ""}`}>
              <span style={{ flex: 1 }}>{it.label}</span>
            </div>
          ))}
          <div className={s.navSep} />
          <div className={`${s.navItem}`}><span style={{ flex: 1 }}>Ajustes</span></div>
        </nav>
      </aside>

      {/* ================= CONTENIDO ================= */}
      <main className={s.main}>
        <div className={s.head}>
          <div>
            <h1 className={s.h1}>Analítica</h1>
            <div className={s.sub}>El valor que tu hotel genera con Vértice, de un vistazo.</div>
          </div>
        </div>

        <div className={s.controls}>
          <div className={s.tabs}>
            {PERIODS.map((p) => (
              <button key={p.key} className={`${s.tab} ${p.key === period ? s.tabActive : ""}`} onClick={() => setPeriod(p.key)}>
                {p.label}
              </button>
            ))}
          </div>
          <div className={s.exports}>
            <button className={s.exp}>JSON</button>
            <button className={s.exp}>Imagen</button>
            <button className={s.exp} onClick={() => window.print()}>PDF</button>
          </div>
        </div>

        {/* HERO tiempo ahorrado */}
        <div className={`${s.card} ${s.hero}`}>
          <div className={s.cardHead}>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
              
              <span className={s.cardTitle}>Tiempo de personal ahorrado</span>
            </div>
            <span className={`${s.delta} ${s.up}`}>▲ +23% vs. periodo anterior</span>
          </div>
          <div className={s.kpi}>{nf(horas)} <small>h</small>&nbsp;&nbsp;<small style={{ fontWeight: 600 }}>≈ {jornadas} jornadas</small></div>
          <div className={s.heroNote}>
            Se calcula con la actividad real de tu hotel en el sistema × el tiempo medio que cada gestión le llevaría a tu equipo.
            Los minutos por gestión se ajustan contigo al arrancar.
          </div>
          <div className={s.split}>
            <div className={s.splitBar}>
              <i style={{ width: `${Math.round((horasPedidos / horas) * 100)}%`, background: "#17181C" }} />
              <i style={{ width: `${Math.round((horasConsultas / horas) * 100)}%`, background: "#C9CDD3" }} />
            </div>
            <div className={s.splitLegend}>
              <span>Pedidos · {nf(pedidosN)} × ~4,5 min&nbsp;<b>{Math.round(horasPedidos)} h</b></span>
              <span>Consultas resueltas · {nf(consultasN)} × ~2 min&nbsp;<b>{Math.round(horasConsultas)} h</b></span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className={`${s.grid} ${s.g4}`} style={{ marginTop: "1rem" }}>
          <Kpi title="Pedidos de room service" val={nf(pedidosN)} sub="Gestionados por el sistema" delta="+31%" up />
          <Kpi title="Ingresos F&B extra" val={eur(v(BASE.ingresos))} sub="Consumo durante la estancia" delta="+27%" up />
          <Kpi title="Huéspedes atendidos" val={nf(v(BASE.huespedes))} sub="188 alojados ahora mismo" delta="+19%" up />
          <Kpi title="Ticket medio por huésped" val="14,20 €" sub="Consumo medio por huésped" delta="+8%" up />
        </div>

        {/* donuts / reseñas */}
        <div className={`${s.grid} ${s.g3}`} style={{ marginTop: "1rem" }}>
          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>% de huéspedes que consumen</span></div>
            <div className={s.donutWrap}>
              <div className={s.donut} style={{ background: conic([{ pct: 62, color: "#17181C" }, { pct: 38, color: "#EEF0F3" }]) }}>
                <div className={s.donutCenter}><div><b>62%</b><span>consumen</span></div></div>
              </div>
              <div className={s.legend}>
                <div className={s.legRow}><span className={s.sw} style={{ background: "#17181C" }} /><span className={s.lname}>Consumen extras</span><span className={s.lval}>62%</span></div>
                <div className={s.legRow}><span className={s.sw} style={{ background: "#EEF0F3" }} /><span className={s.lname}>Solo alojamiento</span><span className={s.lval}>38%</span></div>
                <div className={s.kpiSub}>El sistema trabaja para subir este número.</div>
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>Reseñas ({nf(v(BASE.reseñas))})</span></div>
            <Bar name="Excelente" val="70%" pct={70} color="#2FA36B" />
            <Bar name="Buena" val="21%" pct={21} color="#A6ADB6" />
            <Bar name="Mala" val="9%" pct={9} color="#17181C" />
          </div>

          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>Idiomas de tus huéspedes</span></div>
            <div className={s.donutWrap}>
              <div className={s.donut} style={{ background: conic(IDIOMAS.map((i) => ({ pct: i.pct, color: i.color }))) }}>
                <div className={s.donutCenter}><div><b>{IDIOMAS.length}</b><span>idiomas</span></div></div>
              </div>
              <div className={s.legend}>
                {IDIOMAS.map((i) => (
                  <div key={i.name} className={s.legRow}><span className={s.sw} style={{ background: i.color }} /><span className={s.lname}>{i.name}</span><span className={s.lval}>{i.pct}%</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* gráficos */}
        <div className={`${s.grid} ${s.g2}`} style={{ marginTop: "1rem" }}>
          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>Flujo de pedidos en el tiempo</span><span className={`${s.delta} ${s.up}`}>▲ tendencia al alza</span></div>
            <svg className={s.chart} viewBox="0 0 520 170">
              <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#17181C" stopOpacity="0.18" /><stop offset="1" stopColor="#17181C" stopOpacity="0" /></linearGradient></defs>
              {[40, 85, 130].map((y) => <line key={y} x1="6" y1={y} x2="514" y2={y} stroke="#EEF0F3" strokeWidth="1" />)}
              <path d={flujo.area} fill="url(#ar)" />
              <path d={flujo.line} fill="none" stroke="#17181C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className={s.chartX}><span>Inicio</span><span>Mitad</span><span>Fin del periodo</span></div>
          </div>

          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>Horas punta de consumo</span></div>
            <div className={s.vbars}>
              {HORAS.map((h, i) => <div key={i} className={`${s.vbar} ${h === hotMax ? s.hot : ""}`} style={{ height: `${(h / hotMax) * 100}%` }} />)}
            </div>
            <div className={s.vlabels}>{["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22"].map((l) => <span key={l}>{l}h</span>)}</div>
          </div>
        </div>

        {/* top + canales */}
        <div className={`${s.grid} ${s.g2}`} style={{ marginTop: "1rem" }}>
          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>Lo más pedido</span></div>
            {TOP.map((t) => <Bar key={t.name} name={t.name} val={nf(v(t.val))} pct={(t.val / TOP[0].val) * 100} color="#17181C" />)}
          </div>
          <div className={s.card}>
            <div className={s.cardHead}><span className={s.cardTitle}>Pedidos por canal</span></div>
            <div className={s.rows}>
              {CANALES.map((c) => (
                <div key={c.name} className={s.row}>
                  
                  <div className={s.rowBody}>
                    <div className={s.rowTop}><span className={s.rowName}>{c.name}</span><b>{c.pct}%</b></div>
                    <div className={s.rowSub}>{c.sub} · {nf(v(Math.round(BASE.pedidos * c.pct / 100)))} pedidos</div>
                    <div className={s.btrack} style={{ marginTop: 6 }}><div className={s.bfill} style={{ width: `${c.pct}%`, background: c.fg }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* más señales de valor (para dirección) */}
        <div className={s.sectionTitle}>Más señales de valor</div>
        <div className={`${s.grid} ${s.g4}`}>
          <Kpi title="Conversión QR → pedido" val="41%" sub="Escaneos que acaban en pedido" delta="+6%" up />
          <Kpi title="Tiempo medio de entrega" val="18 min" sub="Del pedido a la habitación" delta="12% más rápido" up />
          <Kpi title="Huéspedes que repiten" val="34%" sub="Piden más de una vez por estancia" delta="+9%" up />
          <Kpi title="Experiencias vendidas" val={nf(v(BASE.experiencias))} sub="Spa, actividades y extras" delta="+22%" up />
          <Kpi title="Ingreso extra por estancia" val="22,40 €" sub="F&B y extras por huésped" delta="+14%" up />
          <Kpi title="Penetración de pedidos" val="58%" sub="Habitaciones que piden algo" delta="+11%" up />
          <Kpi title="Valoración media" val="4,6 ★" sub="Sobre 5, de las reseñas" delta="+0,3" up />
          <Kpi title="Sugerencias aceptadas" val="29%" sub="Upsell que el huésped acepta" delta="+7%" up />
          <Kpi title="Demanda nocturna captada" val={nf(v(214))} sub="Pedidos fuera de horario de cocina" delta="+18%" up />
          <Kpi title="Idiomas atendidos solos" val="9" sub="Respondidos en el idioma del huésped" delta="+2" up />
          <Kpi title="Consultas sin recepción" val={nf(consultasN)} sub="Resueltas por el sistema" delta="+25%" up />
          <Kpi title="Llamadas a recepción evitadas" val={nf(v(1980))} sub="Menos interrupciones al equipo" delta="+21%" up />
        </div>

        <div className={s.footNote}>Las cifras reflejan la actividad de tu hotel en el sistema.</div>
      </main>
    </div>
  );
}

function Kpi({ title, val, sub, delta, up }: { title: string; val: string; sub: string; delta: string; up?: boolean }) {
  return (
    <div className={s.card}>
      <div className={s.cardHead}><span className={s.cardTitle}>{title}</span></div>
      <div className={s.kpi}>{val}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: ".5rem", marginTop: ".6rem" }}>
        <span className={s.kpiSub} style={{ margin: 0 }}>{sub}</span>
        <span className={`${s.delta} ${up ? s.up : s.down}`}>{up ? "▲" : "▼"} {delta}</span>
      </div>
    </div>
  );
}
function Bar({ name, val, pct, color }: { name: string; val: string; pct: number; color: string }) {
  return (
    <div className={s.barRow}>
      <div className={s.barTop}><span className={s.bname}>{name}</span><span className={s.bval}>{val}</span></div>
      <div className={s.btrack}><div className={s.bfill} style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

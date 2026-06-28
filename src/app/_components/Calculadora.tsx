"use client";

import { useState } from "react";
import { CALENDLY_URL } from "@/lib/site";
import styles from "../landing.module.css";

// Calculadora interactiva de "ingreso F&B perdido" para directores de hotel.
// Cálculo 100% en el front, en tiempo real, sin guardar datos.

// ── Supuestos del cálculo (conservadores; tendencias del sector AHLA/CBRE 2025-26) ──
const PCT_HOY_DEFAULT = 10; // % de habitaciones ocupadas que piden hoy (fricción actual)
const PCT_CON_SISTEMA = 15; // % que piden con el sistema (pedir es más fácil)
const UPSELL = 1.2; // +20% de ticket por upselling dirigido
const DIAS_MES = 30;

const eur = (n: number) => Math.round(n).toLocaleString("es-ES");

// Pista de relleno del slider (parte recorrida en dorado)
function fill(v: number, min: number, max: number) {
  const p = ((v - min) / (max - min)) * 100;
  return `linear-gradient(to right, var(--accent) ${p}%, var(--line-2) ${p}%)`;
}

export default function Calculadora() {
  const [rooms, setRooms] = useState(60);
  const [occ, setOcc] = useState(70);
  const [ticket, setTicket] = useState(20);
  const [pctHoy, setPctHoy] = useState(PCT_HOY_DEFAULT);

  // ── Cálculo en tiempo real ──
  const occupied = rooms * (occ / 100); // habitaciones ocupadas
  const ordersHoy = occupied * (pctHoy / 100); // pedidos/noche hoy
  const ordersCon = occupied * (PCT_CON_SISTEMA / 100); // pedidos/noche con sistema
  const revHoy = ordersHoy * ticket * DIAS_MES;
  const revCon = ordersCon * ticket * UPSELL * DIAS_MES;
  const extraMes = Math.max(0, revCon - revHoy);
  // Redondeo "~" para transmitir que es una estimación
  const mes = Math.round(extraMes / 10) * 10;
  const anio = Math.round((extraMes * 12) / 100) * 100;

  return (
    <div className={styles.calc}>
      {/* ── Entradas ── */}
      <div className={styles.calcInputs}>
        <div className={styles.calcField}>
          <label htmlFor="calc-rooms" className={styles.calcLabel}>
            Habitaciones <span className={styles.calcVal}>{rooms}</span>
          </label>
          <input
            id="calc-rooms"
            type="range"
            min={10}
            max={500}
            step={5}
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value))}
            className={styles.calcRange}
            style={{ background: fill(rooms, 10, 500) }}
          />
        </div>

        <div className={styles.calcField}>
          <label htmlFor="calc-occ" className={styles.calcLabel}>
            Ocupación media <span className={styles.calcVal}>{occ}%</span>
          </label>
          <input
            id="calc-occ"
            type="range"
            min={20}
            max={100}
            step={1}
            value={occ}
            onChange={(e) => setOcc(Number(e.target.value))}
            className={styles.calcRange}
            style={{ background: fill(occ, 20, 100) }}
          />
        </div>

        <div className={styles.calcField}>
          <label htmlFor="calc-ticket" className={styles.calcLabel}>
            Ticket medio actual por pedido{" "}
            <span className={styles.calcVal}>{ticket} €</span>
          </label>
          <span className={styles.calcHint}>
            Lo que gasta de media un huésped en un pedido de room service, hoy.
          </span>
          <input
            id="calc-ticket"
            type="range"
            min={5}
            max={80}
            step={1}
            value={ticket}
            onChange={(e) => setTicket(Number(e.target.value))}
            className={styles.calcRange}
            style={{ background: fill(ticket, 5, 80) }}
          />
        </div>

        {/* Ajuste avanzado, plegado por defecto */}
        <details className={styles.calcAdvanced}>
          <summary>Ajuste avanzado</summary>
          <div className={styles.calcField} style={{ marginTop: "0.9rem" }}>
            <label htmlFor="calc-hoy" className={styles.calcLabel}>
              % de huéspedes que pide hoy{" "}
              <span className={styles.calcVal}>{pctHoy}%</span>
            </label>
            <input
              id="calc-hoy"
              type="range"
              min={2}
              max={14}
              step={1}
              value={pctHoy}
              onChange={(e) => setPctHoy(Number(e.target.value))}
              className={styles.calcRange}
              style={{ background: fill(pctHoy, 2, 14) }}
            />
          </div>
        </details>
      </div>

      {/* ── Resultado ── */}
      <div className={styles.calcResult}>
        <div className={styles.calcResultLabel}>
          Tu hotel podría estar dejando escapar
        </div>
        <div className={styles.calcBig} aria-live="polite">
          ~{eur(mes)} €<span className={styles.calcBigUnit}>/mes</span>
        </div>
        <div className={styles.calcYear}>≈ {eur(anio)} € al año en F&amp;B</div>

        <p className={styles.calcDisclaimer}>
          Estimación basada en datos del sector (AHLA, CBRE 2025-26). Cada hotel
          es un mundo; el cálculo real lo afinamos contigo en la reunión.
        </p>

        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.calcCta}
        >
          Calcula tu caso real con el equipo <span>→</span>
        </a>
      </div>
    </div>
  );
}

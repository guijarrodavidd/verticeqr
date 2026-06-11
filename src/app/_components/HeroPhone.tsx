"use client";

import { useRef } from "react";
import styles from "../landing.module.css";

// Móvil del hero con la carta REAL incrustada + parallax 3D al mover el ratón.
export default function HeroPhone() {
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const qr = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    if (frame.current) {
      frame.current.style.transform = `rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(
        -7 + px * 14
      ).toFixed(2)}deg)`;
    }
    if (qr.current) {
      qr.current.style.transform = `translate3d(${(px * 26).toFixed(1)}px, ${(
        py * 18
      ).toFixed(1)}px, 0) rotate(7deg)`;
    }
  }

  function onLeave() {
    if (frame.current) frame.current.style.transform = "";
    if (qr.current) qr.current.style.transform = "";
  }

  return (
    <div
      ref={wrap}
      className={styles.heroMockup}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div ref={frame} className={styles.phoneFrame}>
        <div className={styles.phoneScreen}>
          <iframe
            src="/demos/romanssera/index.html"
            title="Carta digital de Romanssera Tapassería"
            className={styles.phoneIframe}
            loading="lazy"
          />
        </div>
      </div>
      <div ref={qr} className={styles.qrFloat}>
        <div className={styles.qrFloatInner}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#fff" />
            <g fill="#221b13">
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
  );
}

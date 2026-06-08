"use client";

import { useEffect, useRef, useState } from "react";

// Anima un número de 0 al "valor" cuando el elemento entra en el viewport.
// Acepta sufijo (€, %, +) y formato es-ES (puntos como separadores).
export default function Counter({
  value,
  suffix = "",
  duration = 1400,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setN(value);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / duration);
              // Easing easeOutQuart
              const eased = 1 - Math.pow(1 - p, 4);
              setN(Math.round(value * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {n.toLocaleString("es-ES")}
      {suffix}
    </span>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Fraunces } from "next/font/google";

// Manrope para cuerpo (limpio, cálido) y Fraunces para display/headlines
// (serif editorial con carácter, lejos de las fuentes genéricas).
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VerticeQR — Carta digital y pedidos por QR para hostelería",
  description:
    "Tu cliente escanea el QR de su mesa, ve tu carta, pide y paga. Tu equipo cocina más, cobra más, pierde menos tiempo.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${fraunces.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
          margin: 0,
          padding: 0,
          background: "#f6efe3",
          color: "#241d15",
          minHeight: "100vh",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
      </body>
    </html>
  );
}

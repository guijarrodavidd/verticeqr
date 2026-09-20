import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Archivo } from "next/font/google";
import CookieBanner from "./_components/CookieBanner";

// Manrope para todo: es la cara de Vértice y la misma del panel de dirección
// y de las propuestas. Se usa con contraste DURO de peso (800 en display,
// 400/500 en texto) — nada de pesos finos con tracking amplio, que leen a
// hotel boutique y no a empresa de tecnología.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Archivo SOLO para cifras. El display y el texto son de marca; la cara de
// los datos es de información, tabular y estrecha. Es lo que hace que una
// columna de números se lea como un instrumento y no como un folleto.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-num",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vértice — Más ingreso por huésped para tu hotel, sin sumar personal",
  description:
    "Sistema de room service y F&B digital a medida para hoteles. Tu huésped pide desde la habitación, lo cargas a su cuenta y subes el GOP sin contratar a nadie. Te enseñamos cuánto ganarías antes de empezar.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${archivo.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
          margin: 0,
          padding: 0,
          background: "#f1f1ef",
          color: "#111111",
          minHeight: "100vh",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

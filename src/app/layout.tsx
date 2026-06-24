import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import CookieBanner from "./_components/CookieBanner";

// Montserrat para todo, en pesos ligeros (200/300/400) y con tracking amplio:
// transmite el lujo discreto de un hotel boutique. Un solo carácter tipográfico,
// usado con disciplina, se percibe más exclusivo que mezclar familias.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});
const montserratDisplay = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VerticeQR — Más ingreso de F&B para tu hotel, sin sumar personal",
  description:
    "Sistema de room service y F&B digital a medida para hoteles boutique. Tu huésped pide desde la habitación, lo cargas a su cuenta y subes el GOP sin contratar a nadie. Te enseñamos cuánto ganarías antes de empezar.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${montserratDisplay.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
          margin: 0,
          padding: 0,
          background: "#eae5da",
          color: "#1c1a16",
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

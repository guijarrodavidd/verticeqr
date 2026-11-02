import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import CookieBanner from "./_components/CookieBanner";

// Geist para todo lo de marca (desde noviembre de 2026, en lugar de Manrope):
// titulares en peso medio con las letras muy juntas y texto en 430. Es la
// línea de las startups de producto, la del vídeo de Virio que tomamos de
// referencia.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Geist Mono para datos y rótulos pequeños (hab. 214, 22:40, pedido nº 139),
// en minúscula normal. Las cifras grandes van en Geist con números tabulares.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vértice — Más ingreso por huésped para tu hotel, sin sumar personal",
  description:
    "Sistema de room service y F&B digital a medida para hoteles. Tu huésped pide desde la habitación, lo cargas a su cuenta y subes el GOP sin contratar a nadie. Te enseñamos cuánto ganarías antes de empezar.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} ${geistMono.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
          margin: 0,
          padding: 0,
          background: "#f6f7f4",
          color: "#20231f",
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

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Manrope } from "next/font/google";

// Inter para texto general (cuerpo) y Manrope para display/headlines.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
    <html lang="es" className={`${inter.variable} ${manrope.variable}`}>
      <body
        style={{
          fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
          margin: 0,
          padding: 0,
          background: "#0a0a0f",
          color: "#f2f2f5",
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

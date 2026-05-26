import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "VerticeQR",
  description: "Web de prueba de VerticeQR",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: "2rem",
          background: "#0b0b0f",
          color: "#f5f5f5",
        }}
      >
        {children}
      </body>
    </html>
  );
}

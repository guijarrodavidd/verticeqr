import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "VerticeQR — Códigos QR profesionales",
  description: "Genera, gestiona y mide tus códigos QR desde un solo sitio.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          margin: 0,
          padding: 0,
          background: "#0a0a0f",
          color: "#f2f2f5",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession, clearSession } from "@/lib/auth";
import Sidebar from "./_components/Sidebar";
import "./app.css";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login?redirect=/app");

  async function logout() {
    "use server";
    await clearSession();
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        userNombre={user.nombre}
        userEmail={user.email}
        logoutAction={logout}
      />
      <main className="vqr-app-main" style={{ flex: 1, padding: "2rem", minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}

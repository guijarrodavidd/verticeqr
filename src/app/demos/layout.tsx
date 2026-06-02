import type { ReactNode } from "react";
import Sidebar from "./_components/Sidebar";
import "./demos.css";

export default function DemosLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        className="vqr-demos-main"
        style={{
          flex: 1,
          padding: "2rem",
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}

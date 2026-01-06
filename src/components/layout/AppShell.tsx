// src/components/layout/AppShell.tsx
"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

type Props = {
  children: React.ReactNode;
};

export default function AppShell({ children }: Props) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />

        <main
          style={{
            flex: 1,
            padding: "24px 32px",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

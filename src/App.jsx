import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { ReservationsPage } from "./pages/ReservationsPage";
import { OutOfScopePage } from "./pages/OutOfScopePage";
import { NAV_ITEMS, SETTINGS_ITEM } from "./data/navigation";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-paper font-body text-ink">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/reservations" replace />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            {NAV_ITEMS.filter((item) => item.key !== "reservations").map((item) => (
              <Route key={item.key} path={item.path} element={<OutOfScopePage label={item.label} />} />
            ))}
            <Route path={SETTINGS_ITEM.path} element={<OutOfScopePage label={SETTINGS_ITEM.label} />} />
            <Route path="*" element={<Navigate to="/reservations" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

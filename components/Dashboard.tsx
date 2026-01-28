"use client";

import { useState, useCallback } from "react";
import TasksTab from "@/components/tabs/TasksTab";
import ProjectsTab from "@/components/tabs/ProjectsTab";
import CommentsTab from "@/components/tabs/CommentsTab";
import HistoryTab from "@/components/tabs/HistoryTab";
import NotificationsTab from "@/components/tabs/NotificationsTab";
import SearchTab from "@/components/tabs/SearchTab";
import ReportsTab from "@/components/tabs/ReportsTab";

type User = { id: number; username: string };

const TABS = [
  { id: "tasks", label: "Tareas" },
  { id: "projects", label: "Proyectos" },
  { id: "comments", label: "Comentarios" },
  { id: "history", label: "Historial" },
  { id: "notifications", label: "Notificaciones" },
  { id: "search", label: "Búsqueda" },
  { id: "reports", label: "Reportes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>("tasks");

  const logout = useCallback(async () => {
    await onLogout();
  }, [onLogout]);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <header className="liminal-panel rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4 mb-4 md:mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg md:text-xl font-bold text-liminal-deep">Task Manager Legacy</h1>
        <div className="flex items-center gap-3">
          <span className="text-liminal-void text-sm">
            Usuario: <strong className="text-liminal-shadow">{user.username}</strong>
          </span>
          <button
            type="button"
            onClick={logout}
            className="liminal-btn px-3 py-1.5 rounded-lg bg-liminal-mist hover:bg-liminal-stone text-liminal-deep text-sm"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="tabs-scroll flex gap-1 mb-4 pb-1 -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`liminal-btn flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTab === t.id
                ? "bg-liminal-void text-white"
                : "bg-liminal-mist/80 hover:bg-liminal-stone/80 text-liminal-deep"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="liminal-panel rounded-xl md:rounded-2xl p-4 md:p-6 min-h-[320px]">
        {activeTab === "tasks" && <TasksTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "comments" && <CommentsTab />}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "search" && <SearchTab />}
        {activeTab === "reports" && <ReportsTab />}
      </div>
    </div>
  );
}

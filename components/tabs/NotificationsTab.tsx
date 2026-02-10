"use client";

import { useState } from "react";

type Notification = {
  id: number;
  message: string;
  type: string;
  createdAt: string;
};

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [output, setOutput] = useState("");

  const load = async () => {
    try {
      const r = await fetch("/api/notifications");
      const d = await r.json();
      if (!r.ok) {
        setOutput(d.error ?? "Error");
        return;
      }
      const arr = Array.isArray(d) ? d : [];
      setNotifications(arr);
      const lines = ["=== NOTIFICACIONES ===", ""];
      if (!arr.length) lines.push("No hay notificaciones nuevas");
      else {
        arr.forEach((n: Notification) => {
          lines.push(`• [${n.type}] ${n.message} (${n.createdAt})`);
        });
      }
      setOutput(lines.join("\n"));
    } catch {
      setOutput("Error de conexión");
    }
  };

  const markRead = async () => {
    try {
      const r = await fetch("/api/notifications/read", { method: "PATCH" });
      if (!r.ok) return;
      load();
      alert("Notificaciones marcadas como leídas");
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-base md:text-lg font-bold text-white border-b border-liminal-border pb-2">
        Notificaciones
      </h2>

      <section className="liminal-panel rounded-xl p-4 md:p-5">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={load} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-void text-white text-sm">
            Cargar Notificaciones
          </button>
          <button type="button" onClick={markRead} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-mist text-liminal-deep text-sm">
            Marcar como Leídas
          </button>
        </div>
      </section>

      <section>
        <textarea
          readOnly
          value={output}
          rows={14}
          className="w-full liminal-input rounded-xl px-3 py-3 text-sm bg-white/50 resize-none font-mono"
        />
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";

type ReportTasks = Record<string, number>;
type ReportProjects = { name: string; count: number }[];
type ReportUsers = { username: string; count: number }[];

export default function ReportsTab() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async (type: "tasks" | "projects" | "users") => {
    setLoading(true);
    try {
      const r = await fetch(`/api/reports?type=${type}`);
      const d = await r.json();
      if (!r.ok) {
        setOutput(d.error ?? "Error");
        return;
      }
      let text = `=== REPORTE: ${type.toUpperCase()} ===\n\n`;
      if (type === "tasks" && typeof d.data === "object") {
        const data = d.data as ReportTasks;
        Object.entries(data).forEach(([k, v]) => {
          text += `${k}: ${v} tareas\n`;
        });
      } else if (type === "projects" && Array.isArray(d.data)) {
        (d.data as ReportProjects).forEach((x) => {
          text += `${x.name}: ${x.count} tareas\n`;
        });
      } else if (type === "users" && Array.isArray(d.data)) {
        (d.data as ReportUsers).forEach((x) => {
          text += `${x.username}: ${x.count} tareas asignadas\n`;
        });
      }
      setOutput(text);
    } catch {
      setOutput("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    window.open("/api/export/csv", "_blank");
    setOutput((prev) => prev ? `${prev}\n\nExportado a export_tasks.csv` : "Exportado a export_tasks.csv");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-base md:text-lg font-bold text-white border-b border-liminal-border pb-2">
        Generación de Reportes
      </h2>

      <section className="liminal-panel rounded-xl p-4 md:p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => generate("tasks")}
            disabled={loading}
            className="liminal-btn px-4 py-2 rounded-lg bg-liminal-void text-white text-sm disabled:opacity-50"
          >
            Reporte de Tareas
          </button>
          <button
            type="button"
            onClick={() => generate("projects")}
            disabled={loading}
            className="liminal-btn px-4 py-2 rounded-lg bg-liminal-void text-white text-sm disabled:opacity-50"
          >
            Reporte de Proyectos
          </button>
          <button
            type="button"
            onClick={() => generate("users")}
            disabled={loading}
            className="liminal-btn px-4 py-2 rounded-lg bg-liminal-void text-white text-sm disabled:opacity-50"
          >
            Reporte de Usuarios
          </button>
          <button type="button" onClick={exportCSV} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-mist text-liminal-deep text-sm">
            Exportar a CSV
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

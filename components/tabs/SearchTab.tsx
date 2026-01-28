"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  status: string;
  priority: string;
  project: { name: string } | null;
};

type Project = { id: number; name: string };

export default function SearchTab() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [projectId, setProjectId] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [results, setResults] = useState<Task[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]));
  }, []);

  const search = async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (projectId > 0) params.set("projectId", String(projectId));
    try {
      const r = await fetch(`/api/search?${params}`);
      const d = await r.json();
      setResults(Array.isArray(d) ? d : []);
    } catch {
      setResults([]);
    }
  };

  const statusOpts = ["", "Pendiente", "En Progreso", "Completada"];
  const priorityOpts = ["", "Baja", "Media", "Alta", "Crítica"];

  return (
    <div className="space-y-6">
      <h2 className="text-base md:text-lg font-bold text-liminal-deep border-b border-liminal-border pb-2">
        Búsqueda Avanzada
      </h2>

      <section className="liminal-panel rounded-xl p-4 md:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-liminal-void mb-1">Texto</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-liminal-void mb-1">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              {statusOpts.filter(Boolean).map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-liminal-void mb-1">Prioridad</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Todas</option>
              {priorityOpts.filter(Boolean).map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-xs text-liminal-void mb-1">Proyecto</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(parseInt(e.target.value, 10))}
              className="w-full max-w-xs liminal-input rounded-lg px-3 py-2 text-sm"
            >
              <option value={0}>Todos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="button" onClick={search} className="liminal-btn mt-4 px-4 py-2 rounded-lg bg-liminal-void text-white text-sm">
          Buscar
        </button>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-liminal-shadow mb-2">Resultados</h3>
        <div className="overflow-x-auto rounded-xl border border-liminal-border">
          <table className="table-responsive w-full text-sm">
            <thead>
              <tr className="bg-liminal-mist/80">
                <th className="text-left p-2 md:p-3">ID</th>
                <th className="text-left p-2 md:p-3">Título</th>
                <th className="text-left p-2 md:p-3">Estado</th>
                <th className="text-left p-2 md:p-3">Prioridad</th>
                <th className="text-left p-2 md:p-3 hidden md:table-cell">Proyecto</th>
              </tr>
            </thead>
            <tbody>
              {results.map((t) => (
                <tr key={t.id} className="border-t border-liminal-border">
                  <td className="p-2 md:p-3" data-label="ID">{t.id}</td>
                  <td className="p-2 md:p-3 font-medium" data-label="Título">{t.title}</td>
                  <td className="p-2 md:p-3" data-label="Estado">{t.status ?? "Pendiente"}</td>
                  <td className="p-2 md:p-3" data-label="Prioridad">{t.priority ?? "Media"}</td>
                  <td className="p-2 md:p-3 hidden md:table-cell" data-label="Proyecto">
                    {t.project?.name ?? "Sin proyecto"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

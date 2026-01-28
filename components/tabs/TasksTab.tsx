"use client";

import { useCallback, useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string | null;
  estimatedHours: number;
  projectId: number | null;
  project: { id: number; name: string } | null;
  assignedToId: number | null;
  assignedTo: { id: number; username: string } | null;
};

type Project = { id: number; name: string; description: string };
type User = { id: number; username: string };

export default function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pendiente",
    priority: "Media",
    projectId: 0,
    assignedTo: 0,
    dueDate: "",
    estimatedHours: "",
  });
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, high: 0, overdue: 0 });

  const load = useCallback(async () => {
    try {
      const [t, p, u] = await Promise.all([
        fetch("/api/tasks").then((r) => r.json()),
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/users").then((r) => r.json()),
      ]);
      if (Array.isArray(t)) setTasks(t);
      if (Array.isArray(p)) setProjects(p);
      if (Array.isArray(u)) setUsers(u);
    } catch {
      setTasks([]);
      setProjects([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let total = tasks.length;
    let completed = 0;
    let pending = 0;
    let high = 0;
    let overdue = 0;
    const now = new Date();
    tasks.forEach((tk) => {
      if (tk.status === "Completada") completed++;
      else pending++;
      if (tk.priority === "Alta" || tk.priority === "Crítica") high++;
      if (tk.dueDate && tk.status !== "Completada") {
        const d = new Date(tk.dueDate);
        if (d < now) overdue++;
      }
    });
    setStats({ total, completed, pending, high, overdue });
  }, [tasks]);

  const clearForm = () => {
    setForm({
      title: "",
      description: "",
      status: "Pendiente",
      priority: "Media",
      projectId: 0,
      assignedTo: 0,
      dueDate: "",
      estimatedHours: "",
    });
    setSelectedId(null);
  };

  const selectTask = (t: Task) => {
    setSelectedId(t.id);
    setForm({
      title: t.title,
      description: t.description ?? "",
      status: t.status ?? "Pendiente",
      priority: t.priority ?? "Media",
      projectId: t.projectId ?? 0,
      assignedTo: t.assignedToId ?? 0,
      dueDate: t.dueDate ?? "",
      estimatedHours: t.estimatedHours ? String(t.estimatedHours) : "",
    });
  };

  const add = async () => {
    if (!form.title.trim()) {
      alert("El título es requerido");
      return;
    }
    const r = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title.trim(),
        description: form.description,
        status: form.status,
        priority: form.priority,
        projectId: form.projectId || undefined,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
        estimatedHours: form.estimatedHours ? parseFloat(form.estimatedHours) : undefined,
      }),
    });
    if (!r.ok) {
      const d = await r.json();
      alert(d.error ?? "Error");
      return;
    }
    load();
    clearForm();
    alert("Tarea agregada");
  };

  const update = async () => {
    if (!selectedId) {
      alert("Selecciona una tarea");
      return;
    }
    if (!form.title.trim()) {
      alert("El título es requerido");
      return;
    }
    const r = await fetch(`/api/tasks/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title.trim(),
        description: form.description,
        status: form.status,
        priority: form.priority,
        projectId: form.projectId || undefined,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
        estimatedHours: form.estimatedHours ? parseFloat(form.estimatedHours) : undefined,
      }),
    });
    if (!r.ok) {
      const d = await r.json();
      alert(d.error ?? "Error");
      return;
    }
    load();
    clearForm();
    alert("Tarea actualizada");
  };

  const remove = async () => {
    if (!selectedId) {
      alert("Selecciona una tarea");
      return;
    }
    const t = tasks.find((x) => x.id === selectedId);
    if (!t || !confirm(`¿Eliminar tarea: ${t.title}?`)) return;
    const r = await fetch(`/api/tasks/${selectedId}`, { method: "DELETE" });
    if (!r.ok) {
      alert("Error al eliminar");
      return;
    }
    load();
    clearForm();
    alert("Tarea eliminada");
  };

  const statusOpts = ["Pendiente", "En Progreso", "Completada", "Bloqueada", "Cancelada"];
  const priorityOpts = ["Baja", "Media", "Alta", "Crítica"];

  if (loading) {
    return <div className="text-liminal-void text-sm">Cargando tareas…</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-base md:text-lg font-bold text-liminal-deep border-b border-liminal-border pb-2">
        Gestión de Tareas
      </h2>

      <section className="liminal-panel rounded-xl p-4 md:p-5">
        <h3 className="text-sm font-semibold text-liminal-shadow mb-4">Nueva / Editar Tarea</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-liminal-void mb-1">Título</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-liminal-void mb-1">Estado</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            >
              {statusOpts.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-liminal-void mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-xs text-liminal-void mb-1">Prioridad</label>
            <select
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            >
              {priorityOpts.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-liminal-void mb-1">Proyecto</label>
            <select
              value={form.projectId}
              onChange={(e) => setForm((f) => ({ ...f, projectId: parseInt(e.target.value, 10) }))}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            >
              <option value={0}>—</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-liminal-void mb-1">Asignado a</label>
            <select
              value={form.assignedTo}
              onChange={(e) => setForm((f) => ({ ...f, assignedTo: parseInt(e.target.value, 10) }))}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            >
              <option value={0}>Sin asignar</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-liminal-void mb-1">Fecha vencimiento (YYYY-MM-DD)</label>
            <input
              type="text"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              placeholder="YYYY-MM-DD"
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-liminal-void mb-1">Horas estimadas</label>
            <input
              type="number"
              step={0.5}
              value={form.estimatedHours}
              onChange={(e) => setForm((f) => ({ ...f, estimatedHours: e.target.value }))}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button type="button" onClick={add} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-void text-white text-sm">
            Agregar
          </button>
          <button type="button" onClick={update} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-stone text-white text-sm">
            Actualizar
          </button>
          <button type="button" onClick={remove} className="liminal-btn px-4 py-2 rounded-lg bg-red-600/90 text-white text-sm">
            Eliminar
          </button>
          <button type="button" onClick={clearForm} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-mist text-liminal-deep text-sm">
            Limpiar
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-liminal-shadow mb-2">Lista de Tareas</h3>
        <div className="overflow-x-auto rounded-xl border border-liminal-border">
          <table className="table-responsive w-full text-sm">
            <thead>
              <tr className="bg-liminal-mist/80">
                <th className="text-left p-2 md:p-3">ID</th>
                <th className="text-left p-2 md:p-3">Título</th>
                <th className="text-left p-2 md:p-3 hidden sm:table-cell">Estado</th>
                <th className="text-left p-2 md:p-3 hidden md:table-cell">Prioridad</th>
                <th className="text-left p-2 md:p-3 hidden lg:table-cell">Proyecto</th>
                <th className="text-left p-2 md:p-3 hidden lg:table-cell">Asignado</th>
                <th className="text-left p-2 md:p-3 hidden lg:table-cell">Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => selectTask(t)}
                  className={`border-t border-liminal-border cursor-pointer hover:bg-liminal-mist/50 ${
                    selectedId === t.id ? "bg-liminal-mist/70" : ""
                  }`}
                >
                  <td className="p-2 md:p-3" data-label="ID">{t.id}</td>
                  <td className="p-2 md:p-3 font-medium" data-label="Título">{t.title}</td>
                  <td className="p-2 md:p-3 hidden sm:table-cell" data-label="Estado">{t.status ?? "Pendiente"}</td>
                  <td className="p-2 md:p-3 hidden md:table-cell" data-label="Prioridad">{t.priority ?? "Media"}</td>
                  <td className="p-2 md:p-3 hidden lg:table-cell" data-label="Proyecto">
                    {t.project?.name ?? "Sin proyecto"}
                  </td>
                  <td className="p-2 md:p-3 hidden lg:table-cell" data-label="Asignado">
                    {t.assignedTo?.username ?? "Sin asignar"}
                  </td>
                  <td className="p-2 md:p-3 hidden lg:table-cell" data-label="Vencimiento">
                    {t.dueDate ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="text-sm text-liminal-void">
        <strong className="text-liminal-shadow">Estadísticas:</strong>{" "}
        Total: {stats.total} | Completadas: {stats.completed} | Pendientes: {stats.pending} | Alta
        prioridad: {stats.high} | Vencidas: {stats.overdue}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import DeleteModal from "@/components/tabs/DeleteModal";
import TaskLoader from "@/components/TaskLoader";

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

type Project = { id: number; name: string };
type User = { id: number; username: string };

export default function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const today = new Date().toISOString().split("T")[0];

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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const clearForm = () => {
    setSelectedId(null);
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
  };

  const selectTask = (t: Task) => {
    setSelectedId(t.id);
    setForm({
      title: t.title,
      description: t.description ?? "",
      status: t.status,
      priority: t.priority,
      projectId: t.projectId ?? 0,
      assignedTo: t.assignedToId ?? 0,
      dueDate: t.dueDate ?? "",
      estimatedHours: t.estimatedHours
        ? String(t.estimatedHours)
        : "",
    });
  };

  // -------- ADD TASK --------
  const add = async () => {
    if (!form.title.trim()) {
      alert("El título es requerido");
      return;
    }

    const hours = parseFloat(form.estimatedHours);
    if (!isNaN(hours) && hours < 0) {
      alert("Las horas no pueden ser negativas");
      return;
    }

    if (form.dueDate && form.dueDate < today) {
      alert("La fecha no puede ser anterior a hoy");
      return;
    }

    setSaving(true);

    try {
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
          estimatedHours: form.estimatedHours
            ? parseFloat(form.estimatedHours)
            : undefined,
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        alert(data.error || "Error al crear tarea");
        return;
      }

      await load();
      clearForm();
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    } finally {
      setSaving(false);
    }
  };

  // -------- UPDATE TASK --------
  const update = async () => {
    if (!selectedId) return;

    const hours = parseFloat(form.estimatedHours);
    if (!isNaN(hours) && hours < 0) {
      alert("Las horas no pueden ser negativas");
      return;
    }

    if (form.dueDate && form.dueDate < today) {
      alert("La fecha no puede ser anterior a hoy");
      return;
    }

    await fetch(`/api/tasks/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        projectId: form.projectId,
        assignedTo: form.assignedTo,
        dueDate: form.dueDate,
        estimatedHours: form.estimatedHours
          ? parseFloat(form.estimatedHours)
          : undefined,
      }),
    });

    await load();
    clearForm();
  };

  const openDelete = () => {
    if (!selectedId) return;
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    const r = await fetch(`/api/tasks/${selectedId}`, {
      method: "DELETE",
    });

    if (r.ok) {
      await load();
      clearForm();
    }

    setShowDelete(false);
  };

  if (loading) {
    return <TaskLoader />;
  }

  const selectedTask = tasks.find((t) => t.id === selectedId);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-white">
        Gestión de Tareas
      </h2>

      {/* FORM */}
      <div className="relative rounded-3xl p-5 bg-white/10 backdrop-blur-xl border border-white/20">

        {saving && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-black/40 backdrop-blur-sm">
            <TaskLoader />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <input
            placeholder="Título"
            value={form.title}
            onChange={(e) =>
              setForm((f) => ({ ...f, title: e.target.value }))
            }
            className="vapor-input col-span-2"
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value }))
            }
            className="vapor-input"
          >
            {["Pendiente", "En Progreso", "Completada"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <textarea
            placeholder="Descripción"
            rows={2}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                description: e.target.value,
              }))
            }
            className="vapor-input col-span-2 resize-none"
          />

          <select
            value={form.priority}
            onChange={(e) =>
              setForm((f) => ({ ...f, priority: e.target.value }))
            }
            className="vapor-input"
          >
            {["Baja", "Media", "Alta", "Crítica"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <select
            value={form.projectId}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                projectId: parseInt(e.target.value, 10),
              }))
            }
            className="vapor-input"
          >
            <option value={0}>Sin proyecto</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={form.assignedTo}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                assignedTo: parseInt(e.target.value, 10),
              }))
            }
            className="vapor-input"
          >
            <option value={0}>Sin asignar</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>

          <input
            type="date"
            min={today}
            value={form.dueDate}
            onChange={(e) =>
              setForm((f) => ({ ...f, dueDate: e.target.value }))
            }
            className="vapor-input"
          />

          <input
            type="number"
            min={0}
            step={0.5}
            placeholder="Horas estimadas"
            value={form.estimatedHours}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                estimatedHours: e.target.value,
              }))
            }
            className="vapor-input"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-5 flex-wrap">
          <motion.button
            type="button"
            onClick={add}
            whileTap={{ scale: 0.95 }}
            className="vapor-btn"
          >
            Agregar
          </motion.button>

          <motion.button
            onClick={update}
            whileTap={{ scale: 0.95 }}
            className="vapor-btn-secondary"
          >
            Actualizar
          </motion.button>

          <motion.button
            onClick={openDelete}
            whileTap={{ scale: 0.95 }}
            className="vapor-btn-danger"
          >
            Eliminar
          </motion.button>

          <motion.button
            onClick={clearForm}
            whileTap={{ scale: 0.95 }}
            className="vapor-btn-muted"
          >
            Limpiar
          </motion.button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-3xl overflow-hidden border border-white/20">
        <table className="w-full text-sm text-white/90">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Proyecto</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr
                key={t.id}
                onClick={() => selectTask(t)}
                className={`cursor-pointer transition ${
                  selectedId === t.id
                    ? "bg-pink-500/20"
                    : "hover:bg-white/10"
                }`}
              >
                <td className="p-3">{t.id}</td>
                <td className="p-3">{t.title}</td>
                <td className="p-3">{t.status}</td>
                <td className="p-3">
                  {t.project?.name ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteModal
        open={showDelete}
        title={selectedTask?.title ?? ""}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

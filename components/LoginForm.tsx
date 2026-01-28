"use client";

import { useState } from "react";

type User = { id: number; username: string };

export default function LoginForm({ onLogin }: { onLogin: (u: User) => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Usuario y contraseña requeridos");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Error al iniciar sesión");
        return;
      }
      onLogin(d.user);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm liminal-panel rounded-2xl p-6 md:p-8 animate-fade-in">
      <h1 className="text-xl md:text-2xl font-bold text-liminal-deep text-center mb-2">
        Task Manager Legacy
      </h1>
      <p className="text-liminal-void text-sm text-center mb-6">Sistema simple</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-liminal-shadow mb-1">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-liminal-shadow mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            autoComplete="current-password"
          />
        </div>
        {error && (
          <p className="text-red-600 text-sm" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full liminal-btn py-2.5 px-4 rounded-lg bg-liminal-void text-white text-sm font-medium hover:bg-liminal-shadow disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

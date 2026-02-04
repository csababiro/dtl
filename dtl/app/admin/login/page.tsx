"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { setSession, type AdminRole } from "@/lib/auth";
import { getNamespace } from "@/lib/i18n";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const admin = getNamespace("admin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Stub: no backend yet; set session and redirect
    setSession({ role, email: email || undefined });
    router.replace("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">{admin.login}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Autentificare stub (backend va fi integrat ulterior).
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
              Parolă
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-zinc-700">
              Rol (pentru test)
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            >
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="technician">Technician</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Autentificare
          </button>
        </form>
      </div>
    </main>
  );
}

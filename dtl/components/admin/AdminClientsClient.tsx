"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, Phone, Car, Calendar, Search } from "lucide-react";
import type { DummyClient } from "@/lib/dummy-clients";

function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function getFirstLetter(name: string): string {
  const char = name.trim().charAt(0).toUpperCase();
  return char || "#";
}

interface AdminClientsClientProps {
  clients: DummyClient[];
}

export function AdminClientsClient({ clients }: AdminClientsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const sortedFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? clients.filter((c) => c.name.toLowerCase().includes(q))
      : [...clients];
    return filtered.sort((a, b) => a.name.localeCompare(b.name, "ro"));
  }, [clients, search]);

  const byLetter = useMemo(() => {
    const map: Record<string, DummyClient[]> = {};
    for (const client of sortedFiltered) {
      const letter = getFirstLetter(client.name);
      if (!map[letter]) map[letter] = [];
      map[letter].push(client);
    }
    const letters = Object.keys(map).sort((a, b) => a.localeCompare(b, "ro"));
    return letters.map((letter) => ({ letter, list: map[letter]! }));
  }, [sortedFiltered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            placeholder="Caută după nume..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
            aria-label="Caută clienți"
          />
        </div>
        <span className="text-sm text-slate-500">
          {sortedFiltered.length} {sortedFiltered.length === 1 ? "client" : "clienți"}
        </span>
      </div>

      <div className="md:bg-white md:rounded-3xl md:border md:border-slate-100 md:shadow-sm overflow-hidden">
        {/* Mobile: cards by letter (no outer card, wider cards) */}
        <div className="md:hidden space-y-6 p-2 sm:p-4">
          {byLetter.length === 0 ? (
            <p className="px-4 py-12 text-center text-slate-500">Niciun client găsit.</p>
          ) : (
            byLetter.map(({ letter, list }) => (
              <div key={letter} className="space-y-4">
                <p className="text-sm font-black text-slate-600 uppercase tracking-widest">
                  {letter}
                </p>
                <div className="space-y-4">
                  {list.map((client) => (
                    <div
                      key={client.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(`/admin/clients/${client.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(`/admin/clients/${client.id}`);
                        }
                      }}
                      className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-3 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                          <User size={20} className="text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-900">{client.name}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-sm" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`mailto:${client.email}`}
                          className="text-blue-600 hover:underline flex items-center gap-2"
                        >
                          <Mail size={14} />
                          {client.email}
                        </a>
                        <a
                          href={`tel:${client.phone.replace(/\s/g, "")}`}
                          className="text-slate-600 hover:text-blue-600 flex items-center gap-2"
                        >
                          <Phone size={14} />
                          {client.phone}
                        </a>
                      </div>
                      {client.car ? (
                        <p className="flex items-center gap-2 text-slate-700 text-sm">
                          <Car size={16} className="text-slate-400 shrink-0" />
                          {client.car}
                        </p>
                      ) : (
                        <p className="text-slate-400 text-sm">—</p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-700">
                          <Calendar size={14} />
                          {client.programariCount} programări
                        </span>
                        <span className="text-slate-600 text-sm">
                          {formatDate(client.lastVisit)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Client
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Contact
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Mașină
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Programări
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Ultima vizită
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {byLetter.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Niciun client găsit.
                  </td>
                </tr>
              ) : (
                byLetter.map(({ letter, list }) => (
                  <React.Fragment key={letter}>
                    <tr className="bg-slate-100/80">
                      <td
                        colSpan={5}
                        className="px-6 py-3 text-sm font-black text-slate-600 uppercase tracking-widest"
                      >
                        {letter}
                      </td>
                    </tr>
                    {list.map((client) => (
                      <tr
                        key={client.id}
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/admin/clients/${client.id}`)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                              <User size={20} className="text-blue-600" />
                            </div>
                            <span className="font-bold text-slate-900">
                              {client.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-col gap-1">
                            <a
                              href={`mailto:${client.email}`}
                              className="text-blue-600 hover:underline flex items-center gap-2 text-sm"
                            >
                              <Mail size={14} />
                              {client.email}
                            </a>
                            <a
                              href={`tel:${client.phone.replace(/\s/g, "")}`}
                              className="text-slate-600 hover:text-blue-600 flex items-center gap-2 text-sm"
                            >
                              <Phone size={14} />
                              {client.phone}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {client.car ? (
                            <span className="flex items-center gap-2 text-slate-700">
                              <Car size={16} className="text-slate-400" />
                              {client.car}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-700">
                            <Calendar size={14} />
                            {client.programariCount}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-slate-600 text-sm">
                          {formatDate(client.lastVisit)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

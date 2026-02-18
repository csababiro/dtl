"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ClientPlata } from "@/lib/dummy-plati";
import { patch } from "@/lib/api-client";

function formatDateOnly(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface AdminFacturaDetailClientProps {
  plata: ClientPlata;
  onRefetch?: () => void | Promise<void>;
}

export function AdminFacturaDetailClient({ plata, onRefetch }: AdminFacturaDetailClientProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleUpdateNotes = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const notes = (form.querySelector('[name="notes"]') as HTMLTextAreaElement)?.value ?? "";
    setPending(true);
    const res = await patch<ClientPlata>(`/plati/${plata.id}`, { notes });
    setPending(false);
    if ("error" in res) {
      if (res.error.status === 401) router.push("/admin/login");
      return;
    }
    if (onRefetch) await onRefetch();
    else router.refresh();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 space-y-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Factură</dt>
            <dd className="text-slate-900 font-semibold">{plata.nrFactura}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Data</dt>
            <dd className="text-slate-900">{formatDateOnly(plata.data)}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Sumă</dt>
            <dd className="text-slate-900 font-bold">{plata.suma}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-0.5">Descriere</dt>
            <dd className="text-slate-900">{plata.descriere}</dd>
          </div>
        </dl>

        <form onSubmit={handleUpdateNotes} className="border-t border-slate-100 pt-6">
          <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
            Notițe (client / admin)
          </label>
          <textarea
            name="notes"
            rows={4}
            defaultValue={plata.notes ?? ""}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-700"
            placeholder="Notițe despre factură..."
          />
          <button
            type="submit"
            disabled={pending}
            className="mt-3 px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-50"
          >
            {pending ? "..." : "Salvează notițe"}
          </button>
        </form>
      </div>
    </div>
  );
}

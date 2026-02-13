"use client";

import type { ClientPlata } from "@/lib/dummy-plati";

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
  onUpdateNotes: (formData: FormData) => Promise<{ ok: boolean }>;
}

export function AdminFacturaDetailClient({ plata, onUpdateNotes }: AdminFacturaDetailClientProps) {
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

        <form action={(fd) => void onUpdateNotes(fd)} className="border-t border-slate-100 pt-6">
          <input type="hidden" name="id" value={plata.id} />
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
            className="mt-3 px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-bold hover:bg-slate-800"
          >
            Salvează notițe
          </button>
        </form>
      </div>
    </div>
  );
}

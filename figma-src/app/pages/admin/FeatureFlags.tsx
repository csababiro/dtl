import React, { useState, useEffect } from "react";
import { Flag, Info, Eye, ShieldAlert, Loader2 } from "lucide-react";
import { api } from "../../utils/api";
import { toast } from "sonner";

const FeatureFlags = () => {
  const [flags, setFlags] = useState<any>({
    service_general: true,
    service_anvelope: true,
    service_spalatorie: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const data = await api.get("/feature-flags");
      setFlags(data);
    } catch (err) {
      toast.error("Eroare la încărcarea flag-urilor");
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = (key: string) => {
    setFlags((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/feature-flags", flags);
      toast.success("Flag-uri salvate cu succes!");
    } catch (err) {
      toast.error("Eroare la salvare");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const flagList = [
    { key: "service_general", label: "Modul Service General", description: "Activează secțiunea de mecanică și revizii." },
    { key: "service_anvelope", label: "Modul Anvelope", description: "Activează secțiunea și calendarul pentru anvelope." },
    { key: "service_spalatorie", label: "Modul Spălătorie", description: "Activează secțiunea și calendarul pentru spălătorie." },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Funcționalități</h1>
          <p className="text-slate-500">Controlați vizibilitatea modulelor pentru staff și clienți.</p>
        </div>
        <div className="bg-amber-100 text-amber-700 p-4 rounded-2xl flex items-start gap-3 max-w-sm">
          <ShieldAlert className="shrink-0 mt-0.5" size={20} />
          <p className="text-xs font-bold leading-relaxed">
            Atenție! Modificarea acestor flag-uri afectează direct funcționalitatea live a site-ului.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Funcționalitate</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {flagList.map((flag) => (
                <tr key={flag.key} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${flags[flag.key] ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <div>
                        <p className="font-bold text-slate-900">{flag.label}</p>
                        <p className="text-sm text-slate-500">{flag.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => toggleFlag(flag.key)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${flags[flag.key] ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${flags[flag.key] ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          onClick={loadFlags}
          className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
        >
          Resetează
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {saving && <Loader2 className="animate-spin" size={18} />}
          Salvează Modificările
        </button>
      </div>
    </div>
  );
};

export default FeatureFlags;

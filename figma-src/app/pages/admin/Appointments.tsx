import React, { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Phone, MessageCircle, Mail, CheckCircle, XCircle, Clock, Loader2, Trash2 } from "lucide-react";
import { api } from "../../utils/api";
import { toast } from "sonner";

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await api.get("/appointments");
      // Sort by date descending
      const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAppointments(sorted);
    } catch (err) {
      toast.error("Eroare la încărcarea programărilor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur dorești să ștergi această programare?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Programare ștearsă");
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      toast.error("Eroare la ștergere");
    }
  };

  const handleConfirm = async (appt: any) => {
    try {
      await api.post("/appointments", { ...appt, status: "Confirmat" });
      toast.success("Programare confirmată");
      loadAppointments();
    } catch (err) {
      toast.error("Eroare la confirmare");
    }
  };

  const filteredAppointments = appointments.filter(a => 
    a.nume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.telefon?.includes(searchTerm) ||
    a.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Listă Programări</h1>
          <p className="text-slate-500">Vizualizează și gestionează toate cererile primite.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2">
            <Clock size={16} /> Istoric
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl flex-1 max-w-md">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Caută după nume, telefon sau mașină..." 
            className="bg-transparent border-none outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Client / Contact</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Dată & Oră</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Mașină / Tip</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">Nicio programare găsită.</td>
                </tr>
              ) : filteredAppointments.map((appt, i) => (
                <tr key={appt.id || i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{appt.nume}</span>
                      <div className="flex items-center gap-3 mt-1 text-slate-400">
                         <a href={`tel:${appt.telefon}`} title="Call"><Phone size={14} className="hover:text-blue-600 transition-colors" /></a>
                         {appt.email && <a href={`mailto:${appt.email}`} title="Email"><Mail size={14} className="hover:text-purple-600 transition-colors" /></a>}
                         <span className="text-[10px] ml-1">{appt.telefon}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{appt.data}</span>
                      <span className="text-xs text-blue-600 font-bold">{appt.ora}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{appt.marca} {appt.model}</span>
                      <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">{appt.tip}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      appt.status === 'Confirmat' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {appt.status || 'În așteptare'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {appt.status !== 'Confirmat' && (
                         <button 
                          onClick={() => handleConfirm(appt)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Confirmă"
                         >
                           <CheckCircle size={20} />
                         </button>
                       )}
                       <button 
                        onClick={() => handleDelete(appt.id)}
                        className="p-2 text-slate-400 hover:bg-red-50 rounded-lg transition-colors" title="Șterge"
                       >
                         <Trash2 size={20} className="hover:text-red-500" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTable;

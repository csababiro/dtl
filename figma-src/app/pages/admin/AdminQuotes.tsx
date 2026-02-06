import React, { useState, useEffect } from "react";
import { api } from "../../utils/api";
import { 
  ClipboardList, 
  Search, 
  Trash2, 
  ExternalLink, 
  User, 
  Mail, 
  Phone, 
  Car, 
  FileText, 
  Calendar,
  Loader2,
  FileDown
} from "lucide-react";
import { toast } from "sonner";

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuotes = async () => {
    try {
      const data = await api.get("/quotes");
      // Sort by date descending
      const sorted = Array.isArray(data) ? data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) : [];
      setQuotes(sorted);
    } catch (err) {
      toast.error("Eroare la încărcarea cererilor de ofertă");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur vrei să ștergi această cerere?")) return;
    try {
      await api.delete(`/quotes/${id}`);
      setQuotes(quotes.filter(q => q.id !== id));
      toast.success("Cerere ștearsă");
    } catch (err) {
      toast.error("Eroare la ștergere");
    }
  };

  const filteredQuotes = quotes.filter(q => 
    q.nume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.telefon?.includes(searchTerm) ||
    q.vin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.marcaModel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Cereri Ofertă</h1>
          <p className="text-slate-500">Gestionează cererile de piese și manoperă de la clienți.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 w-full md:w-96 shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Caută după nume, VIN, telefon..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
          <ClipboardList className="mx-auto text-slate-200 mb-4" size={64} />
          <h3 className="text-xl font-bold text-slate-900">Nu am găsit cereri</h3>
          <p className="text-slate-500">Nu există cereri de ofertă care să corespundă căutării tale.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredQuotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{quote.nume}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <Calendar size={14} /> {new Date(quote.createdAt).toLocaleString('ro-RO')}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(quote.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={16} className="text-slate-400" />
                      <a href={`mailto:${quote.email}`} className="hover:text-blue-600 transition-colors">{quote.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={16} className="text-slate-400" />
                      <a href={`tel:${quote.telefon}`} className="hover:text-blue-600 transition-colors">{quote.telefon}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Car size={16} className="text-slate-400" />
                      <span className="font-medium">{quote.marcaModel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FileText size={16} className="text-slate-400" />
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{quote.vin}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">Detalii piese solicitate</p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{quote.detalii}</p>
                  </div>

                  {quote.fileUrl && (
                    <div className="flex items-center gap-2">
                      <a 
                        href={quote.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                      >
                        <FileDown size={18} />
                        Vezi fișier atașat
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;

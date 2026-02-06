import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, FileText, Car, ClipboardList, Upload, Loader2, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { api } from "../utils/api";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";

type QuoteForm = {
  nume: string;
  email: string;
  telefon: string;
  vin: string;
  marcaModel: string;
  detalii: string;
};

const RequestQuote = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<QuoteForm>();

  const onSubmit = async (data: QuoteForm) => {
    setLoading(true);
    try {
      let fileUrl = "";
      
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        try {
          const uploadData = await api.postFormData("/upload", formData);
          fileUrl = uploadData.url;
        } catch (uploadErr) {
          console.error("Upload error:", uploadErr);
          // Continue without file if upload fails, or handle differently
          toast.warning("Fișierul nu a putut fi încărcat, dar trimitem cererea.");
        }
      }

      await api.post("/quotes", { ...data, fileUrl });
      setSubmitted(true);
      toast.success("Cerere de ofertă trimisă cu succes!");
    } catch (err) {
      console.error(err);
      toast.error("Eroare la trimiterea cererii. Te rugăm să încerci din nou.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center border border-blue-100"
        >
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Cerere trimisă!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Mulțumim pentru încredere! Echipa DTL analizează cererea ta și va reveni cu o ofertă personalizată pe email sau telefonic în cel mai scurt timp.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Trimite altă cerere
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Cere ofertă</h1>
        <p className="text-xl text-slate-500">Primește o ofertă personalizată pentru piese și manoperă.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-600" /> Date personale
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Numele tău *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    {...register("nume", { required: "Numele este obligatoriu" })}
                    placeholder="Ex: Popescu Ion"
                    className={`w-full p-4 pl-12 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.nume ? "border-red-500" : "border-slate-200"}`}
                  />
                  {errors.nume && <p className="text-xs text-red-500 mt-1">{errors.nume.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Adresa ta de email *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email"
                    {...register("email", { 
                      required: "Email-ul este obligatoriu",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Adresă de email invalidă"
                      }
                    })}
                    placeholder="Ex: ion@exemplu.ro"
                    className={`w-full p-4 pl-12 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.email ? "border-red-500" : "border-slate-200"}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Numărul tău de telefon *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel"
                    {...register("telefon", { required: "Telefonul este obligatoriu" })}
                    placeholder="07xx xxx xxx"
                    className={`w-full p-4 pl-12 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.telefon ? "border-red-500" : "border-slate-200"}`}
                  />
                  {errors.telefon && <p className="text-xs text-red-500 mt-1">{errors.telefon.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Car size={20} className="text-blue-600" /> Detalii vehicul
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Serie șasiu (VIN) *</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    {...register("vin", { required: "Seria de șasiu este obligatorie", minLength: { value: 17, message: "VIN trebuie să aibă 17 caractere" } })}
                    placeholder="WBAxxxxxxxxxxxxxx"
                    className={`w-full p-4 pl-12 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase ${errors.vin ? "border-red-500" : "border-slate-200"}`}
                  />
                  {errors.vin && <p className="text-xs text-red-500 mt-1">{errors.vin.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Marca și Model *</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    {...register("marcaModel", { required: "Marca și modelul sunt obligatorii" })}
                    placeholder="Ex: BMW Seria 3 2018"
                    className={`w-full p-4 pl-12 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.marcaModel ? "border-red-500" : "border-slate-200"}`}
                  />
                  {errors.marcaModel && <p className="text-xs text-red-500 mt-1">{errors.marcaModel.message}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ClipboardList size={20} className="text-blue-600" /> Detalii ofertă
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Detalii privind piesele dorite *</label>
                <textarea 
                  {...register("detalii", { required: "Te rugăm să oferi detalii despre piese" })}
                  rows={4}
                  placeholder="Ex: Schimb discuri și plăcuțe frână față, pompă apă..."
                  className={`w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${errors.detalii ? "border-red-500" : "border-slate-200"}`}
                />
                {errors.detalii && <p className="text-xs text-red-500 mt-1">{errors.detalii.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Atașează un fișier (Talon, Listă piese, etc.)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden" 
                    id="file-upload"
                    accept="image/*,.pdf"
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
                  >
                    {file ? (
                      <div className="flex items-center gap-2 text-blue-600 font-bold">
                        <CheckCircle2 size={24} />
                        <span>{file.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} className="text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Apasă pentru a alege un fișier</span>
                        <span className="text-xs text-slate-400 mt-1">Imagini sau PDF (max. 5MB)</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <>Trimite cererea <ChevronRight size={24} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestQuote;

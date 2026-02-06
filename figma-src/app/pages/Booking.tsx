import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon, Clock, Car, User, Mail, Phone, MessageSquare, CheckCircle2, ChevronRight, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../utils/api";
import { toast } from "sonner";

type BookingForm = {
  nume: string;
  telefon: string;
  email: string;
  marca: string;
  model: string;
  an: string;
  descriere: string;
  serviciiOptionale: string[];
  data: string;
  ora: string;
};

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const Booking = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flags, setFlags] = useState<any>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<BookingForm>();

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const data = await api.get("/feature-flags");
        setFlags(data);
        // Set first active tab based on flags
        if (!data.service_general) {
          if (data.service_anvelope) setActiveTab("anvelope");
          else if (data.service_spalatorie) setActiveTab("spalatorie");
        }
      } catch (err) {
        console.error("Error fetching flags", err);
      }
    };
    fetchFlags();
  }, []);

  const onSubmit = async (data: BookingForm) => {
    setLoading(true);
    try {
      await api.post("/appointments", { ...data, tip: activeTab });
      setSubmitted(true);
      toast.success("Programare înregistrată!");
    } catch (err) {
      toast.error("Eroare la trimiterea programării");
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
          className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl text-center border border-green-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Cerere trimisă!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Mulțumim! Cererea ta de programare a fost primită. Un consultant DTL te va contacta telefonic în maxim 30 de minute pentru confirmare.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Fă o altă programare
          </button>
        </motion.div>
      </div>
    );
  }

  const availableTabs = [
    { id: "general", label: "Service General", flag: "service_general" },
    { id: "anvelope", label: "Anvelope", flag: "service_anvelope" },
    { id: "spalatorie", label: "Spălătorie", flag: "service_spalatorie" },
  ].filter(tab => !flags || flags[tab.flag]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Programare Online</h1>
        <p className="text-slate-500">Rapid, simplu și eficient. Alege serviciul și intervalul dorit.</p>
      </div>

      {/* Tabs */}
      {availableTabs.length > 0 && (
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-12">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Car Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Car size={20} className="text-blue-600" /> Detalii Vehicul
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Marcă *</label>
              <input 
                {...register("marca", { required: true })}
                placeholder="Ex: BMW"
                className={`w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.marca ? "border-red-500" : "border-slate-200"}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Model *</label>
              <input 
                {...register("model", { required: true })}
                placeholder="Ex: Seria 3"
                className={`w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.model ? "border-red-500" : "border-slate-200"}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">An fabricație</label>
              <input 
                {...register("an")}
                placeholder="Ex: 2020"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <label className="text-sm font-bold text-slate-700">Descriere problemă / Servicii solicitate *</label>
            <textarea 
              {...register("descriere", { required: true })}
              rows={3}
              placeholder="Ex: Schimb ulei și filtre, zgomot la roata stânga față..."
              className={`w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${errors.descriere ? "border-red-500" : "border-slate-200"}`}
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CalendarIcon size={20} className="text-blue-600" /> Când dorești să vii?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Data preferată *</label>
              <input 
                type="date"
                {...register("data", { required: true })}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.data ? "border-red-500" : "border-slate-200"}`}
              />
              <p className="text-xs text-slate-400 mt-1">Poți programa cu maximum 30 zile în avans.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Ora preferată *</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <label key={slot} className="relative group cursor-pointer">
                    <input 
                      type="radio" 
                      value={slot} 
                      {...register("ora", { required: true })}
                      className="peer absolute opacity-0"
                    />
                    <div className="p-3 text-center border border-slate-200 rounded-lg text-sm font-bold text-slate-600 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 group-hover:border-blue-300 transition-all">
                      {slot}
                    </div>
                  </label>
                ))}
              </div>
              {errors.ora && <p className="text-xs text-red-500 mt-1">Te rugăm să alegi o oră.</p>}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue-600" /> Date de Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nume Complet *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  {...register("nume", { required: true })}
                  placeholder="Ion Popescu"
                  className={`w-full p-4 pl-12 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.nume ? "border-red-500" : "border-slate-200"}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Telefon *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="tel"
                  {...register("telefon", { required: true })}
                  placeholder="07xx xxx xxx"
                  className={`w-full p-4 pl-12 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.telefon ? "border-red-500" : "border-slate-200"}`}
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Email (opțional)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email"
                  {...register("email")}
                  placeholder="ion.popescu@exemplu.ro"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
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
        
        <p className="text-center text-sm text-slate-400">
          Prin trimiterea acestui formular, ești de acord cu prelucrarea datelor tale cu caracter personal.
        </p>
      </form>
    </div>
  );
};

export default Booking;

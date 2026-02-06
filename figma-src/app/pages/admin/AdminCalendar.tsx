import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Filter } from "lucide-react";

const days = [
  { name: "Luni", date: "15 Feb" },
  { name: "Marți", date: "16 Feb" },
  { name: "Miercuri", date: "17 Feb" },
  { name: "Joi", date: "18 Feb" },
  { name: "Vineri", date: "19 Feb" },
  { name: "Sâmbătă", date: "20 Feb" },
  { name: "Duminică", date: "21 Feb" },
];

const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const appointments = [
  { day: 0, hour: "08:00", client: "Popescu Ion", car: "BMW X5", type: "General", status: "confirmed" },
  { day: 0, hour: "10:00", client: "Enache Maria", car: "Audi A3", type: "Anvelope", status: "pending" },
  { day: 1, hour: "09:00", client: "Ionescu Alin", car: "Ford Focus", type: "Spălătorie", status: "confirmed" },
  { day: 2, hour: "11:00", client: "Radu Geo", car: "VW Golf", type: "General", status: "pending" },
  { day: 3, hour: "14:00", client: "Marin Elena", car: "Dacia Logan", type: "Anvelope", status: "confirmed" },
  { day: 4, hour: "08:00", client: "Stan Dan", car: "Mercedes C", type: "General", status: "confirmed" },
];

const AdminCalendar = () => {
  const [view, setView] = useState("Săptămână");
  const [module, setModule] = useState("General");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Calendar Programări</h1>
          <p className="text-slate-500">Gestionează fluxul de lucru în timp real.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200">
          {["Zi", "Săptămână", "Lună"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === v ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1">
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft size={18} /></button>
            <span className="font-bold text-slate-700 px-2">15 - 21 Februarie 2026</span>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight size={18} /></button>
          </div>
          <button className="bg-white border border-slate-200 p-3 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="bg-white border border-slate-200 px-4 py-3 rounded-xl font-bold text-sm text-slate-700 outline-none"
          >
            <option>Service General</option>
            <option>Anvelope</option>
            <option>Spălătorie</option>
          </select>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Plus size={18} /> Programare Nouă
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-slate-100">
          <div className="p-4 bg-slate-50"></div>
          {days.map((day, i) => (
            <div key={i} className="p-4 text-center border-l border-slate-100 bg-slate-50/50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{day.name}</p>
              <p className="text-lg font-black text-slate-900">{day.date}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[80px_repeat(7,1fr)] relative">
          {hours.map((hour, hIdx) => (
            <React.Fragment key={hour}>
              <div className="p-4 text-xs font-bold text-slate-400 border-b border-slate-50 text-right pr-6">
                {hour}
              </div>
              {days.map((_, dIdx) => {
                const appt = appointments.find(a => a.day === dIdx && a.hour === hour);
                return (
                  <div key={`${hIdx}-${dIdx}`} className="border-l border-b border-slate-50 relative p-1 group min-h-[80px]">
                    {appt && (
                      <div className={`h-full p-2 rounded-xl text-xs flex flex-col justify-between border-l-4 transition-all hover:scale-[1.02] cursor-pointer shadow-sm ${
                        appt.status === 'confirmed' 
                          ? 'bg-blue-50 border-blue-600 text-blue-900' 
                          : 'bg-amber-50 border-amber-500 text-amber-900'
                      }`}>
                        <div>
                          <p className="font-black truncate">{appt.client}</p>
                          <p className="opacity-70 font-bold truncate">{appt.car}</p>
                        </div>
                        <p className="text-[9px] uppercase font-black tracking-tight">{appt.type}</p>
                      </div>
                    )}
                    {!appt && (
                      <button className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-50/50 flex items-center justify-center transition-opacity">
                        <Plus size={16} className="text-blue-600" />
                      </button>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCalendar;

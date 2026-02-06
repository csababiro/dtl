import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users as UsersIcon, 
  ClipboardCheck, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Calendar,
  Loader2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { api } from "../../utils/api";
import { Link } from "react-router";

const data = [
  { name: "Lun", venit: 4000, prog: 24 },
  { name: "Mar", venit: 3000, prog: 18 },
  { name: "Mie", venit: 2000, prog: 15 },
  { name: "Joi", venit: 2780, prog: 20 },
  { name: "Vin", venit: 1890, prog: 12 },
  { name: "Sâm", venit: 2390, prog: 10 },
  { name: "Dum", venit: 0, prog: 0 },
];

const Dashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const appts = await api.get("/appointments");
        setAppointments(appts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const recentAppointments = appointments
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Panou General</h1>
          <p className="text-slate-500">Bun venit înapoi! Iată situația la zi.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2">
            <Calendar size={16} /> Ultimele 7 zile
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Venit Azi", val: "4.250 RON", trend: "+12%", up: true, icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
          { label: "Clienți Noi", val: "12", trend: "+4%", up: true, icon: UsersIcon, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Programări", val: loading ? "..." : appointments.length.toString(), trend: "+2%", up: true, icon: ClipboardCheck, color: "text-purple-600", bg: "bg-purple-100" },
          { label: "Timp Mediu", val: "1.5h", trend: "+0%", up: true, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.up ? "text-green-500" : "text-red-500"}`}>
                {stat.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.trend}
              </div>
            </div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h4>
            <p className="text-3xl font-black text-slate-900">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Evoluție Venituri</h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="venit" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Programări Noi</h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : (
            <div className="space-y-6">
              {recentAppointments.length === 0 ? (
                <p className="text-center text-slate-400 py-8">Nicio programare nouă.</p>
              ) : recentAppointments.map((item, i) => (
                <div key={item.id || i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {item.nume?.[0] || "?"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.nume}</h4>
                      <p className="text-xs text-slate-500">{item.marca} • {item.data}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${item.status === 'Confirmat' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status || "Solicitat"}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link 
            to="/admin/appointments"
            className="block w-full mt-8 py-3 bg-slate-50 text-slate-500 font-bold rounded-xl text-center text-sm hover:bg-slate-100 transition-colors"
          >
            Vezi toate programările
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

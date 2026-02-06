import React from "react";
import { UserPlus, MoreVertical, Shield, User, Search, Filter, Mail, Phone, Calendar } from "lucide-react";

const staff = [
  { name: "Admin DTL", email: "admin@dtl-auto.ro", role: "Super Admin", status: "Activ" },
  { name: "Mecanic Șef", email: "mecanic@dtl-auto.ro", role: "Technician", status: "Activ" },
  { name: "Secretariat", email: "office@dtl-auto.ro", role: "Admin", status: "Inactiv" },
];

const clients = [
  { name: "Popescu Ion", email: "ion@mail.ro", phone: "0712 345 678", joined: "15 Jan 2024", bookings: 3 },
  { name: "Maria Enache", email: "maria@mail.ro", phone: "0722 987 654", joined: "22 Jan 2024", bookings: 1 },
  { name: "Cristian Stan", email: "cristi@mail.ro", phone: "0744 111 222", joined: "01 Feb 2024", bookings: 5 },
];

const UsersAdmin = () => {
  return (
    <div className="space-y-12">
      {/* Staff Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Utilizatori Staff</h1>
            <p className="text-slate-500">Gestionează conturile echipei tale și permisiunile acestora.</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <UserPlus size={20} /> Adaugă Membru Staff
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {staff.map((member, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:border-blue-200 transition-colors">
              <button className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900">
                <MoreVertical size={18} />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                  {member.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{member.name}</h4>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-blue-600">
                  <Shield size={14} />
                  <span className="text-xs font-black uppercase tracking-widest">{member.role}</span>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${member.status === 'Activ' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clients Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Baza de Date Clienți</h2>
            <p className="text-slate-500">Listă completă cu toți clienții care au cont sau au făcut programări.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 text-slate-400">
                <Search size={18} />
                <input type="text" placeholder="Caută client..." className="bg-transparent border-none outline-none text-sm text-slate-900" />
             </div>
             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
                <Filter size={20} />
             </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Client</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Data Înscrierii</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Programări</th>
                  <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {client.name[0]}
                        </div>
                        <span className="font-bold text-slate-900">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={12} /> {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 mt-0.5">
                          <Phone size={12} /> {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={14} /> {client.joined}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-black text-xs">
                          {client.bookings}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="text-blue-600 font-bold text-sm hover:underline">Detalii</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UsersAdmin;

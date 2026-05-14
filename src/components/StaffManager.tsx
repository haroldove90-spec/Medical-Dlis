/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Users, DollarSign, TrendingUp, Award, Plus } from 'lucide-react';
import { Staff } from '../types';
import { motion } from 'motion/react';

const INITIAL_STAFF: Staff[] = [
  { id: '1', name: 'Dra. Lluvia G.', role: 'Directora / Médica', commission: 14500, services: 42 },
  { id: '2', name: 'Lic. Ana Martínez', role: 'Cosmetóloga', commission: 4800, services: 64 },
  { id: '3', name: 'Dr. Roberto Sánchez', role: 'Podólogo', commission: 3950, services: 18 },
  { id: '4', name: 'Lic. Carla Ruiz', role: 'Enfermera Gral', commission: 2100, services: 30 },
  { id: '5', name: 'Dr. Ricardo Valdés', role: 'Gastroenterólogo', commission: 7200, services: 12 },
];

export default function StaffManager() {
  const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF);

  const handleAddCommission = (id: string) => {
    setStaff(prev => prev.map(person => 
      person.id === id ? { ...person, commission: person.commission + 500, services: person.services + 1 } : person
    ));
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-display font-black text-slate-900">Gestión de Personal</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Comisiones y Rendimiento</p>
        </div>
        <button className="p-3 bg-brand-purple rounded-2xl text-white hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {staff.map((person, idx) => (
          <motion.div 
            key={person.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-brand-purple/20 transition-all cursor-pointer overflow-hidden relative"
            onClick={() => handleAddCommission(person.id)}
          >
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-[8px] font-black bg-brand-purple text-white px-2 py-1 rounded-lg uppercase tracking-widest">Añadir Venta</div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 text-xs shadow-sm group-hover:bg-brand-purple group-hover:text-white transition-all">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{person.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{person.role}</p>
                </div>
              </div>
              <Award className={`w-5 h-5 ${idx === 0 ? 'text-amber-400' : 'text-slate-200'}`} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Comisión</p>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-500" />
                  <span className="text-sm font-black text-slate-900">${person.commission.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Servicios</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-brand-purple" />
                  <span className="text-sm font-black text-slate-900">{person.services}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-4 bg-slate-50 text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all border border-slate-100">
        Reporte de Nómina Completo
      </button>
    </div>
  );
}

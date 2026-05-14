/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar, Clock, User, ChevronDown, Plus } from 'lucide-react';
import { AppointmentCategory } from '../types';

export default function AppointmentForm() {
  const [category, setCategory] = useState<AppointmentCategory>('Medicina Estética');

  const categories: AppointmentCategory[] = ['Podología', 'Cirugía General', 'Medicina Estética'];

  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-serif text-white">Nueva Cita</h3>
        <div className="p-2 bg-slate-800 rounded-lg">
          <Calendar className="w-5 h-5 text-brand-gold" />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">Categoría de Servicio</label>
          <div className="relative">
            <select
              id="appointment-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as AppointmentCategory)}
              className="w-full appearance-none input-dark pr-10 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-bg-card">
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">Paciente</label>
          <div className="relative">
            <input
              type="text"
              id="appointment-patient"
              placeholder="Buscar o ingresar paciente..."
              className="w-full input-dark pl-10"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">Fecha</label>
            <input
              type="date"
              id="appointment-date"
              className="w-full input-dark font-sans text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">Hora</label>
            <input
              type="time"
              id="appointment-time"
              className="w-full input-dark font-sans text-xs"
            />
          </div>
        </div>

        <button
          id="confirm-appointment"
          className="w-full mt-4 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5 border-2 border-black rounded-full p-0.5" />
          Agendar Cita
        </button>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, CalendarCheck, TrendingUp, Search, MoreHorizontal, Filter } from 'lucide-react';
import { Patient, Metric } from '../types';
import { motion } from 'motion/react';

const mockPatients: Patient[] = [
  { id: '1', name: 'Juan Pérez', lastVisit: '12 May, 2024', service: 'Cirugía General' },
  { id: '2', name: 'María García', lastVisit: '10 May, 2024', service: 'Medicina Estética' },
  { id: '3', name: 'Carlos Rodríguez', lastVisit: '08 May, 2024', service: 'Podología' },
  { id: '4', name: 'Ana Martínez', lastVisit: '05 May, 2024', service: 'Medicina Estética' },
  { id: '5', name: 'Roberto Sánchez', lastVisit: '02 May, 2024', service: 'Cirugía General' },
  { id: '6', name: 'Laura López', lastVisit: '01 May, 2024', service: 'Podología' },
];

const metrics: Metric[] = [
  { label: 'Citas del día', value: 12, change: '+20%', trend: 'up', icon: 'CalendarCheck' },
  { label: 'Pacientes nuevos', value: 48, change: '+12%', trend: 'up', icon: 'Users' },
  { label: 'Ventas totales', value: '$12,450', change: '+8%', trend: 'up', icon: 'TrendingUp' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={metric.label}
            className="dashboard-card"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">{metric.label}</p>
              <div className="p-2 bg-slate-800 rounded-lg">
                {metric.icon === 'CalendarCheck' && <CalendarCheck className="w-4 h-4 text-brand-gold" />}
                {metric.icon === 'Users' && <Users className="w-4 h-4 text-brand-gold" />}
                {metric.icon === 'TrendingUp' && <TrendingUp className="w-4 h-4 text-brand-gold" />}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h4 className="text-4xl font-serif text-white tracking-tight">{metric.value}</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                metric.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {metric.change}
              </span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Patients Table Section */}
      <section className="dashboard-card overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-800/10 -mx-6 -mt-6 p-6 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-serif italic text-white">Lista de Pacientes</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Resumen de actividad reciente</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="input-dark py-2 text-xs w-full md:w-56"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            </div>
            <button className="text-[10px] font-bold uppercase tracking-widest text-brand-gold border border-brand-gold/30 px-4 py-2.5 rounded-lg hover:bg-brand-gold/10 transition-colors">
              Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800">
                <th className="pb-4 font-bold">Paciente</th>
                <th className="pb-4 font-bold">Servicio</th>
                <th className="pb-4 font-bold">Última Visita</th>
                <th className="pb-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {mockPatients.map((patient) => (
                <tr key={patient.id} className="group hover:bg-slate-800/20 transition-all cursor-pointer">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-[10px] border border-slate-700">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-200 text-sm group-hover:text-brand-gold transition-colors">{patient.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`text-[10px] font-bold italic px-2.5 py-1 rounded-full ${
                      patient.service === 'Medicina Estética' ? 'bg-purple-900/20 text-purple-300' :
                      patient.service === 'Cirugía General' ? 'bg-amber-900/20 text-amber-300' :
                      'bg-sky-900/20 text-sky-300'
                    }`}>
                      {patient.service}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-slate-400 font-serif italic">{patient.lastVisit}</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-500 hover:text-brand-gold">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

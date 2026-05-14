/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, CalendarCheck, TrendingUp, Search, MoreHorizontal, FileText, ChevronRight, Package, DollarSign } from 'lucide-react';
import { Patient, Metric, Role } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import ClinicalRecord from './ClinicalRecord';
import FinanceReport from './FinanceReport';
import InventoryManager from './InventoryManager';
import StaffManager from './StaffManager';
import PatientPortal from './PatientPortal';

const mockPatients: Patient[] = [
  { id: '1', name: 'Juan Pérez', lastVisit: '12 May, 2024', service: 'Cirugía General', phone: '5512345678' },
  { id: '2', name: 'María García', lastVisit: '10 May, 2024', service: 'Medicina Estética', phone: '5587654321' },
  { id: '3', name: 'Carlos Rodríguez', lastVisit: '08 May, 2024', service: 'Podología', phone: '5599887766' },
  { id: '4', name: 'Ana Martínez', lastVisit: '05 May, 2024', service: 'Medicina Estética', phone: '5544332211' },
  { id: '5', name: 'Roberto Sánchez', lastVisit: '02 May, 2024', service: 'Cirugía General', phone: '5566778899' },
  { id: '6', name: 'Laura López', lastVisit: '01 May, 2024', service: 'Podología', phone: '5511223344' },
];

const metricsData: Metric[] = [
  { label: 'Citas del día', value: 12, change: '+20%', trend: 'up', icon: 'CalendarCheck' },
  { label: 'Pacientes nuevos', value: 48, change: '+12%', trend: 'up', icon: 'Users' },
  { label: 'Ingresos Hoy', value: '$12,450', change: '+8%', trend: 'up', icon: 'TrendingUp' },
];

interface DashboardProps {
  activeRole: Role;
}

export default function Dashboard({ activeRole }: DashboardProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showFinance, setShowFinance] = useState(activeRole === Role.ADMIN || activeRole === Role.RECEPCION);

  // Filter patients based on role
  const filteredPatients = mockPatients.filter(p => {
    if (activeRole === Role.ESTETICA) return p.service === 'Medicina Estética';
    if (activeRole === Role.MEDICO) return p.service === 'Cirugía General' || p.service === 'Podología';
    return true;
  });

  if (activeRole === Role.PACIENTE) {
    return <PatientPortal />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Metrics Section - Simplified for non-admin roles */}
      {(activeRole === Role.ADMIN || activeRole === Role.RECEPCION) && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metricsData.map((metric, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={metric.label}
              className="dashboard-card border-none bg-gradient-to-br from-white to-slate-50/50 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{metric.label}</p>
                <div className="p-2.5 bg-brand-purple-light rounded-xl">
                  {metric.icon === 'CalendarCheck' && <CalendarCheck className="w-5 h-5 text-brand-purple" />}
                  {metric.icon === 'Users' && <Users className="w-5 h-5 text-brand-purple" />}
                  {metric.icon === 'TrendingUp' && <TrendingUp className="w-5 h-5 text-brand-purple" />}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h4 className="text-3xl font-black text-slate-900 tracking-tight">{metric.value}</h4>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                  metric.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                }`}>
                  {metric.change}
                </span>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Admin Specific Modules */}
      {activeRole === Role.ADMIN && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InventoryManager />
          <StaffManager />
        </section>
      )}

      {/* Finance Section - Only for Admin/Reception */}
      {(activeRole === Role.ADMIN || activeRole === Role.RECEPCION) && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Gestión Financiera</h3>
            <button 
              onClick={() => setShowFinance(!showFinance)}
              className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1"
            >
              {showFinance ? 'Ocultar' : 'Ver Reporte de Ingresos'}
              <ChevronRight className={`w-3 h-3 transition-transform ${showFinance ? 'rotate-90' : ''}`} />
            </button>
          </div>
          <AnimatePresence>
            {showFinance && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <FinanceReport />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Patients List Section */}
      <section className="dashboard-card border-none shadow-sm pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-display font-black text-slate-900">
              {activeRole === Role.MEDICO ? 'Control de Pacientes' : activeRole === Role.ESTETICA ? 'Agenda de Cabina' : 'Pacientes Recientes'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">
              {activeRole === Role.ESTETICA ? 'Tratamientos Estéticos' : 'Actividad del consultorio'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="input-light py-2 text-xs w-full md:w-56"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-50">
                <th className="pb-4 px-4 font-black">Paciente</th>
                <th className="pb-4 px-4 font-black">Servicio</th>
                <th className="pb-4 px-4 font-black">Última Visita</th>
                <th className="pb-4 px-4 font-black text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="group hover:bg-slate-50 transition-all cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-purple-light flex items-center justify-center text-brand-purple font-black text-xs">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-bold text-slate-900 text-sm group-hover:text-brand-purple transition-colors">{patient.name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg ${
                      patient.service === 'Medicina Estética' ? 'bg-purple-100 text-purple-700' :
                      patient.service === 'Cirugía General' ? 'bg-rose-100 text-rose-700' :
                      'bg-sky-100 text-sky-700'
                    }`}>
                      {patient.service}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-xs text-slate-500 font-medium italic">{patient.lastVisit}</span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-2 hover:bg-white hover:text-brand-purple hover:shadow-sm rounded-xl transition-all"
                        onClick={(e) => { e.stopPropagation(); setSelectedPatient(patient); }}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white hover:text-slate-900 hover:shadow-sm rounded-xl transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredPatients.map((patient) => (
            <div 
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-100 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-purple text-white flex items-center justify-center font-black text-xs">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{patient.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{patient.lastVisit}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg ${
                  patient.service === 'Medicina Estética' ? 'bg-purple-100 text-purple-700' :
                  patient.service === 'Cirugía General' ? 'bg-rose-100 text-rose-700' :
                  'bg-sky-100 text-sky-700'
                }`}>
                  {patient.service}
                </span>
                <button className="flex items-center gap-1.5 text-xs font-black text-brand-purple">
                  Ver Expediente
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clinical Record Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setSelectedPatient(null)}
            />
            <div className="relative w-full max-w-5xl z-10 h-full md:h-auto">
              <ClinicalRecord 
                patient={selectedPatient} 
                onClose={() => setSelectedPatient(null)} 
                activeRole={activeRole}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, CalendarCheck, TrendingUp, Search, MoreHorizontal, FileText, ChevronRight, Package, DollarSign, Sparkles, UserRound } from 'lucide-react';
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
  const [showFinance, setShowFinance] = useState(false);

  const filteredPatients = mockPatients.filter(p => {
    if (activeRole === Role.ESTETICA) return p.service === 'Medicina Estética';
    if (activeRole === Role.MEDICO) return p.service === 'Cirugía General' || p.service === 'Podología';
    return true;
  });

  if (activeRole === Role.PACIENTE) {
    return <PatientPortal />;
  }

  // --- RENDER HELPERS ---

  const renderAdminModule = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metricsData.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InventoryManager />
        <StaffManager />
      </div>

      <section className="dashboard-card border-none shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-black text-slate-900">Análisis Financiero Global</h3>
          <button 
            onClick={() => setShowFinance(!showFinance)}
            className="p-2 bg-slate-50 rounded-xl text-brand-purple hover:bg-brand-purple-light transition-all"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${showFinance ? 'rotate-90' : ''}`} />
          </button>
        </div>
        {showFinance && <FinanceReport />}
      </section>
    </div>
  );

  const renderReceptionModule = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-8 space-y-8">
        <section className="dashboard-card border-none shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-black text-slate-900">Agenda de Citas</h3>
            <div className="flex gap-2">
               <button className="p-2 bg-slate-50 rounded-xl text-slate-400"><CalendarCheck className="w-4 h-4" /></button>
               <button className="p-2 bg-slate-50 rounded-xl text-slate-400"><Search className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="space-y-4">
            {mockPatients.map((p, i) => (
              <div key={p.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400">09:{i}0 AM</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                    <p className="text-[10px] font-bold text-brand-purple uppercase tracking-tighter">{p.service}</p>
                  </div>
                </div>
                <button className="p-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                   Recordar
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <section className="dashboard-card bg-slate-900 text-white border-none shadow-xl">
           <DollarSign className="w-8 h-8 text-brand-purple mb-4" />
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Caja del Día</p>
           <h4 className="text-3xl font-black mb-6">$12,450.00</h4>
           <button className="w-full py-4 bg-brand-purple rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-purple-dark transition-all">
              Emitir Ticket de Pago
           </button>
        </section>
        <button className="w-full p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center gap-3 text-slate-400 hover:border-brand-purple hover:text-brand-purple transition-all group">
            <Users className="w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Nuevo Paciente</span>
        </button>
      </div>
    </div>
  );

  const renderClinicalModule = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="dashboard-card border-none shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-display font-black text-slate-900">
              {activeRole === Role.MEDICO ? 'Médico: Expedientes Quirúrgicos' : 'Estética: Fichas de Cabina'}
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Seleccione un paciente para ver su historial y notas de evolución
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Filtrar pacientes..." className="input-light py-2 pl-10 text-xs w-full md:w-64" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
          {filteredPatients.map((patient) => (
            <div 
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-brand-purple/20 hover:bg-white transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-brand-purple text-sm shadow-sm group-hover:bg-brand-purple group-hover:text-white transition-all">
                  {patient.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-brand-purple transition-colors">{patient.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{patient.service}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Última: {patient.lastVisit}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {activeRole === Role.ESTETICA && (
                   <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-purple-light rounded-lg text-brand-purple text-[10px] font-black uppercase tracking-widest">
                      <Sparkles className="w-3 h-3" />
                      5 de 10 Sesiones
                   </div>
                )}
                <div className="p-2 bg-white rounded-xl text-slate-300 group-hover:text-brand-purple transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {activeRole === Role.ESTETICA && (
        <section className="dashboard-card border-none bg-slate-50">
           <h4 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Galería de Evolución (Cabina)</h4>
           <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-square bg-slate-200 rounded-2xl border-4 border-white shadow-sm flex items-center justify-center overflow-hidden group">
                   <UserRound className="w-8 h-8 text-slate-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
           </div>
        </section>
      )}
    </div>
  );

  return (
    <div className="pb-12">
      <AnimatePresence mode="wait">
        {selectedPatient ? (
          <motion.div
            key="clinical-record-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-8"
          >
            <div 
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
          </motion.div>
        ) : (
          <motion.div
            key={`dashboard-${activeRole}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[60vh]"
          >
            {activeRole === Role.ADMIN && renderAdminModule()}
            {activeRole === Role.RECEPCION && renderReceptionModule()}
            {(activeRole === Role.MEDICO || activeRole === Role.ESTETICA) && renderClinicalModule()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


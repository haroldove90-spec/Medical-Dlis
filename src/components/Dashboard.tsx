/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, CalendarCheck, TrendingUp, Search, MoreHorizontal, FileText, ChevronRight, Package, DollarSign, Sparkles, UserRound, Image as ImageIcon } from 'lucide-react';
import { Patient, Metric, Role } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import ClinicalRecord from './ClinicalRecord';
import FinanceReport from './FinanceReport';
import InventoryManager from './InventoryManager';
import StaffManager from './StaffManager';
import PatientPortal from './PatientPortal';

const INITIAL_PATIENTS: Patient[] = [
  { id: '1', name: 'Juan Pérez', lastVisit: '12 May, 2024', service: 'Cirugía General', phone: '5512345678', status: 'Confirmado', sessions: 'N/A' },
  { id: '2', name: 'María García', lastVisit: '10 May, 2024', service: 'Medicina Estética', phone: '5587654321', status: 'En Cabina', sessions: '3 de 8' },
  { id: '3', name: 'Carlos Rodríguez', lastVisit: '08 May, 2024', service: 'Podología', phone: '5599887766', status: 'Pendiente', sessions: '1 de 1' },
  { id: '4', name: 'Ana Martínez', lastVisit: '05 May, 2024', service: 'Medicina Estética', phone: '5544332211', status: 'Finalizado', sessions: '10 de 10' },
  { id: '5', name: 'Roberto Sánchez', lastVisit: '02 May, 2024', service: 'Cirugía General', phone: '5566778899', status: 'Programado', sessions: 'Pre-Op' },
  { id: '6', name: 'Laura López', lastVisit: '01 May, 2024', service: 'Podología', phone: '5511223344', status: 'Confirmado', sessions: '2 de 3' },
  { id: '7', name: 'Elena Ramírez', lastVisit: '13 May, 2024', service: 'Medicina Estética', phone: '5522334455', status: 'Confirmado', sessions: '5 de 12' },
  { id: '8', name: 'Diego Torres', lastVisit: '14 May, 2024', service: 'Cirugía General', phone: '5533445566', status: 'Programado', sessions: 'N/A' },
];

const metricsData: Metric[] = [
  { label: 'Citas del día', value: 12, change: '+20%', trend: 'up', icon: 'CalendarCheck' },
  { label: 'Pacientes nuevos', value: 48, change: '+12%', trend: 'up', icon: 'Users' },
  { label: 'Ingresos Hoy', value: '$12,450', change: '+8%', trend: 'up', icon: 'TrendingUp' },
];

interface DashboardProps {
  activeRole: Role;
  activeSection: string;
}

export default function Dashboard({ activeRole, activeSection }: DashboardProps) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFinance, setShowFinance] = useState(false);

  // Filter patients based on role and search query
  const filteredPatients = patients.filter(p => {
    const matchesRole = activeRole === Role.ESTETICA ? p.service === 'Medicina Estética' :
                        activeRole === Role.MEDICO ? (p.service === 'Cirugía General' || p.service === 'Podología') :
                        true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleAddPatient = () => {
    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Nuevo Paciente ' + (patients.length + 1),
      lastVisit: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      service: activeRole === Role.ESTETICA ? 'Medicina Estética' : 'Cirugía General',
      phone: '5500000000',
      status: 'Confirmado',
      sessions: activeRole === Role.ESTETICA ? '1 de 10' : 'N/A'
    };
    setPatients([newPatient, ...patients]);
  };

  if (activeRole === Role.PACIENTE) {
    return <PatientPortal />;
  }

  // --- RENDER HELPERS BY SECTION ---

  const renderAdminDashboard = () => (
    <div className="space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Egresos Caja', value: '$8,240', icon: DollarSign, trend: 'Sincronizado', color: 'from-slate-800 to-slate-900' },
          { label: 'Pacientes Nuevos', value: '128', icon: Users, trend: '+5%', color: 'from-brand-purple to-purple-600' },
          { label: 'Stock Alarma', value: '3 Items', icon: Package, trend: 'Revisar', color: 'from-rose-500 to-rose-600' },
          { label: 'Citas Hoy', value: '14', icon: CalendarCheck, trend: '90% Ocup.', color: 'from-sky-500 to-sky-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-[2.5rem] bg-gradient-to-br ${stat.color} text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform`}
          >
            <stat.icon className="absolute right-[-5%] bottom-[-5%] w-24 h-24 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60 mb-2">{stat.label}</p>
            <h4 className="text-3xl font-black mb-3">{stat.value}</h4>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black bg-white/10 p-1 px-2 rounded-lg border border-white/5">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="dashboard-card border-none shadow-sm p-8 bg-white/50 border border-white">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Rendimiento Operativo</h3>
           <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
              <TrendingUp className="w-5 h-5" />
           </div>
        </div>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-400 bg-slate-50/30">
           <p className="text-[10px] font-black uppercase tracking-widest text-center">Inyectando datos de analítica clínica...<br/><span className="text-brand-purple">Sincronizado con Stripe API</span></p>
        </div>
      </section>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-none italic">Stock & <span className="text-brand-purple">Logística.</span></h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Suministros médicos y consumibles</p>
        </div>
        <button className="p-5 bg-brand-purple text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-purple/20 hover:translate-y-[-2px] transition-all">
          Surtir Pedido
        </button>
      </div>
      <InventoryManager />
    </div>
  );

  const renderStaff = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-4">
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-none italic">Team <span className="text-brand-purple">Medical.</span></h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Colaboradores y Horarios</p>
        </div>
      </div>
      <StaffManager />
    </div>
  );

  const renderAgenda = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-8">
        <section className="dashboard-card border-none shadow-sm p-10 bg-white/50 border border-white rounded-[3rem]">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Agenda de Hoy</h3>
            <div className="flex bg-slate-100 p-2 rounded-2xl">
              <button className="px-5 py-2.5 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-200/50 transition-all">Hoy</button>
              <button className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Mes</button>
            </div>
          </div>
          <div className="space-y-5">
            {filteredPatients.map((p, i) => (
              <div key={p.id} className="group p-6 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-between hover:border-brand-purple/30 hover:shadow-2xl hover:shadow-brand-purple/10 transition-all duration-500 cursor-pointer" onClick={() => setSelectedPatient(p)}>
                <div className="flex items-center gap-8">
                  <div className="text-right w-16">
                    <p className="text-sm font-black text-slate-900">09:{i}0</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AM</p>
                  </div>
                  <div className="w-px h-12 bg-slate-100 group-hover:bg-brand-purple/20 transition-colors"></div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-brand-purple transition-colors mb-1">{p.name}</h4>
                    <div className="flex items-center gap-3">
                       <span className="text-[9px] font-black bg-brand-purple/5 text-brand-purple p-1 px-2 rounded-lg uppercase tracking-widest border border-brand-purple/10">{p.service}</span>
                       <span className="text-[9px] font-bold text-slate-400">• {p.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="hidden sm:block text-right">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Estado</p>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                         <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{p.status || 'Confirmado'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <button className="p-4 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all group/wa">
                         <Sparkles className="w-4 h-4 group-hover/wa:rotate-12" />
                      </button>
                      <button className="p-4 bg-slate-50 text-slate-300 rounded-2xl group-hover:bg-brand-purple group-hover:text-white group-hover:rotate-[-5deg] transition-all duration-500">
                         <ChevronRight className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <section className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-brand-purple rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
           <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Módulo de Cobranza</p>
              <h4 className="text-4xl font-black mb-1 italic tracking-tighter">$12,450</h4>
              <p className="text-[9px] font-bold text-brand-purple uppercase tracking-[0.2em] mb-12">Recaudación Diaria Total</p>
              
              <div className="space-y-5 mb-12">
                 <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ventas Estética</span>
                    <span className="text-xs font-black text-white">$8,500</span>
                 </div>
                 <div className="flex justify-between items-center group/item hover:translate-x-1 transition-transform">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Consultas Médicas</span>
                    <span className="text-xs font-black text-white">$3,950</span>
                 </div>
                 <div className="w-full h-px bg-white/5 mt-4"></div>
              </div>

              <button className="w-full py-5 bg-brand-purple rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-purple-dark transition-all shadow-xl shadow-brand-purple/20 hover:scale-[1.02] active:scale-95">
                 Emitir Factura / Ticket
              </button>
           </div>
        </section>

        <div 
          onClick={handleAddPatient}
          className="p-10 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center gap-4 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all cursor-pointer group"
        >
           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-slate-400 group-hover:text-brand-purple transition-colors" />
           </div>
           <div>
              <p className="text-sm font-black text-slate-900 mb-1">Nuevo Paciente</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">Agregar registro a la base de datos de Medical D'Lis</p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderClinicalView = () => (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4">
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-none italic">
            {activeSection === 'photos' ? 'Seguimiento' : 'Control de'} <span className="text-brand-purple">{activeSection === 'photos' ? 'Fotográfico.' : 'Expedientes.'}</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-3">
            {activeSection === 'photos' ? 'Galería de evolución por paciente' : 'Historial clínico y seguimiento activo'}
          </p>
        </div>
        <div className="relative group">
          <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-purple" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o servicio..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-xs font-bold w-full md:w-96 shadow-sm outline-none focus:border-brand-purple/40 ring-0 focus:ring-4 focus:ring-brand-purple/5 transition-all" 
          />
        </div>
      </header>

      {activeSection === 'photos' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredPatients.map((p, i) => (
             <motion.div
               key={p.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               onClick={() => setSelectedPatient(p)}
               className="dashboard-card group cursor-pointer hover:border-brand-purple/40"
             >
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-brand-purple">
                      {p.name[0]}
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-brand-purple">{p.name}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.service}</p>
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                   {[1,2,3].map(j => (
                     <div key={j} className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <ImageIcon className="w-4 h-4 text-slate-200" />
                     </div>
                   ))}
                </div>
                <div className="mt-6 flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">3 Archivos</span>
                   <span className="text-[9px] font-black text-brand-purple uppercase tracking-widest">Ver Todo</span>
                </div>
             </motion.div>
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredPatients.map((patient, i) => (
            <motion.div 
              key={patient.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPatient(patient)}
              className="group p-6 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between cursor-pointer hover:border-brand-purple/40 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-center gap-8 mb-6 sm:mb-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center font-black text-brand-purple text-xl shadow-inner group-hover:bg-brand-purple group-hover:text-white transition-all transform group-hover:rotate-[-8deg] duration-500">
                    {patient.name[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-brand-purple transition-colors mb-2">{patient.name}</h4>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 p-1 px-3 rounded-xl uppercase tracking-widest">{patient.service}</span>
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                    <span className="text-[10px] text-brand-purple font-black uppercase tracking-widest">{patient.lastVisit}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-10">
                <div className="hidden lg:flex flex-col items-end">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Estatus Médico</p>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5">{patient.status || 'Activo'}</div>
                    {patient.sessions !== 'N/A' && (
                      <span className="text-[11px] font-black text-brand-purple italic">{patient.sessions}</span>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-300 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-all duration-500 border border-slate-100 group-hover:border-brand-purple/20">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBoxView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
       <div className="lg:col-span-4 space-y-8">
          <section className="p-10 bg-brand-purple rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
             <DollarSign className="absolute right-[-10%] top-[-10%] w-48 h-48 opacity-10" />
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Ingresos del Turno</p>
                <h4 className="text-5xl font-black italic">$4,860</h4>
                <div className="h-px bg-white/20 my-8"></div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span>Efectivo</span>
                      <span>$2,450</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span>Tarjeta</span>
                      <span>$2,410</span>
                   </div>
                </div>
                <button className="w-full py-5 bg-white text-brand-purple rounded-2xl text-[10px] font-black uppercase tracking-widest mt-12 shadow-xl hover:scale-[1.02] transition-all">
                   Cierre de Caja
                </button>
             </div>
          </section>
       </div>
       <div className="lg:col-span-8">
          <section className="dashboard-card border-none shadow-sm p-10">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Ventas Recientes</h3>
                <button className="p-4 bg-slate-50 text-brand-purple rounded-2xl text-[10px] font-black uppercase tracking-widest">Reporte PDF</button>
             </div>
             <div className="space-y-4">
                {[
                  { id: 'V-001', client: 'Beatriz Solis', amount: '$1,200', method: 'Tarjeta', status: 'Pagado' },
                  { id: 'V-002', client: 'Héctor Moreno', amount: '$850', method: 'Efectivo', status: 'Pagado' },
                  { id: 'V-003', client: 'Carla Ruiz', amount: '$2,810', method: 'Tarjeta', status: 'Pagado' },
                ].map((v, i) => (
                  <div key={v.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                           <DollarSign className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{v.id}</p>
                           <h4 className="text-sm font-black text-slate-900">{v.client}</h4>
                        </div>
                     </div>
                     <div className="flex items-center gap-8">
                        <div className="text-right">
                           <p className="text-sm font-black text-slate-900">{v.amount}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{v.method}</p>
                        </div>
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                           {v.status}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </section>
       </div>
    </div>
  );

  return (
    <div className="pb-12">
      <AnimatePresence mode="wait">
        {selectedPatient ? (
          <motion.div
            key="clinical-record-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12"
          >
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl transition-all" onClick={() => setSelectedPatient(null)} />
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-6xl z-10 max-h-[90vh] overflow-y-auto rounded-[3.5rem] bg-white shadow-[0_32px_120px_rgba(0,0,0,0.4)]"
            >
              <ClinicalRecord 
                patient={selectedPatient} 
                onClose={() => setSelectedPatient(null)}
                activeRole={activeRole}
                activeSection={activeSection}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={`section-${activeSection}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ADMIN SECTIONS */}
            {activeSection === 'metrics' && renderAdminDashboard()}
            {activeSection === 'inventory' && renderInventory()}
            {activeSection === 'staff' && renderStaff()}
            {activeSection === 'finance' && <div className="space-y-8 animate-in fade-in zoom-in duration-500 transition-all"><FinanceReport /></div>}

            {/* RECEPTION SECTIONS */}
            {activeSection === 'agenda' && renderAgenda()}
            {activeSection === 'registration' && renderAgenda()}
            {activeSection === 'box' && renderBoxView()}
            
            {/* CLINICAL SECTIONS (MEDIC & AESTHETIC) */}
            {(activeSection === 'records' || activeSection === 'consent' || activeSection === 'recipe' || 
              activeSection === 'cabin' || activeSection === 'photos' || activeSection === 'sessions') && renderClinicalView()}
            
            {/* PATIENT SECTIONS */}
            {activeSection === 'appointments' && renderAgenda()}
            {activeSection === 'results' && renderClinicalView()}
            {activeSection === 'default' && (
              <div className="h-96 flex flex-col items-center justify-center text-slate-400 space-y-6">
                 <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 animate-pulse">
                    <Sparkles className="w-10 h-10 text-brand-purple/30" />
                 </div>
                 <div className="text-center">
                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500 mb-2">Sincronizando Módulos</p>
                    <p className="text-xs font-bold text-slate-300 italic">Preparando entorno para {activeRole}...</p>
                 </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


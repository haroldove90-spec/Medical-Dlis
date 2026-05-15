/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, CalendarCheck, TrendingUp, Search, MoreHorizontal, FileText, ChevronRight, Package, DollarSign, Sparkles, UserRound, Plus, Image as ImageIcon, ClipboardList, Activity, Stethoscope, Trash2, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { Patient, Metric, Role, InformedConsent, ConsentClosure, PhysicalExploration } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import ClinicalRecord from './ClinicalRecord';
import FinanceReport from './FinanceReport';
import InventoryManager from './InventoryManager';
import StaffManager from './StaffManager';
import PatientPortal from './PatientPortal';
import ConsentForm from './ConsentForm';
import ConsentClosureForm from './ConsentClosureForm';
import PhysicalExplorationForm from './PhysicalExplorationForm';

const CONSENT_STORAGE_KEY = 'medical_dlis_informed_consents';
const CLOSURE_STORAGE_KEY = 'medical_dlis_consent_closures';
const EXPLORATION_STORAGE_KEY = 'medical_dlis_physical_explorations';

const metricsData: Metric[] = [
  { label: 'Citas del día', value: 12, change: '+20%', trend: 'up', icon: 'CalendarCheck' },
  { label: 'Pacientes nuevos', value: 48, change: '+12%', trend: 'up', icon: 'Users' },
  { label: 'Ingresos Hoy', value: '$12,450', change: '+8%', trend: 'up', icon: 'TrendingUp' },
];

interface DashboardProps {
  activeRole: Role;
  activeSection: string;
}

export const INITIAL_PATIENTS: Patient[] = [
  { 
    id: '1', 
    name: 'Ana García López', 
    age: 28, 
    lastVisit: '12 May, 2024', 
    status: 'Activo', 
    phone: '55-1234-5678', 
    email: 'ana.garcia@email.com',
    gender: 'Femenino',
    bloodType: 'O+',
    sessions: '3 de 10',
    service: 'Medicina Estética'
  },
  { 
    id: '2', 
    name: 'Carlos Ruiz Martínez', 
    age: 35, 
    lastVisit: '05 May, 2024', 
    status: 'Seguimiento', 
    phone: '55-8765-4321', 
    email: 'carlos.ruiz@email.com',
    gender: 'Masculino',
    bloodType: 'A+',
    sessions: '8 de 12',
    service: 'Cirugía General'
  },
  { 
    id: '3', 
    name: 'Elena Rodríguez Silva', 
    age: 42, 
    lastVisit: '20 Abr, 2024', 
    status: 'Nuevo', 
    phone: '55-4433-2211', 
    email: 'elena.rodriguez@email.com',
    gender: 'Femenino',
    bloodType: 'AB-',
    sessions: '1 de 5',
    service: 'Podología'
  },
];

export default function Dashboard({ activeRole, activeSection }: DashboardProps) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [clinicalRecordView, setClinicalRecordView] = useState<'list' | 'form'>('list');
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

  const [justSavedRecordId, setJustSavedRecordId] = useState<string | null>(null);
  const [consents, setConsents] = useState<InformedConsent[]>([]);
  const [selectedConsent, setSelectedConsent] = useState<InformedConsent | null>(null);
  
  const [closures, setClosures] = useState<ConsentClosure[]>([]);
  const [selectedClosure, setSelectedClosure] = useState<ConsentClosure | null>(null);
  
  const [explorations, setExplorations] = useState<PhysicalExploration[]>([]);
  const [selectedExploration, setSelectedExploration] = useState<PhysicalExploration | null>(null);

  const [selectedPatientForConsent, setSelectedPatientForConsent] = useState<Patient | null>(null);
  const [selectedPatientForClosure, setSelectedPatientForClosure] = useState<Patient | null>(null);
  const [selectedPatientForExploration, setSelectedPatientForExploration] = useState<Patient | null>(null);

  useEffect(() => {
    const savedConsents = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (savedConsents) setConsents(JSON.parse(savedConsents));
    
    const savedClosures = localStorage.getItem(CLOSURE_STORAGE_KEY);
    if (savedClosures) setClosures(JSON.parse(savedClosures));
    
    const savedExplorations = localStorage.getItem(EXPLORATION_STORAGE_KEY);
    if (savedExplorations) setExplorations(JSON.parse(savedExplorations));
  }, [activeSection]);

  const handleSaveConsent = (consent: InformedConsent) => {
    const updatedConsents = [
      consent,
      ...consents.filter(c => c.id !== consent.id)
    ];
    setConsents(updatedConsents);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updatedConsents));
    setSelectedConsent(null);
    setSelectedPatientForConsent(null);
  };

  const handleSaveClosure = (closure: ConsentClosure) => {
    const updated = [closure, ...closures.filter(c => c.id !== closure.id)];
    setClosures(updated);
    localStorage.setItem(CLOSURE_STORAGE_KEY, JSON.stringify(updated));
    setSelectedPatientForClosure(null);
    setSelectedClosure(null);
  };

  const handleSaveExploration = (exploration: PhysicalExploration) => {
    const updated = [exploration, ...explorations.filter(e => e.id !== exploration.id)];
    setExplorations(updated);
    localStorage.setItem(EXPLORATION_STORAGE_KEY, JSON.stringify(updated));
    setSelectedPatientForExploration(null);
    setSelectedExploration(null);
  };

  const deleteConsent = (id: string) => {
    if (confirm('¿Eliminar este consentimiento?')) {
      const updated = consents.filter(c => c.id !== id);
      setConsents(updated);
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const renderConsentList = () => (
    <div className="space-y-8 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consents.length === 0 ? (
          <div className="col-span-full h-96 flex flex-col items-center justify-center text-slate-300 gap-6">
             <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-slate-100">
                <ShieldCheck className="w-10 h-10 opacity-30" />
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest">Sin Documentos</p>
                <p className="text-xs font-bold text-slate-400 mt-2 italic">Crea un consentimiento desde el expediente del paciente.</p>
             </div>
          </div>
        ) : consents.filter(c => c.patientData.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map((consent, i) => (
          <motion.div
            key={consent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-purple/30 transition-all group relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => deleteConsent(consent.id)} className="p-3 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                   <Trash2 className="w-4 h-4" />
                </button>
             </div>

             <div className="flex items-start gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                   <FileCheck className="w-6 h-6 text-emerald-500 group-hover:text-white" />
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{consent.date}</p>
                   <h4 className="text-lg font-black text-slate-900 leading-tight italic">{consent.patientData.fullName}</h4>
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">ID Documento:</span>
                   <span className="text-[11px] font-black text-slate-800">{consent.id}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Estado:</span>
                   <span className="text-[9px] font-black px-2 py-1 bg-emerald-500 text-white rounded-lg">FIRMADO</span>
                </div>
             </div>

             <button 
               onClick={() => setSelectedConsent(consent)}
               className="w-full mt-8 py-4 bg-slate-50 text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-purple hover:text-white transition-all border border-slate-100"
             >
                Ver / Exportar PDF
             </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedConsent && (
          <div className="fixed inset-0 z-[300]">
             <ConsentForm 
               patient={patients.find(p => p.id === selectedConsent.patientId) || INITIAL_PATIENTS[0]} 
               onClose={() => setSelectedConsent(null)} 
               onSave={handleSaveConsent}
               initialData={selectedConsent}
             />
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderClosureList = () => (
    <div className="space-y-8 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {closures.length === 0 ? (
          <div className="col-span-full h-96 flex flex-col items-center justify-center text-slate-300 gap-6">
             <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-slate-100">
                <CheckCircle2 className="w-10 h-10 opacity-30" />
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest">Sin Cierres</p>
                <p className="text-xs font-bold text-slate-400 mt-2 italic">Finaliza tratamientos desde la tarjeta del paciente.</p>
             </div>
          </div>
        ) : closures.filter(c => c.patientName.toLowerCase().includes(searchQuery.toLowerCase())).map((closure, i) => (
          <motion.div
            key={closure.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative"
          >
             <div className="flex items-start gap-4 mb-8">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
                   <CheckCircle2 className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{closure.date}</p>
                   <h4 className="text-lg font-black text-slate-900 italic tracking-tighter">{closure.patientName}</h4>
                </div>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Tratamiento</p>
                <p className="text-xs font-bold text-slate-700 leading-relaxed truncate">{closure.treatmentCompleted}</p>
             </div>
             <button 
               onClick={() => setSelectedClosure(closure)}
               className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-purple transition-all"
             >
                Ver Cierre / PDF
             </button>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedClosure && (
          <div className="fixed inset-0 z-[300]">
            <ConsentClosureForm 
              patient={patients.find(p => p.id === selectedClosure.patientId) || INITIAL_PATIENTS[0]} 
              onClose={() => setSelectedClosure(null)} 
              onSave={handleSaveClosure}
              initialData={selectedClosure}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderExplorationList = () => (
    <div className="space-y-8 h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {explorations.length === 0 ? (
          <div className="col-span-full h-96 flex flex-col items-center justify-center text-slate-300 gap-6">
             <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-slate-100">
                <Activity className="w-10 h-10 opacity-30" />
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest">Sin Exploraciones</p>
                <p className="text-xs font-bold text-slate-400 mt-2 italic">Realiza exploraciones físicas desde la tarjeta del paciente.</p>
             </div>
          </div>
        ) : explorations.filter(e => {
            const p = patients.find(p => p.id === e.patientId);
            return p?.name.toLowerCase().includes(searchQuery.toLowerCase());
          }).map((exploration, i) => {
          const patient = patients.find(p => p.id === exploration.patientId);
          return (
            <motion.div
              key={exploration.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative"
            >
               <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center border border-sky-100">
                     <Activity className="w-6 h-6 text-sky-500" />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{exploration.date}</p>
                     <h4 className="text-lg font-black text-slate-900 italic tracking-tighter">{patient?.name || 'Paciente ID: ' + exploration.patientId}</h4>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                     <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Diagnóstico</p>
                     <p className="text-[10px] font-bold text-slate-700 truncate">{exploration.diagnostics.biomechanical || 'Biomecánico'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                     <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Tipo de Pie</p>
                     <p className="text-[10px] font-bold text-slate-700">{exploration.footType}</p>
                  </div>
               </div>
               <button 
                 onClick={() => setSelectedExploration(exploration)}
                 className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all border border-slate-100"
               >
                  Ver Exploración
               </button>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {selectedExploration && (
          <div className="fixed inset-0 z-[300]">
            <PhysicalExplorationForm 
              patient={patients.find(p => p.id === selectedExploration.patientId) || INITIAL_PATIENTS[0]} 
              onClose={() => setSelectedExploration(null)} 
              onSave={handleSaveExploration}
              initialData={selectedExploration}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  if (activeRole === Role.PACIENTE) {
    return <PatientPortal activeSection={activeSection} />;
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
              <div key={p.id} className="group p-6 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-between hover:border-brand-purple/30 hover:shadow-2xl hover:shadow-brand-purple/10 transition-all duration-500 cursor-pointer" onClick={() => { setSelectedPatient(p); setClinicalRecordView('list'); }}>
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

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'photos': return { title: 'Seguimiento', highlight: 'Fotográfico.', sub: 'Galería de evolución por paciente' };
      case 'consent': return { title: 'Consentimientos', highlight: 'Informados.', sub: 'Gestión de firmas y documentos legales' };
      case 'closures': return { title: 'Cierres de', highlight: 'Consentimiento.', sub: 'Finalización de tratamientos podológicos' };
      case 'explorations': return { title: 'Exploraciones', highlight: 'Físicas.', sub: 'Evaluación técnica y clínica del pie' };
      case 'recipe': return { title: 'Recetarios', highlight: 'Digitales.', sub: 'Control de prescripciones y recomendaciones' };
      case 'cabin': return { title: 'Fichas de', highlight: 'Cabina.', sub: 'Parámetros técnicos y evolución estética' };
      case 'sessions': return { title: 'Control de', highlight: 'Sesiones.', sub: 'Paquetes y tratamientos activos' };
      default: return { title: 'Control de', highlight: 'Expedientes.', sub: 'Historial clínico y seguimiento activo' };
    }
  };

  const sectionInfo = getSectionTitle();

  const renderRegistration = () => {
    return (
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4">
          <div>
            <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-none italic">
              Registro de <span className="text-brand-purple">Pacientes.</span>
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-3">
              Datos de entrega y gestión
            </p>
          </div>
          <button onClick={handleAddPatient} className="px-6 py-3 bg-brand-purple text-white rounded-2xl font-black text-xs shadow-lg shadow-brand-purple/20 hover:scale-[1.02] transition-transform">
            Simular Nuevo Registro
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-display font-black text-slate-900 mb-6">Simulador de Entrega de Datos</h3>
            <p className="text-xs text-slate-500 mb-8">Activa este formulario para simular la función de entrega de resultados, recetas o expedientes al paciente por parte del área de recepción.</p>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Datos de entrega registrados exitosamente en el sistema.") }}>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Paciente Destinatario</label>
                <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-purple">
                  <option value="">Seleccionar Paciente</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo de Entrega</label>
                  <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-purple">
                    <option>Resultados Laboratorio</option>
                    <option>Receta Médica Impresa</option>
                    <option>Kit Post-Tratamiento</option>
                    <option>Resumen Clínico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rol Responsable</label>
                  <select className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-purple">
                    <option>Recepción / Frente</option>
                    <option>Asistente Médico</option>
                    <option>Personal de Enfermería</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Notas u Observaciones (Función Simulada)</label>
                <textarea rows={3} placeholder="Instrucciones dadas al paciente..." className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-purple transition-all"></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-purple transition-all shadow-xl">
                Activar Función de Entrega
              </button>
            </form>
          </section>

          <section className="bg-slate-50 border border-slate-100 rounded-[3rem] p-8">
            <h3 className="text-xl font-display font-black text-slate-900 mb-6">Registro Activo</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {patients.map((p, i) => (
                <div key={p.id} className="p-5 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between group">
                   <div>
                     <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.service}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs font-black text-brand-purple">{p.status || 'Activo'}</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.lastVisit}</p>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderClinicalView = () => (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4 mt-4">
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-none italic">
            {sectionInfo.title} <span className="text-brand-purple">{sectionInfo.highlight}</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-3">
            {sectionInfo.sub}
          </p>
        </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleAddPatient}
              className="hidden sm:flex bg-brand-purple text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-brand-purple-dark transition-all shadow-xl shadow-brand-purple/20"
            >
              <Users className="w-4 h-4" />
              Nuevo Paciente
            </button>
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand-purple" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o servicio..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-8 py-5 bg-white border-2 border-slate-200 rounded-[2rem] text-xs font-bold w-full md:w-96 shadow-sm outline-none focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/5 transition-all" 
              />
            </div>
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
               onClick={() => { setSelectedPatient(p); setClinicalRecordView('list'); }}
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
      ) : activeSection === 'consent' ? (
        renderConsentList()
      ) : activeSection === 'closures' ? (
        renderClosureList()
      ) : activeSection === 'explorations' ? (
        renderExplorationList()
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPatients.map((patient, i) => (
            <motion.div 
              key={patient.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => { setSelectedPatient(patient); setClinicalRecordView('list'); }}
              className="group p-5 sm:p-6 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col items-stretch cursor-pointer hover:border-brand-purple/40 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-center gap-4 sm:gap-8 mb-6">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl flex items-center justify-center font-black text-brand-purple text-lg sm:text-xl shadow-inner group-hover:bg-brand-purple group-hover:text-white transition-all transform group-hover:rotate-[-8deg] duration-500">
                    {patient.name[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-brand-purple transition-colors mb-1 truncate">{patient.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="text-[10px] font-black bg-slate-50 text-slate-500 p-1 px-2.5 rounded-lg uppercase tracking-widest">{patient.service}</span>
                    <span className="hidden sm:inline w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-[10px] text-brand-purple font-black uppercase tracking-widest whitespace-nowrap">{patient.lastVisit}</span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end shrink-0">
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1 italic">Estatus</p>
                  <div className="px-3 py-1 bg-slate-950 text-white rounded-xl text-[11px] font-black uppercase tracking-widest border border-white/5">{patient.status || 'Activo'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 xs:grid-cols-4 sm:flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPatientForConsent(patient);
                  }}
                  className="flex-1 sm:flex-none p-3 sm:p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl sm:rounded-2xl hover:bg-emerald-500 hover:text-white transition-all flex flex-col items-center gap-1 group/btn"
                >
                  <ShieldCheck className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tighter">Consentir</span>
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPatientForClosure(patient);
                  }}
                  className="flex-1 sm:flex-none p-3 sm:p-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl sm:rounded-2xl hover:bg-rose-500 hover:text-white transition-all flex flex-col items-center gap-1 group/btn"
                >
                  <CheckCircle2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tighter">Cierre</span>
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPatientForExploration(patient);
                  }}
                  className="flex-1 sm:flex-none p-3 sm:p-4 bg-sky-50 text-sky-600 border border-sky-100 rounded-xl sm:rounded-2xl hover:bg-sky-500 hover:text-white transition-all flex flex-col items-center gap-1 group/btn"
                >
                  <Activity className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tighter">Explorar</span>
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPatient(patient);
                    setClinicalRecordView('form');
                  }}
                  className="flex-1 sm:flex-none p-3 sm:p-4 bg-brand-purple text-white shadow-lg shadow-brand-purple/20 rounded-xl sm:rounded-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-1"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tighter">Historia</span>
                </button>
                
                <div className="hidden xs:flex flex-1 sm:flex-none p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl text-slate-300 group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-all duration-500 border border-slate-100 group-hover:border-brand-purple/20 items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
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

  const renderMedicalDashboard = () => (
    <div className="space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pacientes Mes', value: '412', icon: Users, trend: '+12%', color: 'from-brand-purple to-purple-600' },
          { label: 'Historiales Hoy', value: '8', icon: ClipboardList, trend: '90% Comp.', color: 'from-sky-500 to-sky-600' },
          { label: 'Citas de Hoy', value: '14', icon: CalendarCheck, trend: 'En curso', color: 'from- emerald-500 to-emerald-600' },
          { label: 'Recetas Mes', value: '286', icon: FileText, trend: '+5%', color: 'from-rose-500 to-rose-600' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="dashboard-card border-none shadow-sm p-8 bg-white/50 border border-white">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight italic">Evolución de <span className="text-brand-purple">Consultas</span></h3>
             <Activity className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-400 bg-slate-50/30 gap-4">
             <div className="flex items-end gap-1 h-32">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1 + 1 }}
                    className="w-4 bg-brand-purple/20 rounded-t-lg relative group"
                  >
                    <div className="absolute inset-0 bg-brand-purple rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.div>
                ))}
             </div>
             <p className="text-[9px] font-black uppercase tracking-widest text-center">Gráfica de rendimiento clínico semanal</p>
          </div>
        </section>

        <section className="dashboard-card border-none shadow-sm p-8 bg-white/50 border border-white">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight italic">En meta <span className="text-brand-purple">Podología</span></h3>
             <Stethoscope className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-6">
             <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                   <p className="text-sm font-black text-slate-900">Cirugías Realizadas</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Progreso Mensual</p>
                </div>
                <span className="text-2xl font-display font-black text-emerald-500 italic">85%</span>
             </div>
             <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ delay: 1.5, duration: 2 }}
                  className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                ></motion.div>
             </div>
             <p className="text-[9px] text-slate-400 font-bold italic tracking-wide">Faltan 3 procedimientos para alcanzar el objetivo del mes.</p>
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div className="pb-6">
      <AnimatePresence mode="wait">
        {selectedPatient ? (
          <motion.div
            key="clinical-record-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <ClinicalRecord 
              patient={selectedPatient} 
              onClose={() => setSelectedPatient(null)}
              activeRole={activeRole}
              activeSection={activeSection}
              initialView={clinicalRecordView}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`section-${activeSection}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* METRICS SECTIONS */}
            {activeSection === 'metrics' && activeRole === Role.ADMIN && renderAdminDashboard()}
            {activeSection === 'metrics' && activeRole === Role.MEDICO && renderMedicalDashboard()}
            
            {/* ADMIN SECTIONS */}
            {activeSection === 'inventory' && renderInventory()}
            {activeSection === 'staff' && renderStaff()}
            {activeSection === 'finance' && <div className="space-y-8 animate-in fade-in zoom-in duration-500 transition-all"><FinanceReport /></div>}

            {/* RECEPTION SECTIONS */}
            {activeSection === 'agenda' && renderAgenda()}
            {activeSection === 'registration' && renderRegistration()}
            {activeSection === 'box' && renderBoxView()}
            
            {/* CLINICAL SECTIONS (MEDIC & AESTHETIC) */}
            {(activeSection === 'records' || activeSection === 'consent' || activeSection === 'closures' || 
              activeSection === 'explorations' || activeSection === 'recipe' || 
              activeSection === 'cabin' || activeSection === 'photos' || activeSection === 'sessions') && renderClinicalView()}
            
            {/* PATIENT SECTIONS */}
            {(activeSection === 'appointments' || activeSection === 'results') && (
              <PatientPortal activeSection={activeSection} />
            )}
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

      <AnimatePresence>
        {selectedPatientForConsent && (
          <div className="fixed inset-0 z-[300]">
            <ConsentForm 
              patient={selectedPatientForConsent} 
              onClose={() => setSelectedPatientForConsent(null)} 
              onSave={handleSaveConsent}
            />
          </div>
        )}
        {selectedPatientForClosure && (
          <div className="fixed inset-0 z-[300]">
            <ConsentClosureForm 
              patient={selectedPatientForClosure} 
              onClose={() => setSelectedPatientForClosure(null)} 
              onSave={handleSaveClosure}
            />
          </div>
        )}
        {selectedPatientForExploration && (
          <div className="fixed inset-0 z-[300]">
            <PhysicalExplorationForm 
              patient={selectedPatientForExploration} 
              onClose={() => setSelectedPatientForExploration(null)} 
              onSave={handleSaveExploration}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


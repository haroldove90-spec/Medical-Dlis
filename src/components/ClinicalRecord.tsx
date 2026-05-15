/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  ChevronLeft, 
  Save, 
  History, 
  FileText,
  Activity,
  Plus,
  Trash2,
  FileDown,
  CheckCircle2,
  Edit2,
  Calendar,
  ClipboardList,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Heart,
  Stethoscope
} from 'lucide-react';
import { Patient, Role, ClinicalRecordData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ClinicalRecordProps {
  patient: Patient;
  onClose: () => void;
  activeRole: Role;
  activeSection?: string;
  initialView?: 'list' | 'form';
}

const STORAGE_KEY = 'medical_dlis_clinical_records';

const INITIAL_FORM_STATE: ClinicalRecordData = {
  id: '',
  patientId: '',
  date: new Date().toISOString().split('T')[0],
  recordNumber: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
  personalData: {
    fullName: '',
    age: 0,
    dob: '',
    address: '',
    sex: '',
    phone: '',
    occupation: '',
    maritalStatus: '',
    education: '',
    email: '',
  },
  reasonForConsultation: {
    reason: '',
    firstSymptomDate: '',
    location: '',
    modifyingCircumstance: '',
    painType: '',
    intensity: 5,
  },
  familyHistory: {
    diabetes: false,
    hypertension: false,
    hypotension: false,
    rheumatoidArthritis: false,
    heartDisease: false,
    osteoarticular: false,
    circulatory: false,
    dermatological: false,
    allergies: false,
    notes: '',
  },
  pathologicalHistory: {
    cardiovascular: false,
    pulmonary: false,
    renal: false,
    gastrointestinal: false,
    hematological: false,
    endocrine: false,
    mental: false,
    dermatological: false,
    neurological: false,
    metabolic: false,
    heartDisease: false,
    seizures: false,
    pacemaker: false,
    neuropathy: false,
    diabetes: false,
    cancer: false,
    hypertension: false,
    hypotension: false,
    hyperthyroidism: false,
    notes: '',
  },
  nonPathologicalHistory: {
    smoking: false,
    alcohol: false,
    drugs: false,
    flatFoot: false,
    cavusFoot: false,
    stress: false,
    polydisplasia: false,
    pregnancy: false,
    polyphagia: false,
    polyuria: false,
    tattoos: false,
    lactation: false,
    prosthesis: false,
    pacemaker: false,
    sport: false,
    sedentary: false,
    traumas: false,
    medications: false,
    allergies: false,
    gout: false,
    notes: '',
  },
  medications: []
};

export default function ClinicalRecord({ patient, onClose, activeRole, initialView = 'list' }: ClinicalRecordProps) {
  const [view, setView] = useState<'list' | 'form'>(initialView);
  const [records, setRecords] = useState<ClinicalRecordData[]>([]);
  const [formData, setFormData] = useState<ClinicalRecordData>({
    ...INITIAL_FORM_STATE,
    patientId: patient.id,
    personalData: {
      ...INITIAL_FORM_STATE.personalData,
      fullName: patient.name,
      phone: patient.phone || '',
      email: patient.email || '',
      age: patient.age || 0,
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const allRecords = JSON.parse(saved);
      setRecords(allRecords.filter((r: ClinicalRecordData) => r.patientId === patient.id));
    }
  }, [patient.id]);

  const saveToStorage = (newRecords: ClinicalRecordData[]) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const allRecords = saved ? JSON.parse(saved) : [];
    const otherPatientsRecords = allRecords.filter((r: ClinicalRecordData) => r.patientId !== patient.id);
    const finalRecords = [...otherPatientsRecords, ...newRecords];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalRecords));
    setRecords(newRecords);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      let updatedRecords;
      if (formData.id) {
        updatedRecords = records.map(r => r.id === formData.id ? formData : r);
      } else {
        const newRecord = { ...formData, id: crypto.randomUUID() };
        updatedRecords = [newRecord, ...records];
      }
      saveToStorage(updatedRecords);
      setIsSaving(false);
      setView('list');
    }, 800);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este historial clínico definitivamente?')) {
      const updated = records.filter(r => r.id !== id);
      saveToStorage(updated);
    }
  };

  const handleEdit = (record: ClinicalRecordData) => {
    setFormData(record);
    setView('form');
  };

  const handleNew = () => {
    setFormData({
      ...INITIAL_FORM_STATE,
      patientId: patient.id,
      recordNumber: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      personalData: {
        ...INITIAL_FORM_STATE.personalData,
        fullName: patient.name,
        phone: patient.phone || '',
        email: patient.email || '',
        age: patient.age || 0,
      }
    });
    setView('form');
  };

  const generatePDF = (record: ClinicalRecordData) => {
    const doc = new jsPDF();
    const logoUrl = 'https://cossma.com.mx/medical.png';
    
    // Header
    doc.addImage(logoUrl, 'PNG', 10, 10, 35, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(51, 65, 85);
    doc.text("Medical D'Lis", 50, 22);
    doc.setFontSize(14);
    doc.setTextColor(124, 58, 237);
    doc.text("HISTORIA CLÍNICA INTEGRAL", 50, 29);
    
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`EXPEDIENTE: ${record.recordNumber}`, 155, 20);
    doc.text(`FECHA REGISTRO: ${record.date}`, 155, 25);

    doc.setDrawColor(226, 232, 240);
    doc.line(10, 35, 200, 35);

    // Personal Data
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text("1. DATOS PERSONALES DEL PACIENTE", 10, 45);
    
    const pData = record.personalData;
    (doc as any).autoTable({
      startY: 48,
      body: [
        ["Nombre Completo", pData.fullName, "Edad", `${pData.age} años`],
        ["F. Nacimiento", pData.dob, "Sexo", pData.sex],
        ["Domicilio", pData.address, "Ocupación", pData.occupation],
        ["Teléfono", pData.phone, "Easc.", pData.education],
        ["Email", pData.email, "Edo. Civil", pData.maritalStatus]
      ],
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [124, 58, 237] }
    });

    // Reason
    doc.text("2. MOTIVO DE CONSULTA", 10, (doc as any).lastAutoTable.finalY + 10);
    const rData = record.reasonForConsultation;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Motivo: ${rData.reason}`, 15, (doc as any).lastAutoTable.finalY + 17, { maxWidth: 180 });
    doc.text(`Sintomatología desde: ${rData.firstSymptomDate}`, 15, (doc as any).lastAutoTable.finalY + 27);
    doc.text(`Localización: ${rData.location}`, 80, (doc as any).lastAutoTable.finalY + 27);
    doc.text(`Intensidad de dolor: ${rData.intensity}/10`, 15, (doc as any).lastAutoTable.finalY + 32);

    // Histories Checklist Summary
    const renderChecklist = (title: string, data: any, y: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(title, 10, y);
      const active = Object.entries(data)
        .filter(([key, val]) => val === true)
        .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'));
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const content = active.length > 0 ? active.join(' • ') : 'Ninguno reportado';
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 15, y + 7);
      
      if (data.notes) {
        doc.setFont('helvetica', 'italic');
        doc.text(`Obs: ${data.notes}`, 15, y + 7 + (lines.length * 4), { maxWidth: 180 });
      }
      return y + 15 + (lines.length * 4) + (data.notes ? 10 : 0);
    };

    let nextY = (doc as any).lastAutoTable.finalY + 45;
    nextY = renderChecklist("3. ANTECEDENTES FAMILIARES", record.familyHistory, nextY);
    nextY = renderChecklist("4. ANTECEDENTES PATOLÓGICOS", record.pathologicalHistory, nextY);
    nextY = renderChecklist("5. ANTECEDENTES NO PATOLÓGICOS", record.nonPathologicalHistory, nextY);

    // Medications
    if (record.medications.length > 0) {
      if (nextY > 240) { doc.addPage(); nextY = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text("6. MEDICACIÓN ACTUAL", 10, nextY);
      (doc as any).autoTable({
        startY: nextY + 5,
        head: [['Medicamento', 'Dosificación / Frecuencia', 'Duración']],
        body: record.medications.map(m => [m.name, m.dosage, m.duration]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [124, 58, 237] }
      });
    }

    // Signatures
    const finalY = (doc as any).lastAutoTable ? Math.max(nextY + 30, (doc as any).lastAutoTable.finalY + 30) : nextY + 30;
    doc.line(30, finalY, 80, finalY);
    doc.line(130, finalY, 180, finalY);
    doc.setFontSize(8);
    doc.text("FIRMA DEL PROFESIONAL", 40, finalY + 5);
    doc.text("FIRMA DEL PACIENTE", 140, finalY + 5);

    doc.save(`HC_${record.recordNumber}_${record.personalData.fullName.replace(/\s+/g, '_')}.pdf`);
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col h-full overflow-hidden"
    >
      {/* Header Bar */}
      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/80 backdrop-blur-md shrink-0 z-30 gap-4">
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          <button 
            onClick={onClose}
            className="p-2 md:p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-brand-purple transition-all border border-transparent hover:border-slate-100 shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-display font-black text-slate-900 tracking-tight leading-none italic truncate">
              {view === 'list' ? 'Expediente Clínico' : formData.id ? 'Editando Historia' : 'Nuevo Registro Clínico'}
            </h2>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-1.5 flex items-center gap-2 truncate">
               <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0"></span>
               {patient.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto shrink-0">
          {view === 'list' ? (
            <button 
              onClick={handleNew}
              className="flex-1 sm:flex-none bg-brand-purple text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-purple-dark transition-all shadow-xl shadow-brand-purple/20"
            >
              <Plus className="w-4 h-4" />
              Nuevo
            </button>
          ) : (
            <>
              <button 
                onClick={() => setView('list')}
                className="flex-1 sm:flex-none text-slate-500 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all text-center"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 sm:flex-none ${isSaving ? 'bg-emerald-500' : 'bg-brand-purple hover:bg-brand-purple-dark'} text-white px-4 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-purple/20`}
              >
                {isSaving ? <CheckCircle2 className="w-4 h-4 animate-bounce" /> : <Save className="w-4 h-4" />}
                <span className="hidden sm:inline">{isSaving ? 'Guardando...' : 'Finalizar'}</span>
                <span className="sm:hidden">{isSaving ? '...' : 'Listo'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar"
            >
              {records.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-6">
                  <div className="w-20 md:w-24 h-20 md:h-24 bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-200">
                    <ClipboardList className="w-8 md:w-10 h-8 md:h-10 opacity-30" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.25em]">Historial Vacío</p>
                    <p className="text-[10px] md:text-xs font-medium text-slate-400 mt-2 italic">Aún no hay registros clínicos para este paciente.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                  {records.map((record) => (
                    <motion.div 
                      layout
                      key={record.id}
                      className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between h-[250px] md:h-[280px]"
                    >
                      <div className="absolute top-0 right-0 p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="flex gap-1.5 md:gap-2">
                           <button onClick={() => generatePDF(record)} className="p-2 md:p-2.5 bg-brand-purple/5 text-brand-purple rounded-xl hover:bg-brand-purple hover:text-white transition-all shadow-sm"><FileDown className="w-4 h-4" /></button>
                           <button onClick={() => handleEdit(record)} className="p-2 md:p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => handleDelete(record.id)} className="p-2 md:p-2.5 bg-rose-50 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                           <div className="w-10 md:w-12 h-10 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-brand-purple/10 group-hover:border-brand-purple/20 transition-all">
                              <Calendar className="w-4 md:w-5 h-4 md:h-5 text-slate-400 group-hover:text-brand-purple" />
                           </div>
                           <div className="min-w-0">
                              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{record.date}</p>
                              <h4 className="text-lg md:text-xl font-display font-black text-slate-900 tracking-tight italic truncate">{record.recordNumber}</h4>
                           </div>
                        </div>
                        
                        <div className="space-y-2 md:space-y-3">
                           <div className="flex justify-between items-center text-[10px] md:text-[11px] font-bold">
                              <span className="text-slate-400 uppercase tracking-tighter">Motivo:</span>
                              <span className="text-slate-700 truncate max-w-[120px] md:max-w-[140px] italic">"{record.reasonForConsultation.reason}"</span>
                           </div>
                           <div className="flex justify-between items-center text-[10px] md:text-[11px] font-bold">
                              <span className="text-slate-400 uppercase tracking-tighter">Dolor:</span>
                              <span className="text-rose-500">{record.reasonForConsultation.intensity}/10</span>
                           </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-50 flex items-center justify-between">
                         <div className="flex -space-x-1.5 md:-space-x-2">
                            {record.familyHistory.diabetes && <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-brand-purple border-2 border-white flex items-center justify-center text-[7px] md:text-[8px] text-white font-bold" title="Diabetes Familiar">D</div>}
                            {record.pathologicalHistory.cancer && <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[7px] md:text-[8px] text-white font-bold" title="Cáncer">C</div>}
                         </div>
                         <button onClick={() => handleEdit(record)} className="text-[9px] md:text-[10px] font-black text-brand-purple uppercase tracking-[0.2em] underline decoration-brand-purple/20">Ver Detalle</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
               key="form"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="flex-1 flex flex-col overflow-hidden bg-slate-50/50"
             >
               <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-12">
                 <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-32">
                   {/* Section: Control */}
                   <section className="space-y-6 md:space-y-8 pb-8 md:pb-12 border-b border-slate-100">
                     <div className="flex items-center gap-3 md:gap-4 text-brand-purple">
                        <ClipboardList className="w-6 md:w-8 h-6 md:h-8" />
                        <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 tracking-tight italic">1. Control de Registro</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                       <div className="space-y-2">
                         <label className="label-hc">Fecha de Registro</label>
                         <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="form-input-hc" />
                       </div>
                       <div className="space-y-2">
                         <label className="label-hc">Nº Expediente</label>
                         <input type="text" value={formData.recordNumber} onChange={e => setFormData({...formData, recordNumber: e.target.value})} className="form-input-hc" />
                       </div>
                     </div>
                   </section>

                   {/* Section: Personal */}
                   <section className="space-y-6 md:space-y-8 pb-8 md:pb-12 border-b border-slate-100">
                     <div className="flex items-center gap-3 md:gap-4 text-brand-purple">
                        <User className="w-6 md:w-8 h-6 md:h-8" />
                        <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 tracking-tight italic">2. Datos Personales</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                       <div className="md:col-span-2 space-y-2">
                         <label className="label-hc">Nombre del Paciente</label>
                         <input type="text" value={formData.personalData.fullName} onChange={e => setFormData({...formData, personalData: {...formData.personalData, fullName: e.target.value}})} className="form-input-hc" />
                       </div>
                       <div className="space-y-2">
                         <label className="label-hc">Edad</label>
                         <input type="number" value={formData.personalData.age} onChange={e => setFormData({...formData, personalData: {...formData.personalData, age: parseInt(e.target.value)}})} className="form-input-hc" />
                       </div>
                       <div className="space-y-2">
                         <label className="label-hc">Sexo</label>
                         <select value={formData.personalData.sex} onChange={e => setFormData({...formData, personalData: {...formData.personalData, sex: e.target.value}})} className="form-input-hc">
                           <option value="">Seleccionar</option>
                           <option value="Femenino">Femenino</option>
                           <option value="Masculino">Masculino</option>
                         </select>
                       </div>
                       <div className="md:col-span-2 space-y-2">
                         <label className="label-hc">Teléfono de Contacto</label>
                         <input type="text" value={formData.personalData.phone} onChange={e => setFormData({...formData, personalData: {...formData.personalData, phone: e.target.value}})} className="form-input-hc" />
                       </div>
                     </div>
                   </section>

                   {/* Section: Consultation */}
                   <section className="space-y-6 md:space-y-8 pb-8 md:pb-12 border-b border-slate-100">
                     <div className="flex items-center gap-3 md:gap-4 text-brand-purple">
                        <Activity className="w-6 md:w-8 h-6 md:h-8" />
                        <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 tracking-tight italic">3. Motivo de Consulta</h3>
                     </div>
                     <div className="space-y-6">
                       <div className="space-y-2">
                         <label className="label-hc">Razón de la Visita</label>
                         <textarea rows={4} value={formData.reasonForConsultation.reason} onChange={e => setFormData({...formData, reasonForConsultation: {...formData.reasonForConsultation, reason: e.target.value}})} className="form-input-hc resize-none" />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                         <div className="space-y-2">
                           <label className="label-hc">Dolor (EVA 1-10)</label>
                           <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                             <input type="range" min="1" max="10" value={formData.reasonForConsultation.intensity} onChange={e => setFormData({...formData, reasonForConsultation: {...formData.reasonForConsultation, intensity: parseInt(e.target.value)}})} className="flex-1 accent-brand-purple" />
                             <span className="text-xl md:text-2xl font-black text-brand-purple italic">{formData.reasonForConsultation.intensity}</span>
                           </div>
                         </div>
                         <div className="space-y-2">
                           <label className="label-hc">Tipo de Dolor</label>
                           <input type="text" value={formData.reasonForConsultation.painType} onChange={e => setFormData({...formData, reasonForConsultation: {...formData.reasonForConsultation, painType: e.target.value}})} className="form-input-hc" placeholder="Ej: Punzante, sordo..." />
                         </div>
                       </div>
                     </div>
                   </section>

                   {/* Section: Family History */}
                   <section className="space-y-6 md:space-y-8 pb-8 md:pb-12 border-b border-slate-100">
                     <div className="flex items-center gap-3 md:gap-4 text-brand-purple">
                        <History className="w-6 md:w-8 h-6 md:h-8" />
                        <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 tracking-tight italic">4. Antecedentes Heredo-Familiares</h3>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                       {Object.keys(formData.familyHistory).filter(k => k !== 'notes').map(key => (
                         <label key={key} className="flex items-center gap-3 p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl cursor-pointer hover:bg-brand-purple/5 transition-all group">
                           <input type="checkbox" checked={formData.familyHistory[key as keyof typeof formData.familyHistory] as boolean} onChange={() => setFormData({...formData, familyHistory: {...formData.familyHistory, [key]: !formData.familyHistory[key as keyof typeof formData.familyHistory]}})} className="w-5 h-5 rounded-lg accent-brand-purple shrink-0" />
                           <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                         </label>
                       ))}
                     </div>
                     <div className="space-y-2">
                       <label className="label-hc">Notas Adicionales</label>
                       <textarea rows={3} value={formData.familyHistory.notes} onChange={e => setFormData({...formData, familyHistory: {...formData.familyHistory, notes: e.target.value}})} className="form-input-hc resize-none" />
                     </div>
                   </section>

                   {/* Section: Pathological */}
                   <section className="space-y-6 md:space-y-8 pb-8 md:pb-12 border-b border-slate-100">
                     <div className="flex items-center gap-3 md:gap-4 text-brand-purple">
                        <Stethoscope className="w-6 md:w-8 h-6 md:h-8" />
                        <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 tracking-tight italic">5. Antecedentes Personales Patológicos</h3>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {Object.keys(formData.pathologicalHistory).filter(k => k !== 'notes').map(key => (
                          <label key={key} className="flex items-center gap-3 p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl cursor-pointer hover:bg-rose-50 transition-all group">
                            <input type="checkbox" checked={formData.pathologicalHistory[key as keyof typeof formData.pathologicalHistory] as boolean} onChange={() => setFormData({...formData, pathologicalHistory: {...formData.pathologicalHistory, [key]: !formData.pathologicalHistory[key as keyof typeof formData.pathologicalHistory]}})} className="w-5 h-5 rounded-lg accent-rose-500 shrink-0" />
                            <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">{key === 'hyperthyroidism' ? 'Hipertiroidismo' : key.replace(/([A-Z])/g, ' $1')}</span>
                          </label>
                        ))}
                     </div>
                     <div className="space-y-2">
                       <label className="label-hc">Descripción de Patologías</label>
                       <textarea rows={3} value={formData.pathologicalHistory.notes} onChange={e => setFormData({...formData, pathologicalHistory: {...formData.pathologicalHistory, notes: e.target.value}})} className="form-input-hc resize-none" />
                     </div>
                   </section>

                   {/* Section: Non-Pathological */}
                   <section className="space-y-6 md:space-y-8 pb-8 md:pb-12 border-b border-slate-100">
                     <div className="flex items-center gap-3 md:gap-4 text-brand-purple">
                        <Heart className="w-6 md:w-8 h-6 md:h-8" />
                        <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 tracking-tight italic">6. Antecedentes Personales No Patológicos</h3>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {Object.keys(formData.nonPathologicalHistory).filter(k => k !== 'notes').map(key => (
                          <label key={key} className="flex items-center gap-3 p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl cursor-pointer hover:bg-amber-50 transition-all group">
                            <input type="checkbox" checked={formData.nonPathologicalHistory[key as keyof typeof formData.nonPathologicalHistory] as boolean} onChange={() => setFormData({...formData, nonPathologicalHistory: {...formData.nonPathologicalHistory, [key]: !formData.nonPathologicalHistory[key as keyof typeof formData.nonPathologicalHistory]}})} className="w-5 h-5 rounded-lg accent-amber-500 shrink-0" />
                            <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">{key.replace(/([A-Z])/g, ' $1')}</span>
                          </label>
                        ))}
                     </div>
                   </section>

                   {/* Section: Medications */}
                   <section className="space-y-6 md:space-y-8">
                     <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 md:gap-4 text-brand-purple overflow-hidden">
                          <Plus className="w-6 md:w-8 h-6 md:h-8 shrink-0" />
                          <h3 className="text-xl md:text-2xl font-display font-black text-slate-900 tracking-tight italic truncate">7. Medicación Actual</h3>
                        </div>
                        <button 
                          onClick={() => setFormData({...formData, medications: [...formData.medications, { name: '', dosage: '', duration: '' }]})}
                          className="px-4 md:px-6 py-2.5 md:py-3 bg-brand-purple text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shrink-0"
                        >
                          Añadir
                        </button>
                     </div>
                     <div className="space-y-4">
                        {formData.medications.map((med, idx) => (
                          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 p-5 md:p-6 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 relative">
                            <div className="space-y-1">
                               <label className="label-hc text-[8px] ml-2">Nombre</label>
                               <input type="text" placeholder="Medicamento" value={med.name} onChange={e => {
                                 const newMeds = [...formData.medications];
                                 newMeds[idx].name = e.target.value;
                                 setFormData({...formData, medications: newMeds});
                               }} className="form-input-hc" />
                            </div>
                            <div className="space-y-1">
                               <label className="label-hc text-[8px] ml-2">Dosis</label>
                               <input type="text" placeholder="Dosis" value={med.dosage} onChange={e => {
                                 const newMeds = [...formData.medications];
                                 newMeds[idx].dosage = e.target.value;
                                 setFormData({...formData, medications: newMeds});
                               }} className="form-input-hc" />
                            </div>
                            <div className="space-y-1">
                               <label className="label-hc text-[8px] ml-2">Duración</label>
                               <div className="flex gap-2">
                                 <input type="text" placeholder="Tiempo" value={med.duration} onChange={e => {
                                   const newMeds = [...formData.medications];
                                   newMeds[idx].duration = e.target.value;
                                   setFormData({...formData, medications: newMeds});
                                 }} className="form-input-hc flex-1" />
                                 <button onClick={() => setFormData({...formData, medications: formData.medications.filter((_, i) => i !== idx)})} className="p-3 md:p-4 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                   <Trash2 className="w-5 h-5" />
                                 </button>
                               </div>
                            </div>
                          </div>
                        ))}
                     </div>
                   </section>

                   {/* Save Button at the end */}
                   <div className="flex justify-center pt-6 md:pt-10">
                     <button 
                       onClick={handleSave}
                       className="w-full max-w-md bg-brand-purple text-white py-5 md:py-6 rounded-2xl md:rounded-[2.5rem] text-sm md:text-base font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-purple/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                     >
                       <Save className="w-5 md:w-6 h-5 md:h-6" />
                       Guardar Registro
                     </button>
                   </div>
                 </div>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .form-input-hc {
          width: 100%;
          padding: 1.15rem 1.25rem;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 1.25rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
          transition: all 0.3s;
          outline: none;
        }
        .form-input-hc:focus {
          background: white;
          border-color: #7c3aed40;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.05), inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .label-hc {
          display: block;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #94a3b8;
          margin-bottom: 0.75rem;
          margin-left: 0.5rem;
          font-style: italic;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .glow-purple {
          box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.3), 0 8px 10px -6px rgba(124, 58, 237, 0.3);
        }
      `}</style>
    </motion.div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

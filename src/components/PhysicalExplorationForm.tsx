/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Save, Activity, Heart, Brain, Bone, Info, CheckCircle2, User, ClipboardCheck, Ruler } from 'lucide-react';
import { PhysicalExploration, Patient } from '../types';
import SignatureCanvas from 'react-signature-canvas';

interface PhysicalExplorationFormProps {
  patient: Patient;
  onClose: () => void;
  onSave: (exploration: PhysicalExploration) => void;
  initialData?: PhysicalExploration;
}

const VISUAL_BLOQUE_A = [
  'Palidez', 'Eritema', 'Hematoma', 'Dermatitis', 'Poliactilia', 'Sindictilia', 
  'Hiperqueratosis', 'Heloma', 'Hallux Valgus', 'Juanete Sastre', 'Hipocráticas', 
  'Micosis Plantar', 'Micosis Interdigital', 'Onicogrifosis', 'Onicolisis', 
  'Onicomadesis', 'Onicocriptosis', 'Onicomicosis'
];

const VISUAL_BLOQUE_B = [
  'Heloma', 'Leuconiquia', 'Melanoniquia', 'Oniquia', 'Coiloniquia', 'Anoniquia', 
  'Platoniquia', 'Braquioniquia', 'Hapaloniquia', 'Microniquia', 'Macroniquia', 
  'Traquioniquia', 'Línea de Beau', 'Úlcera', 'T. Konenen', 'Descamación', 'Tatuajes'
];

const MANUAL_ROWS = [
  { label: 'Estructura Ósea (Est. Ósea)', key: 'osteoarticular' },
  { label: 'Temperatura', key: 'temperature' },
  { label: 'Llenado Capilar', key: 'capillaryRefill' },
  { label: 'Pulso Tibial Posterior', key: 'tibialPulse' },
  { label: 'Sensibilidad al Monofilamento', key: 'monofilament' },
  { label: 'Sensibilidad al Diapasón', key: 'tuningFork' },
  { label: 'Martillo de Reflejos', key: 'reflexHammer' },
];

export default function PhysicalExplorationForm({ patient, onClose, onSave, initialData }: PhysicalExplorationFormProps) {
  const [formData, setFormData] = useState<PhysicalExploration>(initialData || {
    id: '',
    patientId: patient.id,
    date: new Date().toISOString().split('T')[0],
    visualExploration: {},
    otherVisualObservations: '',
    footType: 'Egipcio',
    stepType: 'Neutro',
    manualExploration: {
      osteoarticular: { der: 'Normal', izq: 'Normal' },
      temperature: { der: 'Normal', izq: 'Normal' },
      capillaryRefill: { der: 'Normal', izq: 'Normal' },
      tibialPulse: { der: 'Normal', izq: 'Normal' },
      monofilament: { der: 'Normal', izq: 'Normal' },
      tuningFork: { der: 'Normal', izq: 'Normal' },
      reflexHammer: { der: 'Normal', izq: 'Normal' },
    },
    diagnostics: {
      biomechanical: '',
      dermatological: '',
      neurological: '',
      vascular: '',
    },
    reference: false,
    referenceTo: '',
    therapeuticPlan: '',
    patientSignature: '',
    professionalName: 'DR. ESPECIALISTA',
  });

  const patientSigCanvas = useRef<SignatureCanvas>(null);
  const [isSaving, setIsSaving] = useState(false);

  const toggleVisual = (key: string, side: 'der' | 'izq') => {
    const current = formData.visualExploration[key] || { der: false, izq: false };
    setFormData({
      ...formData,
      visualExploration: {
        ...formData.visualExploration,
        [key]: { ...current, [side]: !current[side] }
      }
    });
  };

  const handleSave = () => {
    const pSig = patientSigCanvas.current && !patientSigCanvas.current.isEmpty() 
      ? patientSigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
      : formData.patientSignature;

    setIsSaving(true);
    const finalData = { 
      ...formData, 
      patientSignature: pSig,
      id: formData.id || `EXPL-${Math.floor(Math.random() * 10000)}` 
    };
    
    setTimeout(() => {
      onSave(finalData);
      setIsSaving(false);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col h-full overflow-hidden"
    >
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-brand-purple transition-all border border-transparent hover:border-slate-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-display font-black text-slate-900 tracking-tight italic">Exploración Física Podológica</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Evaluación integral del paciente</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-purple hover:bg-brand-purple-dark text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-brand-purple/20"
        >
          {isSaving ? <CheckCircle2 className="w-4 h-4 animate-bounce" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Guardando...' : 'Guardar Exploración'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        <div className="max-w-6xl mx-auto space-y-8 pb-32">
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">
            
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter">EXPEDIENTE DE <span className="text-brand-purple">{patient.name}</span></h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Evaluación Clínica Médica D'Lis</p>
               </div>
               <div className="text-right">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Fecha de Evaluación</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="p-3 border-2 border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-brand-purple" />
               </div>
            </div>

            {/* 1. Exploración Física Visual */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 text-brand-purple">
                  <Activity className="w-6 h-6" />
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">1. Exploración Física Visual</h4>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Bloque A */}
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-lg inline-block">Bloque A</p>
                     <div className="grid grid-cols-1 gap-1">
                        <div className="grid grid-cols-12 mb-2 px-2">
                           <div className="col-span-8" />
                           <div className="col-span-2 text-[8px] font-black text-slate-400 text-center uppercase">IZQ</div>
                           <div className="col-span-2 text-[8px] font-black text-slate-400 text-center uppercase">DER</div>
                        </div>
                        {VISUAL_BLOQUE_A.map(item => (
                           <div key={item} className="grid grid-cols-12 items-center hover:bg-slate-50 group rounded-lg p-1 transition-colors">
                              <span className="col-span-8 text-[11px] font-bold text-slate-700 group-hover:text-brand-purple transition-colors">{item}</span>
                              <div className="col-span-2 flex justify-center">
                                 <input 
                                   type="checkbox" 
                                   checked={formData.visualExploration[item]?.izq || false} 
                                   onChange={() => toggleVisual(item, 'izq')}
                                   className="w-4 h-4 accent-brand-purple"
                                 />
                              </div>
                              <div className="col-span-2 flex justify-center">
                                 <input 
                                   type="checkbox" 
                                   checked={formData.visualExploration[item]?.der || false} 
                                   onChange={() => toggleVisual(item, 'der')}
                                   className="w-4 h-4 accent-brand-purple"
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Bloque B */}
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-lg inline-block">Bloque B</p>
                     <div className="grid grid-cols-1 gap-1">
                        <div className="grid grid-cols-12 mb-2 px-2">
                           <div className="col-span-8" />
                           <div className="col-span-2 text-[8px] font-black text-slate-400 text-center uppercase">IZQ</div>
                           <div className="col-span-2 text-[8px] font-black text-slate-400 text-center uppercase">DER</div>
                        </div>
                        {VISUAL_BLOQUE_B.map(item => (
                           <div key={item} className="grid grid-cols-12 items-center hover:bg-slate-50 group rounded-lg p-1 transition-colors">
                              <span className="col-span-8 text-[11px] font-bold text-slate-700 group-hover:text-brand-purple transition-colors">{item}</span>
                              <div className="col-span-2 flex justify-center">
                                 <input 
                                   type="checkbox" 
                                   checked={formData.visualExploration[item]?.izq || false} 
                                   onChange={() => toggleVisual(item, 'izq')}
                                   className="w-4 h-4 accent-brand-purple"
                                 />
                              </div>
                              <div className="col-span-2 flex justify-center">
                                 <input 
                                   type="checkbox" 
                                   checked={formData.visualExploration[item]?.der || false} 
                                   onChange={() => toggleVisual(item, 'der')}
                                   className="w-4 h-4 accent-brand-purple"
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">OTRAS OBSERVACIONES VISUALES</label>
                  <textarea 
                    value={formData.otherVisualObservations}
                    onChange={e => setFormData({...formData, otherVisualObservations: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:border-brand-purple outline-none min-h-[80px]"
                  />
               </div>
            </div>

            {/* 2. Identificación Morfológica */}
            <div className="space-y-6 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-3 text-brand-purple">
                  <Ruler className="w-6 h-6" />
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">2. Identificación Morfológica</h4>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Pie</label>
                     <div className="flex flex-wrap gap-2">
                        {['Egipcio', 'Romano', 'Griego', 'Germánico', 'Celta'].map(type => (
                           <button
                             key={type}
                             onClick={() => setFormData({...formData, footType: type as any})}
                             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.footType === type ? 'bg-brand-purple text-white border-brand-purple shadow-lg shadow-brand-purple/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-brand-purple/30'}`}
                           >
                              {type}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Pisada</label>
                     <div className="flex flex-wrap gap-2">
                        {['Neutro', 'Pronación', 'Supinación'].map(type => (
                           <button
                             key={type}
                             onClick={() => setFormData({...formData, stepType: type as any})}
                             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.stepType === type ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-indigo-500/30'}`}
                           >
                              {type}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* 3. Exploración Física Manual e Instrumentada */}
            <div className="space-y-6 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-3 text-brand-purple">
                  <Info className="w-6 h-6" />
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">3. Exploración Física Manual e Instrumentada</h4>
               </div>
               <div className="overflow-hidden border border-slate-100 rounded-3xl">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-slate-50">
                        <tr>
                           <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hallazgo Clínico</th>
                           <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-x border-slate-200">Pie Derecho</th>
                           <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Pie Izquierdo</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {MANUAL_ROWS.map(row => (
                           <tr key={row.key} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 text-xs font-black text-slate-700 italic">{row.label}</td>
                              <td className="p-4 border-x border-slate-100">
                                 <div className="flex justify-center gap-2">
                                    {['Normal', 'Anormal'].map(val => (
                                       <button
                                         key={val}
                                         onClick={() => setFormData({
                                           ...formData, 
                                           manualExploration: {
                                             ...formData.manualExploration, 
                                             [row.key]: { ...(formData.manualExploration as any)[row.key], der: val }
                                           }
                                         })}
                                         className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter border transition-all ${ (formData.manualExploration as any)[row.key].der === val ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
                                       >
                                          {val}
                                       </button>
                                    ))}
                                 </div>
                              </td>
                              <td className="p-4">
                                 <div className="flex justify-center gap-2">
                                    {['Normal', 'Anormal'].map(val => (
                                       <button
                                         key={val}
                                         onClick={() => setFormData({
                                           ...formData, 
                                           manualExploration: {
                                             ...formData.manualExploration, 
                                             [row.key]: { ...(formData.manualExploration as any)[row.key], izq: val }
                                           }
                                         })}
                                         className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter border transition-all ${ (formData.manualExploration as any)[row.key].izq === val ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
                                       >
                                          {val}
                                       </button>
                                    ))}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* 4. Diagnósticos Específicos */}
            <div className="space-y-6 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-3 text-brand-purple">
                  <ClipboardCheck className="w-6 h-6" />
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">4. Diagnósticos Específicos (Dx)</h4>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Dx. Biomecánico', key: 'biomechanical' },
                    { label: 'Dx. Dermatológico', key: 'dermatological' },
                    { label: 'Dx. Neurológico', key: 'neurological' },
                    { label: 'Dx. Vascular', key: 'vascular' },
                  ].map(field => (
                     <div key={field.key} className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                        <textarea 
                          value={(formData.diagnostics as any)[field.key]}
                          onChange={e => setFormData({...formData, diagnostics: {...formData.diagnostics, [field.key]: e.target.value}})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:border-brand-purple outline-none min-h-[60px]"
                        />
                     </div>
                  ))}
               </div>
            </div>

            {/* 5. Terapéutica y Referencia */}
            <div className="space-y-6 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-3 text-brand-purple">
                  <Heart className="w-6 h-6" />
                  <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">5. Terapéutica y Referencia</h4>
               </div>
               <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                  <div className="flex items-center gap-10">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.reference ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                           <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.reference ? 'translate-x-6' : 'translate-x-0'}`} />
                           <input type="checkbox" className="hidden" checked={formData.reference} onChange={e => setFormData({...formData, reference: e.target.checked})} />
                        </div>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">¿Requiere Referencia?</span>
                     </label>
                     {formData.reference && (
                        <div className="flex-1 space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">A QUIÉN SE RECOMIENDA (MÉDICO / ESPECIALISTA)</label>
                           <input 
                             type="text" 
                             value={formData.referenceTo}
                             onChange={e => setFormData({...formData, referenceTo: e.target.value})}
                             placeholder="Nombre del médico o institución..."
                             className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-brand-purple outline-none"
                           />
                        </div>
                     )}
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">PLAN TERAPÉUTICO (TRATAMIENTO A SEGUIR)</label>
                     <textarea 
                       value={formData.therapeuticPlan}
                       onChange={e => setFormData({...formData, therapeuticPlan: e.target.value})}
                       placeholder="Describa el plan de tratamiento detallado..."
                       className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:border-brand-purple outline-none min-h-[100px]"
                     />
                  </div>
               </div>
            </div>

            {/* 6. Validación Final */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-100">
               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-brand-purple">
                     <User className="w-5 h-5" />
                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Validación del Paciente</h4>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                     El paciente manifiesta su conformidad con los resultados de la exploración y el plan terapéutico propuesto.
                  </p>
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-4 relative h-40 flex items-center justify-center overflow-hidden group">
                     {formData.patientSignature ? (
                        <img src={formData.patientSignature} alt="Patient Sig" className="max-h-full" />
                     ) : (
                        <SignatureCanvas 
                          ref={patientSigCanvas}
                          penColor="#1e293b"
                          canvasProps={{ className: 'w-full h-full cursor-crosshair' }}
                        />
                     )}
                     {!formData.patientSignature && (
                        <button onClick={() => patientSigCanvas.current?.clear()} className="absolute bottom-2 right-2 text-[9px] font-black text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">Limpiar</button>
                     )}
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo del Paciente</label>
                     <input type="text" readOnly value={patient.name} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900" />
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-3 text-brand-purple">
                     <Brain className="w-5 h-5" />
                     <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Validación Profesional</h4>
                  </div>
                  <div className="p-6 bg-slate-900 rounded-3xl space-y-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/50 uppercase tracking-widest ml-1">Nombre del Profesional</label>
                        <input 
                          type="text" 
                          value={formData.professionalName}
                          onChange={e => setFormData({...formData, professionalName: e.target.value})}
                          className="w-full p-3 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white focus:border-brand-purple outline-none"
                        />
                     </div>
                     <div className="flex flex-col items-center justify-center border-t border-white/10 pt-6">
                        <div className="w-32 h-16 bg-white/5 rounded-xl flex items-center justify-center opacity-30 border border-dashed border-white/20 mb-3">
                           <span className="text-[8px] text-white">Sello Profesional</span>
                        </div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Especialista en Podología</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

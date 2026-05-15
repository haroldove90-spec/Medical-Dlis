/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Save, Trash2, FileDown, CheckCircle2, ClipboardCheck, Phone, Mail, User, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { InformedConsent, Patient } from '../types';
import SignatureCanvas from 'react-signature-canvas';
import { jsPDF } from 'jspdf';

interface ConsentFormProps {
  patient: Patient;
  onClose: () => void;
  onSave: (consent: InformedConsent) => void;
  initialData?: InformedConsent;
}

export default function ConsentForm({ patient, onClose, onSave, initialData }: ConsentFormProps) {
  const [formData, setFormData] = useState<InformedConsent>(initialData || {
    id: '',
    patientId: patient.id,
    date: new Date().toISOString().split('T')[0],
    patientData: {
      fullName: patient.name,
      phone: patient.phone || '',
      email: patient.email || '',
      age: patient.age || 0,
      sex: patient.gender || '',
      medicalHistory: '',
    },
    procedures: {
      nailCutting: true,
      callusRemoval: true,
      ingrownNail: false,
      antisepticCleaning: true,
      topicalApplication: true,
      complementaryProcedures: true,
    },
    alternative: 'none',
    signature: '',
  });

  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleClearSignature = () => {
    sigCanvas.current?.clear();
    setFormData({ ...formData, signature: '' });
  };

  const handleSave = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      const finalData = { ...formData, signature: signatureData, id: formData.id || `CONS-${Math.floor(Math.random() * 10000)}` };
      setIsSaving(true);
      setTimeout(() => {
        onSave(finalData);
        setIsSaving(false);
      }, 1000);
    } else if (formData.signature) {
      onSave(formData);
    } else {
      alert('Por favor, firme el documento para continuar.');
    }
  };

  const generatePDF = (consent: InformedConsent) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICAL D\'LIS', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Av. Glandorf 3706, Col San Felipe, CP 31203', 105, 28, { align: 'center' });
    doc.text('Teléfono: 6144891998', 105, 33, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CONSENTIMIENTO INFORMADO PARA TRATAMIENTO PODOLÓGICO', 105, 45, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Fecha: ${consent.date}`, 160, 55);
    
    // I. Patient Data
    doc.setFont('helvetica', 'bold');
    doc.text('I. DATOS DEL PACIENTE', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre completo: ${consent.patientData.fullName}`, 20, 72);
    doc.text(`Teléfono: ${consent.patientData.phone}`, 20, 77);
    doc.text(`Correo: ${consent.patientData.email}`, 20, 82);
    doc.text(`Edad: ${consent.patientData.age} años`, 20, 87);
    doc.text(`Sexo: ${consent.patientData.sex}`, 100, 87);
    doc.text(`Antecedentes: ${consent.patientData.medicalHistory}`, 20, 92);
    
    // II. Procedures
    doc.setFont('helvetica', 'bold');
    doc.text('II. DESCRIPCIÓN DEL PROCEDIMIENTO', 20, 105);
    doc.setFont('helvetica', 'normal');
    doc.text('Tratamiento: PEDICURE CLÍNICO (Quiropedia Terapéutica)', 20, 112);
    
    let yPos = 117;
    const procMap: {[key: string]: string} = {
      nailCutting: 'Corte y fresado terapéutico de uñas.',
      callusRemoval: 'Eliminación de hiperqueratosis, callosidades o helomas.',
      ingrownNail: 'Atención de uñas encarnadas (onicocriptosis).',
      antisepticCleaning: 'Limpieza antiséptica y cuidado integral del pie.',
      topicalApplication: 'Aplicación tópica de productos antifúngicos, hidratantes.',
      complementaryProcedures: 'Procedimientos complementarios de quiropedia.',
    };
    
    Object.entries(consent.procedures).forEach(([key, val]) => {
      if (val) {
        doc.text(`- ${procMap[key]}`, 25, yPos);
        yPos += 5;
      }
    });

    const biosecurityText = "El procedimiento se realiza bajo estrictas normas de bioseguridad, cumpliendo con las normas NOM-087-ECOL-SSA1-2002 sobre manejo de residuos peligrosos biológico-infecciosos y NOM-005-SSA3-2010 sobre infraestructura y equipamiento de establecimientos para la atención médica.";
    const splitBio = doc.splitTextToSize(biosecurityText, 170);
    doc.setFontSize(8);
    doc.text(splitBio, 20, yPos + 5);
    yPos += doc.getTextDimensions(splitBio).h + 10;

    // III & IV
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('III. BENEFICIOS ESPERADOS', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const benefitsText = "Mejora de la salud podal, eliminación de focos de infección, reducción de dolor y mejora estética funcional.";
    doc.text(benefitsText, 20, yPos + 5);
    
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('IV. RIESGOS Y POSIBLES COMPLICACIONES', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const risksText = "Poco frecuentes, pero pueden incluir dolor leve, sangrado superficial, irritación local o riesgo mínimo de infección.";
    doc.text(risksText, 20, yPos + 5);
    
    // Signature
    doc.setFont('helvetica', 'bold');
    doc.text('DECLARACIÓN DE CONFORMIDAD', 105, 230, { align: 'center' });
    doc.setFontSize(9);
    doc.text('Manifiesto que he sido informado de los alcances y riesgos del tratamiento y autorizo su realización.', 105, 235, { align: 'center' });
    
    if (consent.signature) {
      doc.addImage(consent.signature, 'PNG', 75, 240, 60, 25);
    }
    
    doc.line(75, 265, 135, 265);
    doc.setFontSize(10);
    doc.text(consent.patientData.fullName, 105, 270, { align: 'center' });
    doc.setFontSize(8);
    doc.text('FIRMA DEL PACIENTE O TUTOR', 105, 275, { align: 'center' });

    doc.save(`Consentimiento_Podologia_${consent.patientData.fullName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
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
              Consentimiento Informado
            </h2>
            <p className="text-[11px] md:text-[12px] text-slate-400 font-black uppercase tracking-[0.15em] mt-1.5 flex items-center gap-2 truncate">
               <span className="w-1.5 h-1.5 rounded-full bg-brand-purple shrink-0"></span>
               Podología
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto shrink-0">
           {initialData && (
              <button 
                onClick={() => generatePDF(formData)}
                className="flex-1 sm:flex-none bg-slate-900 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[11px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Exportar PDF
              </button>
           )}
           <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 sm:flex-none ${isSaving ? 'bg-emerald-500' : 'bg-brand-purple hover:bg-brand-purple-dark'} text-white px-4 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[11px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-purple/20`}
              >
                {isSaving ? <CheckCircle2 className="w-4 h-4 animate-bounce" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Guardando...' : 'Firmar y Guardar'}</span>
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-0 md:p-8 bg-slate-50/50">
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
          {/* Logo & Info */}
          <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 bg-brand-purple/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-brand-purple" />
               </div>
               <div>
                  <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight italic">MEDICAL <span className="text-brand-purple">D'LIS</span></h1>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Av. Glandorf 3706, Col San Felipe</p>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Tel: 6144891998</p>
               </div>
               <div className="pt-4 pb-2 border-y border-slate-50 w-full">
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Consentimiento Informado</h2>
                  <p className="text-[11px] text-slate-400 font-bold mt-1">SERVICIOS DE PODOLOGÍA PROFESIONAL</p>
               </div>
               <div className="w-full flex justify-end">
                  <div className="text-left">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fecha de Emisión</label>
                     <input 
                       type="date" 
                       value={formData.date}
                       onChange={e => setFormData({...formData, date: e.target.value})}
                       className="p-2 border-2 border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-brand-purple"
                     />
                  </div>
               </div>
            </div>

            {/* I. Patient Data */}
            <div className="space-y-6 pt-6 border-t border-slate-50">
               <div className="flex items-center gap-3 text-brand-purple">
                  <User className="w-5 h-5" />
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">I. Datos del Paciente</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre Completo</label>
                     <input type="text" value={formData.patientData.fullName} onChange={e => setFormData({...formData, patientData: {...formData.patientData, fullName: e.target.value}})} className="form-input-hc" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Teléfono</label>
                     <input type="tel" value={formData.patientData.phone} onChange={e => setFormData({...formData, patientData: {...formData.patientData, phone: e.target.value}})} className="form-input-hc" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Correo Electrónico</label>
                     <input type="email" value={formData.patientData.email} onChange={e => setFormData({...formData, patientData: {...formData.patientData, email: e.target.value}})} className="form-input-hc" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Edad</label>
                       <input type="number" value={formData.patientData.age} onChange={e => setFormData({...formData, patientData: {...formData.patientData, age: parseInt(e.target.value)}})} className="form-input-hc" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sexo</label>
                       <select value={formData.patientData.sex} onChange={e => setFormData({...formData, patientData: {...formData.patientData, sex: e.target.value}})} className="form-input-hc">
                          <option value="M">Masculino</option>
                          <option value="F">Femenino</option>
                          <option value="O">Otro</option>
                       </select>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Antecedentes Médicos Relevantes</label>
                     <textarea value={formData.patientData.medicalHistory} onChange={e => setFormData({...formData, patientData: {...formData.patientData, medicalHistory: e.target.value}})} placeholder="Diabetes, Hipertensión, Alergias, etc..." className="form-input-hc min-h-[100px] resize-none" />
                  </div>
               </div>
            </div>

            {/* II. Procedures */}
            <div className="space-y-6 pt-6 border-t border-slate-50">
               <div className="flex items-center gap-3 text-brand-purple">
                  <ClipboardCheck className="w-5 h-5" />
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">II. Descripción del Procedimiento</h3>
               </div>
               <div className="bg-slate-50 p-6 rounded-2xl">
                  <p className="text-sm font-bold text-slate-700 italic border-l-4 border-brand-purple pl-4 mb-6">
                     Nombre del tratamiento: <span className="text-brand-purple text-lg not-italic font-black">PEDICURE CLÍNICO</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {[
                       { id: 'nailCutting', label: 'Corte y fresado terapéutico de uñas' },
                       { id: 'callusRemoval', label: 'Eliminación de hiperqueratosis/callos' },
                       { id: 'ingrownNail', label: 'Atención de uñas encarnadas' },
                       { id: 'antisepticCleaning', label: 'Limpieza antiséptica integral' },
                       { id: 'topicalApplication', label: 'Aplicación de antifúngicos/hidratantes' },
                       { id: 'complementaryProcedures', label: 'Quiropedia con fines terapéuticos' },
                     ].map(item => (
                        <label key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-brand-purple/20 transition-all">
                           <input 
                             type="checkbox" 
                             checked={formData.procedures[item.id as keyof typeof formData.procedures]} 
                             onChange={() => setFormData({...formData, procedures: {...formData.procedures, [item.id]: !formData.procedures[item.id as keyof typeof formData.procedures]}})}
                             className="w-5 h-5 accent-brand-purple rounded-md"
                           />
                           <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                        </label>
                     ))}
                  </div>
               </div>
               <div className="bg-rose-50/50 p-6 rounded-2xl border-2 border-rose-100 flex gap-4">
                  <ShieldCheck className="w-8 h-8 text-rose-500 shrink-0 mt-1" />
                  <div className="space-y-2">
                     <h4 className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Cláusula de Bioseguridad</h4>
                     <p className="text-xs text-rose-900/70 font-bold leading-relaxed">
                        Este establecimiento cumple rigurosamente con la <b>NOM-087-ECOL-SSA1-2002</b> sobre manejo de residuos peligrosos biológico-infecciosos (RPBI) y la <b>NOM-005-SSA3-2010</b> sobre infraestructura y equipamiento de establecimientos para la atención médica ambulatoria. El material utilizado es estéril o desechable para garantizar su seguridad.
                     </p>
                  </div>
               </div>
            </div>

            {/* III & IV Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600">
                     <CheckCircle2 className="w-5 h-5" />
                     <h3 className="text-sm font-black uppercase tracking-tight">III. Beneficios Esperados</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
                     Disminución de molestias al caminar, eliminación de focos de infección, mejora estética y funcional de los pies y prevención de complicaciones sistémicas.
                  </p>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-600">
                     <AlertTriangle className="w-5 h-5" />
                     <h3 className="text-sm font-black uppercase tracking-tight">IV. Riesgos y Complicaciones</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed bg-rose-50/30 p-4 rounded-xl border border-rose-100">
                     Los riesgos son mínimos e incluyen: dolor leve localizado, sangrado superficial, irritación temporal de la piel o reacciones alérgicas a productos tópicos.
                  </p>
               </div>
            </div>

            {/* V. Alternatives */}
            <div className="space-y-6 pt-6 border-t border-slate-50">
               <div className="flex items-center gap-3 text-brand-purple">
                  <Info className="w-5 h-5" />
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">V. Alternativas Disponibles</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'none', label: 'No realizar procedimiento' },
                    { id: 'valuation', label: 'Valoración dermatológica previa' },
                    { id: 'alternative', label: 'Tratamiento diferido/otros' },
                  ].map(option => (
                    <label key={option.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.alternative === option.id ? 'bg-brand-purple text-white border-brand-purple shadow-lg scale-[1.02]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
                       <input 
                         type="radio" 
                         name="alternative" 
                         checked={formData.alternative === option.id}
                         onChange={() => setFormData({...formData, alternative: option.id as any})}
                         className="hidden"
                       />
                       <span className={`text-[11px] font-black uppercase tracking-widest ${formData.alternative === option.id ? 'text-white' : 'text-slate-500'}`}>{option.label}</span>
                    </label>
                  ))}
               </div>
            </div>

            {/* Signature Section */}
            <div className="pt-12 border-t-2 border-slate-100 space-y-8 bg-slate-50/50 -mx-6 md:-mx-12 p-6 md:p-12 pb-24 rounded-b-[2rem] md:rounded-b-[3.5rem]">
               <div className="text-center max-w-2xl mx-auto space-y-4">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight underline decoration-brand-purple/30">Declaración de Conformidad</h3>
                  <p className="text-xs text-slate-500 font-bold leading-loose italic">
                    "Yo, <b>{formData.patientData.fullName || '____________________'}</b>, por voluntad propia, autorizo al personal de podología de MEDICAL D'LIS a realizar los procedimientos seleccionados, manifestando que he comprendido los beneficios y riesgos informados en este documento."
                  </p>
               </div>

               <div className="max-w-md mx-auto space-y-4">
                  <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-4 shadow-xl relative overflow-hidden group">
                     {formData.signature ? (
                        <div className="h-48 flex items-center justify-center relative">
                           <img src={formData.signature} alt="Signature" className="max-h-full" />
                           <button onClick={handleClearSignature} className="absolute top-2 right-2 p-2 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     ) : (
                        <>
                          <SignatureCanvas 
                            ref={sigCanvas}
                            penColor="#7c3aed"
                            canvasProps={{
                              className: 'w-full h-48 cursor-crosshair'
                            }}
                          />
                          <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none">
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Firma aquí</p>
                          </div>
                          <button 
                            onClick={() => sigCanvas.current?.clear()}
                            className="absolute bottom-4 right-4 text-[9px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                          >
                            Limpiar
                          </button>
                        </>
                     )}
                  </div>
                  <div className="text-center">
                     <p className="text-sm font-black text-slate-900 italic underline decoration-slate-200 decoration-2 underline-offset-8">
                        {formData.patientData.fullName || 'Firma del Paciente'}
                     </p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Firmante Responsable</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .form-input-hc {
          width: 100%;
          padding: 1.15rem 1.25rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 1.25rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
          transition: all 0.3s;
          outline: none;
        }
        .form-input-hc:hover {
          border-color: #cbd5e1;
        }
        .form-input-hc:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
}

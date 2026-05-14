/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  ChevronLeft, 
  Save, 
  Stethoscope, 
  Sparkles, 
  History, 
  Droplet, 
  FileText,
  Activity,
  Image as ImageIcon,
  PenTool,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react';
import { Patient, Specialty, ClinicalRecordData, Role } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import DocumentManager from './DocumentManager';

interface ClinicalRecordProps {
  patient: Patient;
  onClose: () => void;
  activeRole: Role;
  activeSection: string;
}

export default function ClinicalRecord({ patient, onClose, activeRole, activeSection }: ClinicalRecordProps) {
  // Default specialty logic based on role
  const getDefaultSpecialty = (): Specialty => {
    if (activeRole === Role.ESTETICA) return 'Medicina Estética';
    if (activeRole === Role.MEDICO) {
      return (patient.service as Specialty) || 'Cirugía General';
    }
    return (patient.service as Specialty) || 'Medicina Estética';
  };

  const [specialty, setSpecialty] = useState<Specialty>(getDefaultSpecialty());

  const draName = "Dr. Alejandro Méndez";
  const professionalCeadula = "CED. PROF. 12345678";

  const mockHistory: any[] = [
    { 
      id: 'h1',
      date: '12 May, 2024', 
      type: 'Consulta', 
      doctor: 'Dr. Alejandro Méndez', 
      content: 'Paciente refiere mejoría notable en la zona tratada. Se observa cicatrización óptima. Se recomienda continuar con cuidados básicos.' 
    },
    { 
      id: 'h2',
      date: '05 May, 2024', 
      type: 'Procedimiento', 
      doctor: 'Dra. Elena Sofía', 
      content: 'Aplicación de tratamiento protocolario. Sin reacciones adversas inmediatas. Tolerancia al dolor: leve.' 
    },
    { 
      id: 'h3',
      date: '20 Abr, 2024', 
      type: 'Valoración', 
      doctor: 'Dr. Alejandro Méndez', 
      content: 'Valoración inicial. Candidato apto para el procedimiento solicitado. Se explican riesgos y beneficios.' 
    }
  ];
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(
    activeSection === 'consent' ? 'consent' : 
    activeSection === 'recipe' ? 'recipe' : 'evolution'
  );
  
  const [prescriptions, setPrescriptions] = useState<{med: string, dose: string, freq: string}[]>([]);
  const [newMed, setNewMed] = useState({ med: '', dose: '', freq: '' });

  const addMedication = () => {
    if (newMed.med) {
      setPrescriptions([...prescriptions, newMed]);
      setNewMed({ med: '', dose: '', freq: '' });
    }
  };

  const removeMedication = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const consentInfo = {
    Estética: "Por la presente, autorizo la realización del tratamiento estético solicitado. He sido informado sobre los productos a utilizar, la técnica de aplicación y los cuidados posteriores. Entiendo que los resultados pueden variar y acepto los riesgos menores como inflamación temporal o hematomas.",
    Cirugía: "Certifico que he sido informado detalladamente sobre el procedimiento quirúrgico propuesto, sus alternativas y riesgos inherentes (infección, sangrado, reacciones a la anestesia). Autorizo al equipo médico a realizar las maniobras necesarias para el éxito de la intervención.",
    General: "Acepto el tratamiento médico sugerido tras la valoración clínica. Me comprometo a seguir las indicaciones terapéuticas y acudir a las revisiones programadas para el seguimiento de mi estado de salud."
  };

  const getConsentText = () => {
    if (specialty === 'Medicina Estética') return consentInfo.Estética;
    if (specialty === 'Cirugía General') return consentInfo.Cirugía;
    return consentInfo.General;
  };

  const defaultNote = specialty === 'Cirugía General' 
    ? "NOTA QUIRÚRGICA:\n- Técnica: \n- Hallazgos: \n- Plan: " 
    : specialty === 'Medicina Estética'
    ? "FICHA DE CABINA:\n- Producto: \n- Lote: \n- Unidades: "
    : "NOTA DE EVOLUCIÓN:\n- Diagnóstico: \n- Plan de tratamiento: ";

  useEffect(() => {
    setNote(defaultNote);
  }, [specialty]);

  // Handle section sync
  useEffect(() => {
    if (activeSection === 'consent') setActiveTab('consent');
    else if (activeSection === 'recipe') setActiveTab('recipe');
    else setActiveTab('evolution');
  }, [activeSection]);
  
  // Signature Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<ClinicalRecordData>>({
    patientId: patient.id,
    specialty: specialty,
    medicalInfo: {
      history: '',
      allergies: '',
      bloodType: '',
      surgicalNote: ''
    },
    aestheticInfo: {
      parameters: '',
      sessionNumber: 3,
      totalSessions: 10
    }
  });

  // Role Checks
  const canSeeMedical = activeRole === Role.ADMIN || activeRole === Role.MEDICO;
  const canSeeAesthetic = activeRole === Role.ADMIN || activeRole === Role.ESTETICA;

  // Effect to clear canvas or setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#6b21a8'; // Purple for brand
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const getRecordTitle = () => {
    if (activeTab === 'consent') return 'Consentimiento Informado';
    if (activeTab === 'recipe') return 'Recetario Digital';
    
    switch (activeSection) {
      case 'photos': return 'Seguimiento Fotográfico';
      case 'sessions': return 'Control de Sesiones';
      case 'cabin': return 'Ficha de Cabina';
      default: return activeRole === Role.ESTETICA ? 'Ficha de Cabina' : 'Expediente Clínico';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-2xl flex flex-col h-full max-h-[90vh] overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-brand-purple transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">
              {getRecordTitle()}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{patient.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl">
            {(activeRole === Role.MEDICO || activeRole === Role.ADMIN) && (
              <>
                <button 
                  onClick={() => setActiveTab('evolution')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'evolution' ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Expediente
                </button>
                <button 
                  onClick={() => setActiveTab('consent')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'consent' ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Consentimiento
                </button>
                <button 
                  onClick={() => setActiveTab('recipe')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'recipe' ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Recetario
                </button>
              </>
            )}
            {activeRole === Role.ESTETICA && (
              <>
                <button 
                  onClick={() => setActiveTab('evolution')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'evolution' ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Ficha Cabina
                </button>
                <button 
                  onClick={() => setActiveTab('recipe')}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'recipe' ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Recomendaciones
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {activeRole !== Role.ESTETICA && activeTab === 'evolution' && (
              <div className="bg-slate-50 py-1 px-3 rounded-lg flex items-center gap-2 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Especialidad:</span>
                <select 
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value as Specialty)}
                  className="bg-transparent text-xs font-bold text-brand-purple focus:outline-none cursor-pointer"
                >
                  <option value="Cirugía General">Cirugía General</option>
                  <option value="Medicina Estética">Medicina Estética</option>
                  <option value="Aparatología">Aparatología</option>
                  <option value="Podología">Podología</option>
                </select>
              </div>
            )}
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`${isSaving ? 'bg-emerald-500' : 'bg-brand-purple hover:bg-brand-purple-dark'} text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md`}
            >
              {isSaving ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Guardado' : (activeTab === 'recipe' ? 'Imprimir Receta' : 'Guardar Cambios')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
        <AnimatePresence mode="wait">
          {activeTab === 'evolution' && (
            <motion.div 
              key="tab-evolution"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-8 space-y-8">
            
            <AnimatePresence mode="wait">
              {/* Medical Section - Only for Medics or Admins */}
              {canSeeMedical && (specialty === 'Cirugía General' || specialty === 'Podología' || activeRole === Role.ADMIN) && (
                <motion.div 
                  key="medical"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-100"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-brand-purple text-sm font-bold uppercase tracking-wider mb-2">
                      <History className="w-4 h-4" />
                      <span>Antecedentes Médicos</span>
                    </div>
                    <textarea 
                      placeholder="Describa el historial clínico relevante..."
                      className="w-full input-light min-h-[120px] resize-none text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-brand-purple text-sm font-bold uppercase tracking-wider mb-2">
                        <Droplet className="w-4 h-4 text-rose-500" />
                        <span>Alergias y Tipado</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Alergias..." className="input-light text-sm" />
                        <select className="input-light text-sm cursor-pointer">
                          <option value="">Tipo de Sangre</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-brand-purple text-sm font-bold uppercase tracking-wider mb-2">
                        <FileText className="w-4 h-4" />
                        <span>Nota Quirúrgica / Médica</span>
                      </div>
                      <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Detalles del procedimiento..."
                        className="w-full input-light min-h-[200px] resize-none text-sm font-medium"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Aesthetic Section - Only for Aesthetics or Admins */}
              {canSeeAesthetic && (specialty === 'Medicina Estética' || specialty === 'Aparatología' || activeRole === Role.ADMIN) && (
                <motion.div 
                  key="aesthetic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-brand-purple text-sm font-bold uppercase tracking-wider mb-2">
                      <Activity className="w-4 h-4" />
                      <span>Parámetros del Tratamiento</span>
                    </div>
                    <textarea 
                      placeholder="Potencia del láser, técnica dermapen, etc..."
                      className="w-full input-light min-h-[120px] resize-none text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-slate-400">
                        <span>Contador de Sesiones</span>
                        <Sparkles className="w-4 h-4 text-brand-purple" />
                      </div>
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-display font-black text-slate-900 leading-none">
                          {patient.sessions?.includes('de') ? patient.sessions.split(' ')[0] : '1'}
                        </span>
                        <span className="text-slate-400 font-bold text-xl mb-1">
                          / {patient.sessions?.includes('de') ? patient.sessions.split(' ')[2] : '10'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-purple h-full rounded-full transition-all duration-1000" 
                          style={{ 
                            width: patient.sessions?.includes('de') 
                              ? `${(parseInt(patient.sessions.split(' ')[0]) / parseInt(patient.sessions.split(' ')[2])) * 100}%` 
                              : '10%' 
                          }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Procedimiento: {specialty}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* History Feed - Línea de Tiempo */}
            <div className="space-y-4 pt-8 border-t border-slate-100">
               <div className="flex items-center gap-2 text-brand-purple text-sm font-bold uppercase tracking-wider mb-4">
                  <History className="w-4 h-4" />
                  <span>Historial de Consultas y Procedimientos</span>
               </div>
               <div className="space-y-4">
                  {mockHistory.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                       <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-brand-purple mt-1.5"></div>
                          <div className="w-0.5 flex-1 bg-slate-100 my-1"></div>
                       </div>
                       <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between mb-1">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date} • {item.type}</p>
                             <p className="text-[10px] font-bold text-slate-900">{item.doctor}</p>
                          </div>
                          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">"{item.content}"</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Gallery Section - Visible for everyone but mainly for Aesthetics/Medics */}
            <div className="space-y-4 pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-brand-purple text-sm font-bold uppercase tracking-wider">
                  <ImageIcon className="w-4 h-4" />
                  <span>Galería de Evolución Post-Venta</span>
                </div>
                <span className="text-[10px] bg-brand-purple/10 text-brand-purple font-black px-2 py-1 rounded-full uppercase">Imágenes Protegidas PII</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative group">
                    <img 
                      src={`https://images.unsplash.com/photo-${i === 1 ? '1584622650111-993a426fbf0a' : i === 2 ? '1559530034-754146a8fc82' : '1551076805-e1869033e561'}?auto=format&fit=crop&q=80&w=200`} 
                      alt="Progress" 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-[8px] text-white font-black uppercase tracking-tighter">Sesión {i}</p>
                    </div>
                  </div>
                ))}
                <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-brand-purple/30 hover:text-brand-purple transition-all cursor-pointer group uppercase">
                  <Plus className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black tracking-widest">Añadir</span>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-brand-purple text-sm font-bold uppercase tracking-wider">
                  <PenTool className="w-4 h-4" />
                  <span>Validación de Documento (Firma)</span>
                </div>
                <button 
                  onClick={clearSignature}
                  className="text-[10px] uppercase font-bold text-rose-500 hover:text-rose-400 transition-colors"
                >
                  Borrar Trazo
                </button>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 overflow-hidden border border-slate-100 shadow-inner">
                <canvas 
                  ref={canvasRef}
                  width={800}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                  className="w-full h-40 cursor-crosshair touch-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 italic font-medium uppercase tracking-tight">Documento válido únicamente bajo firma del profesional responsable.</p>
            </div>

          </div>

          {/* Right Column: Documents & Actions */}
          <div className="lg:col-span-4 lg:sticky lg:top-0 h-fit space-y-6">
            <DocumentManager patient={patient} specialty={specialty} activeRole={activeRole} />
          </div>
        </motion.div>
      )}

      {activeTab === 'consent' && (
        <motion.div 
          key="tab-consent"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          className="max-w-3xl mx-auto space-y-10 py-10"
        >
          <div className="p-12 bg-slate-50 border border-slate-100 rounded-[3rem] shadow-inner font-sans text-slate-800 leading-relaxed space-y-8">
            <div className="text-center mb-10">
               <h3 className="text-xl font-black uppercase tracking-[0.2em] text-brand-purple">Consentimiento Informado</h3>
               <p className="text-[10px] font-bold text-slate-400 mt-2">Dra. Lluvia Gutiérrez • {professionalCeadula}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-200">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400">Paciente</p>
                  <p className="text-sm font-bold text-slate-900">{patient.name}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400">Procedimiento</p>
                  <p className="text-sm font-bold text-slate-900">{specialty}</p>
               </div>
            </div>

            <p className="text-sm first-letter:text-4xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-brand-purple">
              {getConsentText() || ""}
            </p>

            <div className="pt-20 flex flex-col items-center">
               <div className="w-64 h-32 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center p-2">
                  <canvas 
                    ref={canvasRef}
                    width={256}
                    height={128}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    className="w-full h-full cursor-crosshair"
                  />
               </div>
               <div className="w-64 h-px bg-slate-400 mt-4"></div>
               <p className="text-[10px] font-black uppercase tracking-widest mt-2">{patient.name}</p>
               <p className="text-[9px] text-slate-400 font-bold">FECHA: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'recipe' && (
        <motion.div 
          key="tab-recipe"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-4xl mx-auto py-10"
        >
          <div className="bg-white border-4 border-slate-100 rounded-[3rem] p-16 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-16">
               <div className="flex items-center gap-6">
                 <div className="w-24 h-24 bg-brand-purple rounded-[2rem] flex items-center justify-center overflow-hidden shadow-xl border-4 border-white">
                    <img 
                      src="/1000305383.jpg" 
                      alt="Logo" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                 </div>
                 <div>
                   <h3 className="text-2xl font-display font-black text-slate-900 tracking-tighter leading-none italic">Medical <span className="text-brand-purple">D'Lis.</span></h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Clínica de Especialidades</p>
                 </div>
               </div>
               <div className="text-right">
                  <p className="text-[11px] font-black text-slate-900 uppercase">Dra. Lluvia Gutiérrez</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{professionalCeadula}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">CP: 49000, JALISCO, MÉXICO</p>
               </div>
            </div>

            <div className="space-y-8 mb-16">
               <div className="flex items-baseline gap-4 border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Paciente:</span>
                  <span className="text-sm font-bold text-slate-900 uppercase">{patient.name}</span>
                  <span className="flex-1"></span>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fecha:</span>
                  <span className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('es-MX')}</span>
               </div>

               <div className="min-h-[400px] py-6">
                  <div className="flex items-center gap-4 text-brand-purple mb-8">
                     <span className="text-4xl font-black italic underline decoration-brand-purple/20">Rx</span>
                     <div className="h-px flex-1 bg-brand-purple/10"></div>
                  </div>

                  <div className="space-y-4 mb-8 no-print">
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Medicamento" 
                        value={newMed.med}
                        onChange={e => setNewMed({...newMed, med: e.target.value})}
                        className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                      />
                      <input 
                        type="text" 
                        placeholder="Dosis" 
                        value={newMed.dose}
                        onChange={e => setNewMed({...newMed, dose: e.target.value})}
                        className="w-32 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                      />
                      <input 
                        type="text" 
                        placeholder="Frecuencia"
                        value={newMed.freq}
                        onChange={e => setNewMed({...newMed, freq: e.target.value})}
                        className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                      />
                      <button 
                        onClick={addMedication}
                        className="p-3 bg-brand-purple text-white rounded-xl hover:scale-105 transition-transform shadow-lg shadow-brand-purple/20"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {prescriptions.map((p, i) => (
                      <div key={i} className="flex items-start justify-between group">
                        <div className="flex-1">
                          <p className="text-base font-black text-slate-900 uppercase tracking-tight">{p.med}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Dosis: {p.dose} — {p.freq}</p>
                        </div>
                        <button 
                          onClick={() => removeMedication(i)}
                          className="p-1 text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all no-print"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {prescriptions.length === 0 && (
                      <p className="text-sm font-medium text-slate-300 italic"></p>
                    )}
                  </div>
               </div>
            </div>

            <div className="flex border-t border-slate-100 pt-10">
               <div className="w-1/2 pr-10 border-r border-slate-100">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 italic">Fórmula / Indicaciones</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">Tratamiento sugerido según valoración clínica. Cualquier reacción adversa favor de notificar a su médico de inmediato.</p>
               </div>
               <div className="w-1/2 pl-10 flex flex-col items-center">
                  <div className="w-48 h-px bg-slate-300 mb-2"></div>
                  <p className="text-[10px] font-black text-slate-900 uppercase">{draName}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Firma del Profesional</p>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
    </motion.div>
  );
}


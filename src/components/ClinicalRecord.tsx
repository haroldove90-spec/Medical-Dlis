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
  X
} from 'lucide-react';
import { Patient, Specialty, ClinicalRecordData, Role } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import DocumentManager from './DocumentManager';

interface ClinicalRecordProps {
  patient: Patient;
  onClose: () => void;
  activeRole: Role;
}

export default function ClinicalRecord({ patient, onClose, activeRole }: ClinicalRecordProps) {
  // Default specialty logic based on role
  const getDefaultSpecialty = (): Specialty => {
    if (activeRole === Role.ESTETICA) return 'Medicina Estética';
    if (activeRole === Role.MEDICO) {
      return (patient.service as Specialty) || 'Cirugía General';
    }
    return (patient.service as Specialty) || 'Medicina Estética';
  };

  const [specialty, setSpecialty] = useState<Specialty>(getDefaultSpecialty());
  
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
              {activeRole === Role.ESTETICA ? 'Ficha Estética' : 'Expediente Clínico'}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{patient.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {activeRole !== Role.ESTETICA && (
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
          <button className="bg-brand-purple hover:bg-brand-purple-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md">
            <Save className="w-4 h-4" />
            Finalizar & Guardar
          </button>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
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
                        placeholder="Detalles del procedimiento..."
                        className="w-full input-light min-h-[100px] resize-none text-sm font-medium"
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
                        <span className="text-5xl font-display font-black text-slate-900 leading-none">3</span>
                        <span className="text-slate-400 font-bold text-xl mb-1">/ 10</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-purple h-full rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Procedimiento: Botox Tercio Superior</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                {[1, 2].map((i) => (
                  <div key={i} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-brand-purple/30 hover:text-brand-purple transition-all cursor-pointer group">
                    <ImageIcon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Subir Foto</span>
                  </div>
                ))}
                <div className="aspect-square bg-white p-2 rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col ring-2 ring-brand-purple/20">
                  <div className="flex-1 bg-slate-100 rounded-lg overflow-hidden group relative">
                    <div className="absolute inset-0 bg-brand-purple/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[8px] text-white font-black uppercase">Ver Antes</span>
                    </div>
                  </div>
                  <span className="text-[8px] text-center mt-1 text-slate-400 font-bold uppercase">Previo</span>
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
        </div>
      </div>
    </motion.div>
  );
}


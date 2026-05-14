/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, UserRound, Sparkles, ClipboardList, ArrowRight, User } from 'lucide-react';
import { Role } from '../types';
import { motion } from 'motion/react';

interface RoleSelectionProps {
  onSelect: (role: Role) => void;
}

export default function RoleSelection({ onSelect }: RoleSelectionProps) {
  const roles = [
    { 
      id: Role.ADMIN, 
      label: 'Administración', 
      icon: LayoutDashboard, 
      color: 'bg-slate-900', 
      desc: 'Dashboard financiero, inventario y reportes operativos.',
      features: ['Control de Caja', 'Stock de Insumos', 'Comisiones']
    },
    { 
      id: Role.MEDICO, 
      label: 'Consulta Médica', 
      icon: UserRound, 
      color: 'bg-brand-purple', 
      desc: 'Expedientes clínicos, notas quirúrgicas y recetas médicas.',
      features: ['Endoscopia', 'Cirugía General', 'Recetario Digital']
    },
    { 
      id: Role.ESTETICA, 
      label: 'Cabina Estética', 
      icon: Sparkles, 
      color: 'bg-purple-500', 
      desc: 'Fichas de tratamiento, sesiones y galería de evolución.',
      features: ['Dermapen', 'Botox', 'Aparatología']
    },
    { 
      id: Role.RECEPCION, 
      label: 'Recepción y Caja', 
      icon: ClipboardList, 
      color: 'bg-sky-500', 
      desc: 'Agenda general, registro de pacientes y cobros.',
      features: ['Citas del Día', 'Alta de Pacientes', 'Cierre de Turno']
    },
    { 
      id: Role.PACIENTE, 
      label: 'Portal Paciente', 
      icon: User, 
      color: 'bg-emerald-500', 
      desc: 'Consulta de citas, descarga de recetas y resultados.',
      features: ['Mis Citas', 'Recetas PDF', 'Indicaciones']
    },
  ];

  return (
    <div className="min-h-screen bg-bg-main flex flex-col p-6 md:p-12">
      <header className="max-w-7xl mx-auto w-full mb-16 text-center">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-48 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4">
             <img src="https://cossma.com.mx/medical.png" alt="Medical D'Lis Logo" className="w-full h-auto object-contain drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight leading-none mb-2">Medical D'Lis</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Acceso Multi-Usuario</p>
          </div>
        </div>
        <h2 className="text-2xl font-serif text-slate-600 italic">Bienvenida, Dra. Lluvia Gutiérrez</h2>
        <p className="text-slate-400 mt-2 font-medium">Seleccione el módulo de trabajo para iniciar jornada</p>
      </header>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {roles.map((role, idx) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(role.id)}
            className="bg-white rounded-[2rem] p-8 text-left border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full"
          >
            <div className={`w-14 h-14 ${role.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
              <role.icon className="w-7 h-7" />
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-brand-purple transition-colors">{role.label}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-1">{role.desc}</p>
            
            <div className="space-y-2 mb-8">
              {role.features.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-brand-purple font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
              Ingresar
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </div>

      <footer className="mt-auto pt-16 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        © 2024 Medical D'Lis • Sistema Integral de Gestión Médica y Estética
      </footer>
    </div>
  );
}

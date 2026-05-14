/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, Users, UserRound, Sparkles, ClipboardList, LogOut, Menu, User, X as CloseIcon } from 'lucide-react';
import { Role } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface SidebarProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export default function Sidebar({ activeRole, onRoleChange, isOpen, onToggle, onLogout }: SidebarProps) {
  const roles = [
    { id: Role.ADMIN, icon: LayoutDashboard },
    { id: Role.MEDICO, icon: UserRound },
    { id: Role.ESTETICA, icon: Sparkles },
    { id: Role.RECEPCION, icon: ClipboardList },
    { id: Role.PACIENTE, icon: User },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-bg-sidebar border-r border-slate-100">
      <div className="p-8">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-purple-light rounded-xl flex items-center justify-center overflow-hidden border border-brand-purple/10">
              <img src="/1000305383.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display font-black text-xl text-brand-purple tracking-tight leading-none">Medical D'Lis</h1>
              <p className="text-[9px] text-slate-400 tracking-[0.2em] font-bold mt-1">ESTHÉTIQUE & SANTÉ</p>
            </div>
          </div>
          <button onClick={onToggle} className="lg:hidden p-2 text-slate-400">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 px-4">Accesos de {activeRole}</p>
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            // In a real app we might hide non-accessible roles here, 
            // but for the demo we'll let users switch roles easily if they click them.
            return (
              <button
                key={role.id}
                id={`sidebar-role-${role.id}`}
                onClick={() => {
                  onRoleChange(role.id);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`w-full sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-purple' : 'text-slate-400'}`} />
                <span className="text-sm font-medium tracking-wide">{role.id}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-50 space-y-2">
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-2">
          <div className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xs shadow-md">
            LG
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-none mb-1">Dra. Lluvia G.</p>
            <p className="text-[9px] text-brand-purple font-bold tracking-wider uppercase">Sesión: {activeRole}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-brand-purple transition-colors px-4 w-full py-2 hover:bg-slate-50 rounded-xl"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Cambiar de Rol</span>
        </button>

        <button 
          id="logout-button" 
          onClick={onLogout}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors px-4 w-full py-2 hover:bg-rose-50 rounded-xl"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 h-screen flex-col fixed left-0 top-0 z-50 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 z-[70] lg:hidden overflow-hidden shadow-2xl"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

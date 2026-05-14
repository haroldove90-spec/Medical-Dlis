/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, Users, UserRound, Sparkles, ClipboardList, LogOut } from 'lucide-react';
import { Role } from '../types';
import { motion } from 'motion/react';

interface SidebarProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

export default function Sidebar({ activeRole, onRoleChange }: SidebarProps) {
  const roles = [
    { id: Role.ADMIN, icon: LayoutDashboard },
    { id: Role.MEDICO, icon: UserRound },
    { id: Role.ESTETICA, icon: Sparkles },
    { id: Role.RECEPCION, icon: ClipboardList },
  ];

  return (
    <aside className="w-64 bg-bg-sidebar border-r border-slate-800 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        <div className="mb-10">
          <h1 className="font-serif text-2xl text-brand-gold tracking-widest uppercase">D'Lis</h1>
          <p className="text-[10px] text-slate-500 tracking-[0.2em] font-semibold mt-1">MEDICAL & ESTHETIQUE</p>
        </div>

        <nav className="space-y-2">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-4 px-4">Acceso Directo</p>
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                id={`sidebar-role-${role.id}`}
                onClick={() => onRoleChange(role.id)}
                className={`w-full sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-slate-500'}`} />
                <span className="text-sm tracking-wide">{role.id}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-gold to-slate-400 flex items-center justify-center text-black font-bold text-xs shadow-lg">
            JD
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Dr. Jane Doe</p>
            <p className="text-[10px] text-slate-500">Director Médico</p>
          </div>
        </div>
        <button id="logout-button" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-brand-gold transition-colors px-3">
          <LogOut className="w-3 h-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

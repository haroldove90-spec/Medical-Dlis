/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AppointmentForm from './components/AppointmentForm';
import RoleSelection from './components/RoleSelection';
import { Role } from './types';
import { Bell, Menu, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    setActiveRole(null);
    setIsSidebarOpen(false);
  };

  if (!activeRole) {
    return <RoleSelection onSelect={setActiveRole} />;
  }

  return (
    <div className="min-h-screen bg-bg-main flex selection:bg-brand-purple/20 selection:text-brand-purple font-sans">
      {/* Sidebar */}
      <Sidebar 
        activeRole={activeRole} 
        onRoleChange={setActiveRole} 
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight leading-none">Medical D'Lis</h1>
              <p className="text-slate-500 mt-2 text-sm font-medium">Módulo: <span className="text-brand-purple font-bold uppercase tracking-wider">{activeRole}</span></p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto md:ml-0">
            <div className="hidden sm:flex bg-emerald-50 p-2 px-4 rounded-full border border-emerald-100 items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-[10px] uppercase tracking-[0.15em] font-black text-emerald-700">Sistema Conectado</span>
            </div>
            
            <button className="relative p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-brand-purple hover:border-brand-purple/30 transition-all shadow-sm">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-brand-purple border-2 border-white rounded-full"></span>
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start flex-1">
          <div className="xl:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Dashboard activeRole={activeRole} />
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="xl:col-span-4 lg:sticky lg:top-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AppointmentForm activeRole={activeRole} />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}



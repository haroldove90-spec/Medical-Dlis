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
import { Role } from './types';
import { Bell, Search, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeRole, setActiveRole] = useState<Role>(Role.ADMIN);

  return (
    <div className="min-h-screen bg-bg-deep flex selection:bg-brand-gold/30 selection:text-brand-gold">
      {/* Sidebar - Fixed */}
      <Sidebar activeRole={activeRole} onRoleChange={setActiveRole} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 lg:p-12 min-h-screen">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif text-white tracking-tight leading-none">Dashboard Principal</h1>
            <p className="text-slate-500 mt-3 text-sm font-medium">Resumen de actividades para hoy, <span className="text-brand-gold italic">14 de Mayo</span></p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/40 p-2 px-5 rounded-full border border-slate-800 flex items-center space-x-3 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300">Sincronizado</span>
            </div>
            
            <button className="relative p-3 bg-bg-card border border-slate-800 rounded-xl text-slate-400 hover:text-brand-gold transition-all shadow-xl">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-brand-gold border-2 border-bg-card rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          <div className="xl:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="xl:col-span-4 sticky top-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AppointmentForm />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}


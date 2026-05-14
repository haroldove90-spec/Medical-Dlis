/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallet, CreditCard, Banknote, PieChart, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function FinanceReport() {
  const financeData = {
    total: '$12,450.00',
    methods: [
      { name: 'Efectivo', amount: '$4,280.00', percentage: 34, icon: Banknote, color: 'text-emerald-500' },
      { name: 'Tarjeta / Transf.', amount: '$8,170.00', percentage: 66, icon: CreditCard, color: 'text-brand-purple' },
    ],
    departments: [
      { name: 'Podología', amount: '$2,150', color: 'bg-sky-400' },
      { name: 'Cirugía General', amount: '$6,800', color: 'bg-brand-purple' },
      { name: 'Estética', amount: '$3,500', color: 'bg-purple-400' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Stats */}
        <div className="flex-1 dashboard-card overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-brand-purple-light rounded-xl">
              <Wallet className="w-5 h-5 text-brand-purple" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Finanzas de Hoy</h3>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Recaudado</p>
              <h4 className="text-4xl font-black text-slate-900 tracking-tight">{financeData.total}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {financeData.methods.map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${method.color}`} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{method.name}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{method.amount}</p>
                    <div className="w-full bg-slate-200 h-1 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-full bg-brand-purple transition-all duration-1000`} 
                        style={{ width: `${method.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dept Breakdown */}
        <div className="md:w-80 dashboard-card">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-brand-purple" />
            <h3 className="text-lg font-bold text-slate-900">Por Departamento</h3>
          </div>
          <div className="space-y-4">
            {financeData.departments.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${dept.color}`}></div>
                  <span className="text-sm font-medium text-slate-600">{dept.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{dept.amount}</span>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 p-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-purple transition-all shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Realizar Cierre de Caja
          </button>
        </div>
      </div>
    </div>
  );
}

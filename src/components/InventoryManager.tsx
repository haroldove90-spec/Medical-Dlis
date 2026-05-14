/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Package, AlertCircle, ShoppingCart, ArrowUpRight } from 'lucide-react';
import { InventoryItem } from '../types';
import { motion } from 'motion/react';

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Botox (Vial 100u)', stock: 5, minStock: 3, category: 'Estética' },
  { id: '2', name: 'Relleno Hialurónico', stock: 12, minStock: 10, category: 'Estética' },
  { id: '3', name: 'Kits Sutura Pro', stock: 2, minStock: 5, category: 'Cirugía' },
  { id: '4', name: 'Gasas Estériles (Paq.)', stock: 50, minStock: 20, category: 'Gral' },
  { id: '5', name: 'Guantes de Nitrilo (Caja)', stock: 8, minStock: 15, category: 'Gral' },
  { id: '6', name: 'Cartuchos Dermapen', stock: 15, minStock: 10, category: 'Estética' },
  { id: '7', name: 'Gel Conductivo 5L', stock: 1, minStock: 2, category: 'Estética' },
  { id: '8', name: 'Cánulas Endoscopia', stock: 4, minStock: 10, category: 'Cirugía' },
  { id: '9', name: 'Mascarilla Hidrogel', stock: 25, minStock: 10, category: 'Estética' },
  { id: '10', name: 'Anestésico Tópico 30g', stock: 10, minStock: 5, category: 'Estética' },
  { id: '11', name: 'Compresas Frías', stock: 30, minStock: 15, category: 'Gral' },
];

export default function InventoryManager() {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-display font-black text-slate-900">Control de Insumos</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Supervisión de Inventario Crítico</p>
        </div>
        <div className="p-3 bg-slate-900 rounded-2xl text-white">
          <Package className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-4">
        {mockInventory.map((item, idx) => {
          const isLow = item.stock <= item.minStock;
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                isLow ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${isLow ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
                   {isLow ? <AlertCircle className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{item.category}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className={`text-sm font-black ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                    {item.stock} unidades
                  </span>
                  {isLow && (
                    <button className="p-1 px-2 bg-rose-600 text-white text-[8px] font-black uppercase rounded-lg hover:bg-rose-700 transition-colors">
                      Pedir
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Mín. requerido: {item.minStock}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-widest hover:border-brand-purple hover:text-brand-purple transition-all flex items-center justify-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        Ver Catálogo Completo
      </button>
    </div>
  );
}

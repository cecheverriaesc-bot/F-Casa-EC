import { CheckCircle, Clock, FileText } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../lib/format';

const KPIStats = () => {
  const { stats, selectedCard } = useTransactions();

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
      <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
            {selectedCard === 'manual' ? 'Gastos Fijos' : 'Compras del Mes'}
          </div>
          <div className="text-lg font-bold text-slate-700">{formatCurrency(Math.abs(stats.newExpenses))}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="text-xs text-cyan-600 uppercase font-bold tracking-wider mb-1">Cuotas Arrastradas</div>
          <div className="text-lg font-bold text-cyan-600">{formatCurrency(Math.abs(stats.installmentsTotal))}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl shadow-sm border border-orange-200">
          <div className="text-xs text-orange-600 uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
            <Clock size={12} /> Proyectado Próximo Mes
          </div>
          <div className="text-lg font-bold text-orange-600">{formatCurrency(Math.abs(stats.totalUnbilled))}</div>
        </div>
      </div>
      <div className="md:col-span-4 bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700 text-white relative overflow-hidden flex flex-col justify-center">
        <div className="absolute right-0 top-0 p-3 opacity-10">
          <FileText size={80} />
        </div>
        <div className="relative z-10">
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
            {selectedCard === 'all' ? 'Gasto Total Facturado (Ambas)' : 'Total Facturado a Pagar'}
          </div>
          <div className="text-3xl font-bold text-emerald-400">{formatCurrency(Math.abs(stats.totalBilled))}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <CheckCircle size={12} className="text-emerald-400" /> Refleja la vista seleccionada
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIStats;

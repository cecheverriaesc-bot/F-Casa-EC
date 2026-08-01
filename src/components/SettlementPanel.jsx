import { Calculator } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../lib/format';

const SettlementPanel = () => {
  const { stats } = useTransactions();

  // El peso impar de la división se le asigna a Rina para que las dos mitades
  // sumen siempre exactamente el total de Casa.
  const shareCarlosCasa = Math.round(stats.allocationTotals.Casa / 2);
  const shareRinaCasa = stats.allocationTotals.Casa - shareCarlosCasa;
  const totalCarlosPay = shareCarlosCasa + stats.allocationTotals.Carlos;
  const totalRinaPay = shareRinaCasa + stats.allocationTotals.Rina;

  return (
    <div className="max-w-6xl mx-auto mb-8 bg-slate-800 text-white p-5 rounded-xl shadow-md border border-slate-700">
      <h3 className="font-semibold flex items-center gap-2 mb-4 text-emerald-400">
        <Calculator size={18} /> Cierre Mensual Exacto: ¿Cuánto le toca pagar a cada uno?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 shadow-inner">
          <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-300">Aporte Carlos</h4>
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>50% de Casa Compartida:</span>
            <span>{formatCurrency(shareCarlosCasa)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-300 mb-3">
            <span>Extras Personales (100%):</span>
            <span>{formatCurrency(stats.allocationTotals.Carlos)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-white border-t border-slate-600 pt-3">
            <span>Total a Cubrir:</span>
            <span className="text-blue-400">{formatCurrency(totalCarlosPay)}</span>
          </div>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 shadow-inner">
          <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-fuchsia-300">Aporte Rina</h4>
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>50% de Casa Compartida:</span>
            <span>{formatCurrency(shareRinaCasa)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-300 mb-3">
            <span>Extras Personales (100%):</span>
            <span>{formatCurrency(stats.allocationTotals.Rina)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-white border-t border-slate-600 pt-3">
            <span>Total a Cubrir:</span>
            <span className="text-fuchsia-400">{formatCurrency(totalRinaPay)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementPanel;

import { Users } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../lib/format';

const OWNERS = [
  { name: 'Casa', border: 'border-indigo-400', text: 'text-indigo-700' },
  { name: 'Carlos', border: 'border-blue-400', text: 'text-blue-700' },
  { name: 'Rina', border: 'border-fuchsia-400', text: 'text-fuchsia-700' },
];

const AllocationBar = () => {
  const { stats, selectedCard } = useTransactions();

  return (
    <div className="max-w-6xl mx-auto mb-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
        <Users size={18} /> ¿Cómo se distribuyen los ítems {selectedCard === 'all' ? 'facturados' : 'aquí'}?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {OWNERS.map(({ name, border, text }) => (
          <div key={name} className={`flex flex-col border-l-4 ${border} pl-4`}>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Items {name}</span>
            <span className={`text-xl font-bold ${text}`}>{formatCurrency(stats.allocationTotals[name])}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllocationBar;

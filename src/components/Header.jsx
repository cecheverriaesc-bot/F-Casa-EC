import { Download, FileText, Landmark, Layers, Plus, Users, Wallet } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { CARD_LABELS } from '../data/transactions';
import { downloadCsv } from '../lib/csv';

const CARD_TABS = [
  { id: 'all', label: CARD_LABELS.all, Icon: Users, active: 'bg-slate-800 text-white shadow' },
  { id: '9979', label: CARD_LABELS['9979'], Icon: Wallet, active: 'bg-blue-600 text-white shadow' },
  { id: '6259', label: CARD_LABELS['6259'], Icon: Wallet, active: 'bg-indigo-600 text-white shadow' },
  { id: 'manual', label: CARD_LABELS.manual, Icon: Landmark, active: 'bg-emerald-600 text-white shadow' },
];

const Header = ({ onOpenModal }) => {
  const { selectedCard, setSelectedCard, billedTransactions, unbilledTransactions } = useTransactions();

  const getSubTitle = () => {
    if (selectedCard === 'all') return 'Tarjetas + Gastos Fijos (Auditoría Julio)';
    if (selectedCard === 'manual') return 'Cuentas, Transferencias y Efectivo';
    return `Tarjeta terminada en ${selectedCard}`;
  };

  const handleExport = () => {
    const rows = [...billedTransactions, ...unbilledTransactions];
    if (rows.length === 0) return;
    downloadCsv(rows, `cierre-julio-2026-${selectedCard}.csv`);
  };

  return (
    <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
          <Layers className="text-blue-600" />
          Cierre Financiero de Julio
        </h1>
        <p className="text-slate-500 text-sm flex items-center gap-1">
          <FileText size={14} /> {getSubTitle()}
        </p>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200">
          {CARD_TABS.map(({ id, label, Icon, active }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedCard(id)}
              aria-pressed={selectedCard === id}
              className={`px-3 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${
                selectedCard === id ? `${active} font-bold` : 'text-slate-500 hover:bg-slate-50 font-medium'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onOpenModal}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium shadow-sm transition-colors"
        >
          <Plus size={16} /> Gasto Fijo
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium border border-slate-200 shadow-sm transition-colors"
        >
          <Download size={16} /> Exportar
        </button>
      </div>
    </div>
  );
};

export default Header;

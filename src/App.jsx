import { useState } from 'react';
import { Loader2, TriangleAlert } from 'lucide-react';
import { TransactionProvider, useTransactions } from './context/TransactionContext';
import Header from './components/Header';
import KPIStats from './components/KPIStats';
import AllocationBar from './components/AllocationBar';
import SettlementPanel from './components/SettlementPanel';
import TransactionTable from './components/TransactionTable';
import ExpenseChart from './components/ExpenseChart';
import AddExpenseModal from './components/AddExpenseModal';
import AddAdvanceModal from './components/AddAdvanceModal';
import SettingsPanel from './components/SettingsPanel';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const { loading, error, refresh } = useTransactions();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 gap-2">
        <Loader2 className="animate-spin" size={20} /> Cargando movimientos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-4 text-center">
        <TriangleAlert className="text-red-500" size={32} />
        <p className="text-slate-600 text-sm">{error}</p>
        <button
          type="button"
          onClick={refresh}
          className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-900 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main className="max-w-6xl mx-auto">
        <KPIStats />
        <AllocationBar />
        <SettingsPanel />
        <SettlementPanel onRegisterAdvance={() => setIsAdvanceOpen(true)} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TransactionTable />
          <div className="space-y-6">
            <ExpenseChart />
          </div>
        </div>
      </main>
      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddAdvanceModal isOpen={isAdvanceOpen} onClose={() => setIsAdvanceOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <TransactionProvider>
      <Dashboard />
    </TransactionProvider>
  );
}

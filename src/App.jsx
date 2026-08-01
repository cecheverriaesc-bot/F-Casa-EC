import { useState } from 'react';
import { Loader2, TriangleAlert } from 'lucide-react';
import { TransactionProvider, useTransactions } from './context/TransactionContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { isConfigured } from './lib/supabase';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import KPIStats from './components/KPIStats';
import AllocationBar from './components/AllocationBar';
import SettlementPanel from './components/SettlementPanel';
import TransactionTable from './components/TransactionTable';
import ExpenseChart from './components/ExpenseChart';
import AddExpenseModal from './components/AddExpenseModal';
import AddAdvanceModal from './components/AddAdvanceModal';
import SettingsPanel from './components/SettingsPanel';
import RecurringPanel from './components/RecurringPanel';
import HistoryPanel from './components/HistoryPanel';

const Splash = ({ children }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-4 text-center">
    {children}
  </div>
);

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const { loading, error, refresh } = useTransactions();
  const { signOut } = useAuth();

  if (loading) {
    return (
      <Splash>
        <span className="flex items-center gap-2 text-slate-500">
          <Loader2 className="animate-spin" size={20} /> Cargando movimientos...
        </span>
      </Splash>
    );
  }

  if (error) {
    return (
      <Splash>
        <TriangleAlert className="text-red-500" size={32} />
        <p className="text-slate-600 text-sm max-w-md">{error}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={refresh}
            className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-900 transition-colors"
          >
            Reintentar
          </button>
          <button
            type="button"
            onClick={signOut}
            className="px-4 py-2 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </Splash>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <main className="max-w-6xl mx-auto">
        <KPIStats />
        <AllocationBar />
        <RecurringPanel />
        <SettingsPanel />
        <SettlementPanel onRegisterAdvance={() => setIsAdvanceOpen(true)} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <TransactionTable />
          <div className="space-y-6">
            <ExpenseChart />
          </div>
        </div>
        <HistoryPanel />
      </main>
      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddAdvanceModal isOpen={isAdvanceOpen} onClose={() => setIsAdvanceOpen(false)} />
    </div>
  );
};

const Gate = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <Splash>
        <Loader2 className="animate-spin text-slate-400" size={24} />
      </Splash>
    );
  }

  if (!session) return <LoginScreen />;

  return (
    <TransactionProvider>
      <Dashboard />
    </TransactionProvider>
  );
};

export default function App() {
  // Sin variables de entorno no hay a qué conectarse: decirlo explícito evita
  // un error de red incomprensible al primer intento.
  if (!isConfigured) {
    return (
      <Splash>
        <TriangleAlert className="text-amber-500" size={32} />
        <p className="text-slate-600 text-sm max-w-md">
          Faltan <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> y{' '}
          <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>. Copia{' '}
          <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">.env.example</code> a{' '}
          <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">.env.local</code> y completa los valores.
        </p>
      </Splash>
    );
  }

  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

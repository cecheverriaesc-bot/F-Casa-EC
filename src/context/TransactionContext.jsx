import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedCard, setSelectedCard] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTransactions();
      setAllTransactions(data);
      setError(null);
    } catch (e) {
      setError(e?.message ?? 'No se pudieron cargar los movimientos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const currentCardData = useMemo(() => {
    if (selectedCard === 'all') return allTransactions;
    return allTransactions.filter((t) => t.card === selectedCard);
  }, [allTransactions, selectedCard]);

  const billedTransactions = useMemo(() => currentCardData.filter((t) => !t.isUnbilled), [currentCardData]);
  const unbilledTransactions = useMemo(() => currentCardData.filter((t) => t.isUnbilled), [currentCardData]);

  const stats = useMemo(() => {
    const currentDaily = billedTransactions.filter((t) => !t.isInstallment);
    const currentInstallments = billedTransactions.filter((t) => t.isInstallment);
    const billableItems = billedTransactions.filter((t) => t.type !== 'payment');

    const newExpenses = currentDaily.filter((t) => !t.type).reduce((sum, t) => sum + t.amount, 0);
    const installmentsTotal = currentInstallments.reduce((sum, t) => sum + t.amount, 0);
    const totalBilled = billableItems.reduce((acc, t) => acc + t.amount, 0);

    const sumFor = (owner) =>
      Math.abs(billableItems.filter((t) => t.allocation === owner).reduce((acc, t) => acc + t.amount, 0));

    const allocationTotals = {
      Casa: sumFor('Casa'),
      Carlos: sumFor('Carlos'),
      Rina: sumFor('Rina'),
    };

    const totalUnbilled = unbilledTransactions.reduce((acc, t) => acc + t.amount, 0);

    return { newExpenses, installmentsTotal, totalBilled, allocationTotals, totalUnbilled };
  }, [billedTransactions, unbilledTransactions]);

  const addTransaction = useCallback(async (transaction) => {
    setAllTransactions((prev) => [...prev, transaction]);
    await api.createTransaction(transaction);
  }, []);

  const addTransactionsBulk = useCallback(async (transactions) => {
    setAllTransactions((prev) => [...prev, ...transactions]);
    await api.createTransactionsBulk(transactions);
  }, []);

  const updateTransaction = useCallback(async (id, updates) => {
    setAllTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    await api.updateTransaction(id, updates);
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    setAllTransactions((prev) => prev.filter((t) => t.id !== id));
    await api.deleteTransaction(id);
  }, []);

  const value = useMemo(
    () => ({
      allTransactions,
      selectedCard,
      setSelectedCard,
      billedTransactions,
      unbilledTransactions,
      stats,
      loading,
      error,
      refresh,
      addTransaction,
      addTransactionsBulk,
      updateTransaction,
      deleteTransaction,
    }),
    [
      allTransactions,
      selectedCard,
      billedTransactions,
      unbilledTransactions,
      stats,
      loading,
      error,
      refresh,
      addTransaction,
      addTransactionsBulk,
      updateTransaction,
      deleteTransaction,
    ],
  );

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions debe usarse dentro de <TransactionProvider>.');
  return ctx;
};

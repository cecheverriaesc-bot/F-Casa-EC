import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { DEFAULT_CARD_OWNERS, DEFAULT_MANUAL_PAYER, DEFAULT_SPLIT_RATIO } from '../data/transactions';
import { computeSettlement, isExpenseNeutral } from '../lib/settlement';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [selectedCard, setSelectedCard] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  // false cuando localStorage no está disponible: los cambios sólo viven en memoria.
  const [persisted, setPersisted] = useState(true);
  const [settings, setSettings] = useState({
    splitRatio: DEFAULT_SPLIT_RATIO,
    cardOwners: DEFAULT_CARD_OWNERS,
    manualPayer: DEFAULT_MANUAL_PAYER,
  });

  // El store es la fuente de verdad: tras cada mutación se re-sincroniza todo
  // en vez de actualizar a mano, así el estado nunca se separa de lo guardado.
  const applyState = useCallback((next) => {
    setAllTransactions(next.transactions);
    setSettings(next.settings);
    setHistory(next.history);
    setPersisted(next.persisted);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      applyState(await api.getState());
      setError(null);
    } catch (e) {
      setError(e?.message ?? 'No se pudieron cargar los movimientos.');
    } finally {
      setLoading(false);
    }
  }, [applyState]);

  const updateSettings = useCallback(
    async (patch) => applyState(await api.saveSettings(patch)),
    [applyState],
  );

  const setCardOwner = useCallback(
    async (card, owner) => applyState(await api.saveSettings({ cardOwners: { [card]: owner } })),
    [applyState],
  );

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
    // Los adelantos y los pagos de tarjeta quedan fuera del gasto: no son consumo.
    const billableItems = billedTransactions.filter((t) => !isExpenseNeutral(t));

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

  // Cuadratura de la vista actual y, en paralelo, la del mes completo: el monto
  // que se transfieren de verdad es el global, no el de una tarjeta suelta.
  const settlement = useMemo(
    () => computeSettlement({ billedTransactions, ...settings }),
    [billedTransactions, settings],
  );

  const globalSettlement = useMemo(
    () => computeSettlement({ billedTransactions: allTransactions.filter((t) => !t.isUnbilled), ...settings }),
    [allTransactions, settings],
  );

  const addTransaction = useCallback(
    async (transaction) => applyState(await api.createTransaction(transaction)),
    [applyState],
  );

  const addTransactionsBulk = useCallback(
    async (transactions) => applyState(await api.createTransactionsBulk(transactions)),
    [applyState],
  );

  const updateTransaction = useCallback(
    async (id, updates, meta) => applyState(await api.updateTransaction(id, updates, meta)),
    [applyState],
  );

  const deleteTransaction = useCallback(
    async (id) => applyState(await api.deleteTransaction(id)),
    [applyState],
  );

  // Deshacer no borra el registro original: aplica el cambio inverso y lo deja
  // anotado como tal, para que la bitácora siga siendo fiel a lo que pasó.
  const undoHistoryEntry = useCallback(
    async (entry) => {
      if (entry.action === 'update') {
        const revert = Object.fromEntries(entry.changes.map((c) => [c.field, c.from]));
        applyState(await api.updateTransaction(entry.transactionId, revert, { viaUndo: true }));
      } else if (entry.action === 'delete' && entry.snapshot) {
        applyState(await api.restoreTransaction(entry.snapshot));
      } else if (entry.action === 'settings') {
        const patch = { cardOwners: {} };
        entry.changes.forEach((c) => {
          if (c.field.startsWith('cardOwner:')) patch.cardOwners[c.field.split(':')[1]] = c.from;
          else patch[c.field] = c.from;
        });
        applyState(await api.saveSettings(patch));
      }
    },
    [applyState],
  );

  const resetAll = useCallback(async () => applyState(await api.resetAll()), [applyState]);

  const value = useMemo(
    () => ({
      allTransactions,
      selectedCard,
      setSelectedCard,
      billedTransactions,
      unbilledTransactions,
      stats,
      settlement,
      globalSettlement,
      settings,
      updateSettings,
      setCardOwner,
      history,
      undoHistoryEntry,
      resetAll,
      persisted,
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
      settlement,
      globalSettlement,
      settings,
      updateSettings,
      setCardOwner,
      history,
      undoHistoryEntry,
      resetAll,
      persisted,
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

import { v4 as uuidv4 } from 'uuid';
import {
  ALL_TRANSACTIONS,
  DEFAULT_CARD_OWNERS,
  DEFAULT_MANUAL_PAYER,
  DEFAULT_SPLIT_RATIO,
  INITIAL_UNBILLED,
} from '../data/transactions';
import { clearStoredState, isStorageAvailable, readState, writeState } from './storage';

// ==========================================
// STORE PERSISTENTE
// Guarda en localStorage y lleva bitácora de todo cambio. Toda mutación pasa
// por acá, así que ninguna se puede quedar sin registrar. Para migrar a un
// backend real (Supabase u otro) basta con reemplazar el cuerpo de estos
// métodos por llamadas fetch: el contexto y los componentes no cambian.
// ==========================================

const STATE_VERSION = 1;
// Tope de la bitácora para que localStorage no crezca sin control.
const MAX_HISTORY = 500;

const seedState = () => ({
  version: STATE_VERSION,
  transactions: [...ALL_TRANSACTIONS, ...INITIAL_UNBILLED],
  settings: {
    splitRatio: DEFAULT_SPLIT_RATIO,
    cardOwners: { ...DEFAULT_CARD_OWNERS },
    manualPayer: DEFAULT_MANUAL_PAYER,
  },
  history: [],
});

let state = null;
let persisted = true;

const load = () => {
  if (state) return state;
  const stored = readState();
  state = stored?.version === STATE_VERSION && Array.isArray(stored.transactions) ? stored : seedState();
  return state;
};

const persist = () => {
  persisted = writeState(state);
};

// La bitácora es append-only y va de lo más nuevo a lo más viejo: deshacer un
// cambio no borra el registro original, agrega uno nuevo marcado `viaUndo`.
const pushHistory = (entry) => {
  state.history = [{ id: uuidv4(), at: new Date().toISOString(), ...entry }, ...state.history].slice(0, MAX_HISTORY);
};

const snapshot = () => ({
  transactions: state.transactions,
  settings: state.settings,
  history: state.history,
  persisted,
});

// `fromHints` permite registrar el valor que el usuario veía en pantalla cuando
// el campo estaba sin definir y la UI lo resolvía por defecto (p. ej. `paidBy`,
// que cae al pagador configurado). Sin esto la bitácora anotaría "— → Rina"
// para algo que se mostraba como "Carlos → Rina".
const diffFields = (current, updates, fromHints = {}) =>
  Object.entries(updates)
    .filter(([field, to]) => current[field] !== to)
    .map(([field, to]) => ({ field, from: current[field] ?? fromHints[field] ?? null, to }));

export const api = {
  getState: async () => {
    load();
    return snapshot();
  },

  createTransaction: async (t) => {
    load();
    state.transactions = [...state.transactions, t];
    pushHistory({
      action: 'create',
      target: t.description,
      transactionId: t.id,
      amount: t.amount,
    });
    persist();
    return snapshot();
  },

  createTransactionsBulk: async (txs) => {
    load();
    if (txs.length === 0) return snapshot();
    state.transactions = [...state.transactions, ...txs];
    pushHistory({
      action: 'bulk-create',
      count: txs.length,
      amount: txs.reduce((acc, t) => acc + t.amount, 0),
    });
    persist();
    return snapshot();
  },

  updateTransaction: async (id, updates, meta = {}) => {
    load();
    const current = state.transactions.find((x) => x.id === id);
    if (!current) return snapshot();

    const changes = diffFields(current, updates, meta.from);
    if (changes.length === 0) return snapshot();

    state.transactions = state.transactions.map((x) => (x.id === id ? { ...x, ...updates } : x));
    pushHistory({
      action: 'update',
      target: current.description,
      transactionId: id,
      changes,
      viaUndo: Boolean(meta.viaUndo),
    });
    persist();
    return snapshot();
  },

  deleteTransaction: async (id) => {
    load();
    const current = state.transactions.find((x) => x.id === id);
    state.transactions = state.transactions.filter((x) => x.id !== id);
    if (current) {
      pushHistory({
        action: 'delete',
        target: current.description,
        transactionId: id,
        amount: current.amount,
        // Se guarda el ítem completo para poder restaurarlo desde el historial.
        snapshot: current,
      });
    }
    persist();
    return snapshot();
  },

  restoreTransaction: async (tx) => {
    load();
    if (state.transactions.some((x) => x.id === tx.id)) return snapshot();
    state.transactions = [...state.transactions, tx];
    pushHistory({
      action: 'create',
      target: tx.description,
      transactionId: tx.id,
      amount: tx.amount,
      viaUndo: true,
    });
    persist();
    return snapshot();
  },

  saveSettings: async (patch) => {
    load();
    const before = state.settings;
    const next = { ...before, ...patch, cardOwners: { ...before.cardOwners, ...(patch.cardOwners ?? {}) } };

    const changes = [];
    if (next.splitRatio !== before.splitRatio) {
      changes.push({ field: 'splitRatio', from: before.splitRatio, to: next.splitRatio });
    }
    if (next.manualPayer !== before.manualPayer) {
      changes.push({ field: 'manualPayer', from: before.manualPayer, to: next.manualPayer });
    }
    Object.keys(next.cardOwners).forEach((card) => {
      if (next.cardOwners[card] !== before.cardOwners[card]) {
        changes.push({ field: `cardOwner:${card}`, from: before.cardOwners[card], to: next.cardOwners[card] });
      }
    });

    if (changes.length === 0) return snapshot();

    state.settings = next;
    pushHistory({ action: 'settings', changes });
    persist();
    return snapshot();
  },

  // Vuelve a los datos originales de la cartola y borra la bitácora.
  resetAll: async () => {
    clearStoredState();
    state = seedState();
    persist();
    return snapshot();
  },

  storageAvailable: () => isStorageAvailable(),
};

export default api;

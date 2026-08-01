import { ALL_TRANSACTIONS, INITIAL_UNBILLED } from '../data/transactions';

// ==========================================
// MOCK API
// Almacén en memoria que imita el contrato de un backend real. Cuando exista
// una API de verdad, basta con reemplazar el cuerpo de estos métodos por fetch.
// ==========================================
let mockBilled = [...ALL_TRANSACTIONS];
let mockUnbilled = [...INITIAL_UNBILLED];

export const api = {
  getTransactions: async () => [...mockBilled, ...mockUnbilled],

  createTransaction: async (t) => {
    if (t.isUnbilled) mockUnbilled.push(t);
    else mockBilled.push(t);
  },

  createTransactionsBulk: async (txs) => {
    txs.forEach((t) => {
      if (t.isUnbilled) mockUnbilled.push(t);
      else mockBilled.push(t);
    });
  },

  updateTransaction: async (id, updates) => {
    let t = mockUnbilled.find((x) => x.id === id);
    if (t) {
      Object.assign(t, updates);
      if (updates.isUnbilled === false) {
        mockUnbilled = mockUnbilled.filter((x) => x.id !== id);
        mockBilled.push(t);
      }
    } else {
      t = mockBilled.find((x) => x.id === id);
      if (t) Object.assign(t, updates);
    }
  },

  deleteTransaction: async (id) => {
    mockBilled = mockBilled.filter((x) => x.id !== id);
    mockUnbilled = mockUnbilled.filter((x) => x.id !== id);
  },
};

export default api;

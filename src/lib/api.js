import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

// ==========================================
// CAPA DE DATOS SOBRE SUPABASE
// Mantiene la misma interfaz que usaba el store local, así que el contexto y
// los componentes no cambian. Toda mutación registra su entrada en change_log,
// de modo que ninguna se pueda quedar sin bitácora.
// ==========================================

const MAX_HISTORY = 500;

// La base usa snake_case y la app camelCase.
const fromRow = (r) => ({
  id: r.id,
  date: r.date ?? undefined,
  description: r.description,
  amount: Number(r.amount),
  category: r.category,
  allocation: r.allocation ?? undefined,
  card: r.card,
  installment: r.installment ?? undefined,
  type: r.type ?? undefined,
  paidBy: r.paid_by ?? undefined,
  paymentMethod: r.payment_method ?? undefined,
  isInstallment: r.is_installment,
  isUnbilled: r.is_unbilled,
  ...(r.advance_from ? { from: r.advance_from } : {}),
  ...(r.advance_to ? { to: r.advance_to } : {}),
});

const toRow = (t, householdId) => ({
  id: t.id,
  household_id: householdId,
  date: t.date ?? null,
  description: t.description,
  amount: t.amount,
  category: t.category,
  allocation: t.allocation ?? null,
  card: t.card,
  installment: t.installment ?? null,
  type: t.type ?? null,
  paid_by: t.paidBy ?? null,
  payment_method: t.paymentMethod ?? null,
  is_installment: Boolean(t.isInstallment),
  is_unbilled: Boolean(t.isUnbilled),
  advance_from: t.from ?? null,
  advance_to: t.to ?? null,
});

const logFromRow = (r) => ({
  id: r.id,
  at: r.at,
  action: r.action,
  target: r.target ?? undefined,
  transactionId: r.transaction_id ?? undefined,
  changes: r.changes ?? undefined,
  amount: r.amount != null ? Number(r.amount) : undefined,
  count: r.item_count ?? undefined,
  viaUndo: r.via_undo,
  snapshot: r.snapshot ?? undefined,
  actorName: r.actor_name ?? undefined,
});

// Sesión y hogar actuales. Se resuelven una vez por sesión y se reutilizan.
let ctx = null;

const requireCtx = async () => {
  if (ctx) return ctx;
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('Sesión no iniciada.');

  const { data: member, error } = await supabase
    .from('household_members')
    .select('household_id, display_name')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!member) {
    throw new Error(
      `La cuenta ${user.email} no está habilitada en ningún hogar. Pide que agreguen tu correo antes de entrar.`,
    );
  }

  ctx = {
    userId: user.id,
    householdId: member.household_id,
    actorName: member.display_name || user.email?.split('@')[0] || 'alguien',
  };
  return ctx;
};

export const resetContext = () => {
  ctx = null;
};

const writeLog = async (entry) => {
  const { householdId, userId, actorName } = await requireCtx();
  const { error } = await supabase.from('change_log').insert({
    household_id: householdId,
    actor_id: userId,
    actor_name: actorName,
    action: entry.action,
    target: entry.target ?? null,
    transaction_id: entry.transactionId ?? null,
    changes: entry.changes ?? null,
    amount: entry.amount ?? null,
    item_count: entry.count ?? null,
    via_undo: Boolean(entry.viaUndo),
    snapshot: entry.snapshot ?? null,
  });
  if (error) throw error;
};

const snapshot = async () => {
  const { householdId } = await requireCtx();

  const [tx, settings, log] = await Promise.all([
    supabase.from('transactions').select('*').eq('household_id', householdId),
    supabase.from('household_settings').select('*').eq('household_id', householdId).maybeSingle(),
    supabase
      .from('change_log').select('*').eq('household_id', householdId)
      .order('at', { ascending: false }).limit(MAX_HISTORY),
  ]);

  if (tx.error) throw tx.error;
  if (settings.error) throw settings.error;
  if (log.error) throw log.error;

  return {
    transactions: (tx.data ?? []).map(fromRow),
    settings: {
      splitRatio: Number(settings.data?.split_ratio ?? 0.5),
      cardOwners: settings.data?.card_owners ?? {},
      manualPayer: settings.data?.manual_payer ?? 'Carlos',
    },
    history: (log.data ?? []).map(logFromRow),
    persisted: true,
  };
};

const diffFields = (current, updates, fromHints = {}) =>
  Object.entries(updates)
    .filter(([field, to]) => (current[field] ?? null) !== (to ?? null))
    .map(([field, to]) => ({ field, from: current[field] ?? fromHints[field] ?? null, to }));

export const api = {
  getState: async () => snapshot(),

  createTransaction: async (t) => {
    const { householdId } = await requireCtx();
    const { error } = await supabase.from('transactions').insert(toRow(t, householdId));
    if (error) throw error;
    await writeLog({ action: 'create', target: t.description, transactionId: t.id, amount: t.amount });
    return snapshot();
  },

  createTransactionsBulk: async (txs) => {
    if (txs.length === 0) return snapshot();
    const { householdId } = await requireCtx();
    const { error } = await supabase.from('transactions').insert(txs.map((t) => toRow(t, householdId)));
    if (error) throw error;
    await writeLog({
      action: 'bulk-create',
      count: txs.length,
      amount: txs.reduce((acc, t) => acc + t.amount, 0),
    });
    return snapshot();
  },

  updateTransaction: async (id, updates, meta = {}) => {
    const { householdId } = await requireCtx();
    const { data: existing, error: readError } = await supabase
      .from('transactions').select('*').eq('id', id).maybeSingle();
    if (readError) throw readError;
    if (!existing) return snapshot();

    const current = fromRow(existing);
    const changes = diffFields(current, updates, meta.from);
    if (changes.length === 0) return snapshot();

    const { error } = await supabase
      .from('transactions')
      .update({ ...toRow({ ...current, ...updates }, householdId), updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;

    await writeLog({
      action: 'update',
      target: current.description,
      transactionId: id,
      changes,
      viaUndo: Boolean(meta.viaUndo),
    });
    return snapshot();
  },

  deleteTransaction: async (id) => {
    const { data: existing } = await supabase.from('transactions').select('*').eq('id', id).maybeSingle();
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    if (existing) {
      const current = fromRow(existing);
      await writeLog({
        action: 'delete',
        target: current.description,
        transactionId: id,
        amount: current.amount,
        snapshot: current,
      });
    }
    return snapshot();
  },

  restoreTransaction: async (tx) => {
    const { householdId } = await requireCtx();
    const { error } = await supabase.from('transactions').upsert(toRow(tx, householdId));
    if (error) throw error;
    await writeLog({
      action: 'create', target: tx.description, transactionId: tx.id, amount: tx.amount, viaUndo: true,
    });
    return snapshot();
  },

  saveSettings: async (patch) => {
    const { householdId } = await requireCtx();
    const { data: row, error: readError } = await supabase
      .from('household_settings').select('*').eq('household_id', householdId).maybeSingle();
    if (readError) throw readError;

    const before = {
      splitRatio: Number(row?.split_ratio ?? 0.5),
      cardOwners: row?.card_owners ?? {},
      manualPayer: row?.manual_payer ?? 'Carlos',
    };
    const next = {
      ...before,
      ...patch,
      cardOwners: { ...before.cardOwners, ...(patch.cardOwners ?? {}) },
    };

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

    const { error } = await supabase.from('household_settings').upsert({
      household_id: householdId,
      split_ratio: next.splitRatio,
      card_owners: next.cardOwners,
      manual_payer: next.manualPayer,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;

    await writeLog({ action: 'settings', changes });
    return snapshot();
  },

  // Sin equivalente seguro contra una base compartida: restaurar los datos
  // originales borraría el trabajo de la otra persona.
  resetAll: async () => {
    throw new Error('Con la base compartida, revertir cambios se hace uno a uno desde el historial.');
  },

  newId: () => uuidv4(),
};

export default api;

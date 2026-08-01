import { useMemo, useState } from 'react';
import { AlertTriangle, CalendarCheck, Check, ChevronDown, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useTransactions } from '../context/TransactionContext';
import { CURRENT_PERIOD, PAYMENT_METHODS, PEOPLE, RECURRING_TEMPLATES } from '../data/transactions';
import { formatCurrency } from '../lib/format';

const pad = (n) => String(n).padStart(2, '0');
const dateFor = (day) => `${pad(day)}/${pad(CURRENT_PERIOD.month)}/${CURRENT_PERIOD.year}`;

const RecurringPanel = () => {
  const { allTransactions, addTransaction, settings } = useTransactions();
  const [open, setOpen] = useState(null);
  const [drafts, setDrafts] = useState({});

  // Un fijo está cargado si ya existe un movimiento manual con esa descripción.
  const rows = useMemo(() => {
    const manual = allTransactions.filter((t) => t.card === 'manual' && !t.isUnbilled);
    return RECURRING_TEMPLATES.map((tpl) => ({
      ...tpl,
      loaded: manual.find((t) => t.description === tpl.description) ?? null,
    }));
  }, [allTransactions]);

  const missing = rows.filter((r) => !r.loaded);
  const needsAmount = missing.filter((r) => r.amount === null);
  // Se abre solo cuando falta algo; si está todo cargado, parte cerrado.
  const isOpen = open ?? missing.length > 0;

  const draftFor = (row) => drafts[row.key] ?? {
    amount: row.amount === null ? '' : String(row.amount),
    paidBy: settings.manualPayer,
    paymentMethod: row.paymentMethod,
  };

  const patchDraft = (key, patch) =>
    setDrafts((prev) => ({ ...prev, [key]: { ...(prev[key] ?? {}), ...patch } }));

  const handleAdd = async (row) => {
    const draft = draftFor(row);
    const amount = parseInt(draft.amount, 10);
    if (!Number.isFinite(amount) || amount <= 0) return;
    await addTransaction({
      id: `man-${uuidv4()}`,
      date: dateFor(row.day),
      description: row.description,
      amount: -Math.abs(amount),
      category: row.category,
      allocation: row.allocation,
      paidBy: draft.paidBy,
      paymentMethod: draft.paymentMethod,
      card: 'manual',
      isInstallment: false,
      isUnbilled: false,
    });
  };

  return (
    <div
      className={`max-w-6xl mx-auto mb-4 rounded-xl shadow-sm border overflow-hidden ${
        missing.length > 0 ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-slate-200'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-2 px-5 py-3 text-left hover:bg-black/5 transition-colors"
      >
        <span className="font-semibold text-slate-700 flex items-center gap-2">
          <CalendarCheck size={18} /> Gastos fijos de {CURRENT_PERIOD.label}
        </span>
        <span className="flex items-center gap-3 text-xs">
          {missing.length > 0 ? (
            <span className="flex items-center gap-1.5 font-bold text-amber-700">
              <AlertTriangle size={14} /> Faltan {missing.length} por cargar
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-bold text-emerald-600">
              <Check size={14} /> Todos cargados
            </span>
          )}
          <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-black/5">
          <p className="text-xs text-slate-500 mb-4">
            No llegan en ninguna cartola: salen en efectivo, débito o transferencia. Este checklist evita que se
            queden fuera del cierre.
          </p>

          <ul className="space-y-2">
            {rows.map((row) => {
              const draft = draftFor(row);
              const parsed = parseInt(draft.amount, 10);
              const canAdd = Number.isFinite(parsed) && parsed > 0;

              return (
                <li
                  key={row.key}
                  className={`rounded-lg border p-3 ${
                    row.loaded ? 'bg-white border-slate-200' : 'bg-white border-amber-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {row.loaded ? (
                          <Check size={15} className="text-emerald-500 shrink-0" />
                        ) : (
                          <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                        )}
                        <span className="font-medium text-slate-800 text-sm">{row.description}</span>
                      </div>
                      {row.note && <p className="text-[11px] text-slate-400 mt-0.5 ml-6">{row.note}</p>}
                    </div>

                    {row.loaded ? (
                      <div className="flex items-center gap-3 text-sm">
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                            PAYMENT_METHODS[row.loaded.paymentMethod ?? row.paymentMethod]?.badge ?? ''
                          }`}
                        >
                          {PAYMENT_METHODS[row.loaded.paymentMethod ?? row.paymentMethod]?.short}
                        </span>
                        <span className="font-bold text-slate-700">
                          {formatCurrency(Math.abs(row.loaded.amount))}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder={row.amount === null ? 'Monto pendiente' : 'Monto'}
                          value={draft.amount}
                          onChange={(e) => patchDraft(row.key, { amount: e.target.value })}
                          aria-label={`Monto de ${row.description}`}
                          className="w-36 rounded-md border-slate-300 shadow-sm text-sm p-1.5 focus:border-amber-500 focus:ring-amber-500"
                        />
                        <select
                          value={draft.paymentMethod}
                          onChange={(e) => patchDraft(row.key, { paymentMethod: e.target.value })}
                          aria-label={`Medio de pago de ${row.description}`}
                          className="rounded-md border-slate-300 shadow-sm text-xs p-1.5 focus:border-amber-500 focus:ring-amber-500"
                        >
                          {Object.entries(PAYMENT_METHODS)
                            .filter(([k]) => k !== 'credito')
                            .map(([k, v]) => (
                              <option key={k} value={k}>
                                {v.label}
                              </option>
                            ))}
                        </select>
                        <select
                          value={draft.paidBy}
                          onChange={(e) => patchDraft(row.key, { paidBy: e.target.value })}
                          aria-label={`Quién paga ${row.description}`}
                          className="rounded-md border-slate-300 shadow-sm text-xs p-1.5 focus:border-amber-500 focus:ring-amber-500"
                        >
                          {PEOPLE.map((p) => (
                            <option key={p} value={p}>
                              Paga {p}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleAdd(row)}
                          disabled={!canAdd}
                          className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-amber-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                        >
                          <Plus size={13} /> Cargar
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {needsAmount.length > 0 && (
            <p className="text-xs text-amber-800 bg-amber-100/70 border border-amber-200 rounded-md p-3 mt-4">
              <strong>{needsAmount.length} sin monto definido</strong> ({needsAmount.map((r) => r.description).join(', ')}).
              Escribe la cifra y quedan cargados. Si son iguales todos los meses, déjalos fijos en{' '}
              <code className="text-[11px]">RECURRING_TEMPLATES</code> y se precargan solos.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecurringPanel;

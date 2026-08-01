import { useState } from 'react';
import {
  AlertTriangle, ChevronDown, History, PenLine, Plus, RotateCcw, Settings2, Trash2, Upload,
} from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { CARD_LABELS, PAYMENT_METHODS } from '../data/transactions';
import { formatCurrency } from '../lib/format';

const FIELD_LABELS = {
  category: 'Categoría',
  allocation: 'Asignación',
  paidBy: 'Pagó',
  paymentMethod: 'Medio de pago',
  amount: 'Monto',
  description: 'Descripción',
  date: 'Fecha',
  isUnbilled: 'Estado',
  splitRatio: 'Reparto de Casa',
  manualPayer: 'Pagador por defecto',
};

const fieldLabel = (field) => {
  if (field.startsWith('cardOwner:')) {
    const card = field.split(':')[1];
    return `Titular ${CARD_LABELS[card] ?? card}`;
  }
  return FIELD_LABELS[field] ?? field;
};

const formatValue = (field, value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (field === 'amount') return formatCurrency(value);
  if (field === 'paymentMethod') return PAYMENT_METHODS[value]?.label ?? value;
  if (field === 'isUnbilled') return value ? 'Por facturar' : 'Facturado';
  if (field === 'splitRatio') return `${Math.round(value * 100)}%`;
  return String(value);
};

const ACTION_META = {
  create: { Icon: Plus, tone: 'text-emerald-600 bg-emerald-50' },
  'bulk-create': { Icon: Upload, tone: 'text-sky-600 bg-sky-50' },
  update: { Icon: PenLine, tone: 'text-blue-600 bg-blue-50' },
  delete: { Icon: Trash2, tone: 'text-red-600 bg-red-50' },
  settings: { Icon: Settings2, tone: 'text-slate-600 bg-slate-100' },
};

const stamp = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('es-CL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const EntryBody = ({ entry }) => {
  switch (entry.action) {
    case 'create':
      return (
        <>
          Agregaste <strong className="text-slate-800">{entry.target}</strong>
          {entry.amount != null && <> por {formatCurrency(Math.abs(entry.amount))}</>}
        </>
      );
    case 'bulk-create':
      return (
        <>
          Importaste <strong className="text-slate-800">{entry.count} movimientos</strong>
          {entry.amount != null && <> por {formatCurrency(Math.abs(entry.amount))}</>}
        </>
      );
    case 'delete':
      return (
        <>
          Eliminaste <strong className="text-slate-800">{entry.target}</strong>
          {entry.amount != null && <> ({formatCurrency(Math.abs(entry.amount))})</>}
        </>
      );
    case 'settings':
      return (
        <>
          <strong className="text-slate-800">Configuración</strong>
          {entry.changes.map((c) => (
            <span key={c.field} className="block">
              {fieldLabel(c.field)}: {formatValue(c.field, c.from)} → <strong>{formatValue(c.field, c.to)}</strong>
            </span>
          ))}
        </>
      );
    case 'update':
    default:
      return (
        <>
          <strong className="text-slate-800">{entry.target}</strong>
          {entry.changes.map((c) => (
            <span key={c.field} className="block">
              {fieldLabel(c.field)}: {formatValue(c.field, c.from)} → <strong>{formatValue(c.field, c.to)}</strong>
            </span>
          ))}
        </>
      );
  }
};

const HistoryPanel = () => {
  const { history, undoHistoryEntry, persisted } = useTransactions();
  const [open, setOpen] = useState(false);

  const canUndo = (e) =>
    e.action === 'update' || e.action === 'settings' || (e.action === 'delete' && e.snapshot);

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-5 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-700 flex items-center gap-2">
          <History size={18} /> Historial de cambios
          {history.length > 0 && (
            <span className="text-xs font-bold bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">
              {history.length}
            </span>
          )}
        </span>
        <span className="flex items-center gap-3 text-xs text-slate-500">
          {!persisted && (
            <span className="flex items-center gap-1 text-amber-600 font-bold">
              <AlertTriangle size={13} /> Sin guardar
            </span>
          )}
          <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100">
          {!persisted && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
              No se pudo guardar en la base. Revisa tu conexión: los cambios podrían no haberse registrado.
            </p>
          )}

          {history.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">
              Todavía no hay cambios. Todo lo que edites queda registrado acá.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto -mx-2 px-2">
              {history.map((entry) => {
                const { Icon, tone } = ACTION_META[entry.action] ?? ACTION_META.update;
                return (
                  <li key={entry.id} className="flex items-start gap-3 py-2.5">
                    <span className={`shrink-0 mt-0.5 p-1.5 rounded-md ${tone}`}>
                      <Icon size={13} />
                    </span>
                    <div className="min-w-0 flex-1 text-xs text-slate-500 leading-relaxed">
                      <EntryBody entry={entry} />
                      {entry.actorName && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">por {entry.actorName}</span>
                      )}
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {entry.viaUndo && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">deshacer</span>
                      )}
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">{stamp(entry.at)}</span>
                      {canUndo(entry) && (
                        <button
                          type="button"
                          onClick={() => undoHistoryEntry(entry)}
                          title="Revertir este cambio"
                          className="text-slate-300 hover:text-blue-600 transition-colors"
                        >
                          <RotateCcw size={14} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Los cambios se guardan en la base compartida y los ven todos. Se muestran los últimos 500 registros;
              para revertir algo, usa el ↺ de esa línea.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;

import { useState } from 'react';
import { ChevronDown, CreditCard, Settings2 } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { CARD_LABELS, PEOPLE } from '../data/transactions';

const CARDS = ['9979', '6259'];

const PersonSelect = ({ id, label, value, onChange }) => (
  <label htmlFor={id} className="flex flex-col gap-1">
    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border-slate-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 p-2"
    >
      {PEOPLE.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  </label>
);

const SettingsPanel = () => {
  const { settings, updateSettings, setCardOwner } = useTransactions();
  const [open, setOpen] = useState(false);

  const [first, second] = PEOPLE;
  const firstPct = Math.round(settings.splitRatio * 100);

  const handlePct = (raw) => {
    const pct = Math.min(100, Math.max(0, Number(raw)));
    if (Number.isFinite(pct)) updateSettings({ splitRatio: pct / 100 });
  };

  return (
    <div className="max-w-6xl mx-auto mb-4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-5 py-3 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-700 flex items-center gap-2">
          <Settings2 size={18} /> Configuración del reparto
        </span>
        <span className="flex items-center gap-3 text-xs text-slate-500">
          <span className="hidden sm:inline">
            {first} {firstPct}% / {second} {100 - firstPct}% · {CARD_LABELS['9979']}:{' '}
            {settings.cardOwners['9979']} · {CARD_LABELS['6259']}: {settings.cardOwners['6259']}
          </span>
          <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <label htmlFor="split-ratio" className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              % de Casa que asume {first}
            </span>
            <div className="flex items-center gap-2">
              <input
                id="split-ratio"
                type="number"
                min="0"
                max="100"
                step="1"
                value={firstPct}
                onChange={(e) => handlePct(e.target.value)}
                className="w-24 rounded-md border-slate-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
              <span className="text-sm text-slate-500">
                / {second} {100 - firstPct}%
              </span>
            </div>
          </label>

          {CARDS.map((card) => (
            <PersonSelect
              key={card}
              id={`owner-${card}`}
              label={`Titular ${CARD_LABELS[card]} (${card})`}
              value={settings.cardOwners[card]}
              onChange={(owner) => setCardOwner(card, owner)}
            />
          ))}

          <PersonSelect
            id="manual-payer"
            label="Paga gastos fijos por defecto"
            value={settings.manualPayer}
            onChange={(manualPayer) => updateSettings({ manualPayer })}
          />

          <p className="sm:col-span-2 lg:col-span-4 text-xs text-slate-500 flex items-start gap-2 bg-slate-50 rounded-md p-3">
            <CreditCard size={14} className="mt-0.5 shrink-0" />
            Lo cargado a una tarjeta lo desembolsa su titular. Los gastos fijos se pueden reasignar uno a uno
            desde la columna «Pagó» de la tabla; los que no tengan pagador propio usan el valor por defecto.
          </p>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;

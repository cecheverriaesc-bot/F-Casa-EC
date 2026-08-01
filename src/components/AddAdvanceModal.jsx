import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useTransactions } from '../context/TransactionContext';
import { PEOPLE } from '../data/transactions';
import { isoToDisplayDate, todayAsIso } from '../lib/format';

const emptyForm = () => ({
  from: PEOPLE[1],
  to: PEOPLE[0],
  amount: '',
  date: todayAsIso(),
  description: '',
});

const AddAdvanceModal = ({ isOpen, onClose }) => {
  const { addTransaction } = useTransactions();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isOpen) setForm(emptyForm());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const amountValue = parseInt(form.amount, 10);
  const isValid = Number.isFinite(amountValue) && amountValue > 0 && form.from !== form.to;

  // Se invierte el par para que nunca queden emisor y receptor iguales.
  const swap = () => setForm((f) => ({ ...f, from: f.to, to: f.from }));

  const handleSubmit = async () => {
    if (!isValid) return;
    await addTransaction({
      id: `adv-${uuidv4()}`,
      type: 'advance',
      category: 'Adelantos',
      from: form.from,
      to: form.to,
      amount: Math.abs(amountValue),
      date: isoToDisplayDate(form.date),
      description: form.description.trim(),
      card: 'manual',
      allocation: 'Casa',
      isInstallment: false,
      isUnbilled: false,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-advance-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 id="add-advance-title" className="font-bold text-slate-800">
            Registrar Adelanto entre Partes
          </h3>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 bg-sky-50 border border-sky-100 rounded-md p-3">
            Una transferencia de una parte a la otra a cuenta del mes. No suma al gasto de la casa: sólo descuenta
            del balance final.
          </p>

          <div className="flex items-end gap-2">
            <label htmlFor="advance-from" className="flex-1 flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Transfiere</span>
              <select
                id="advance-from"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
              >
                {PEOPLE.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={swap}
              aria-label="Invertir emisor y receptor"
              className="mb-1 p-2 text-slate-400 hover:text-sky-600 transition-colors"
            >
              <ArrowRight size={18} />
            </button>
            <label htmlFor="advance-to" className="flex-1 flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Recibe</span>
              <select
                id="advance-to"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
              >
                {PEOPLE.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {form.from === form.to && (
            <p className="text-xs text-red-600">Emisor y receptor deben ser distintos.</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              min="1"
              placeholder="Monto ($)"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <input
              type="date"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <input
            type="text"
            placeholder="Motivo (opcional): mitad del arriendo..."
            className="w-full rounded-md border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-700">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md disabled:opacity-50 transition-colors"
          >
            Guardar Adelanto
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdvanceModal;

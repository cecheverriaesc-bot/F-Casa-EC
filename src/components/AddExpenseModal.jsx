import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useTransactions } from '../context/TransactionContext';
import { COLORS, DEFAULT_MANUAL_METHOD, PAYMENT_METHODS, PEOPLE } from '../data/transactions';
import { isoToDisplayDate, todayAsIso } from '../lib/format';

const emptyForm = (paidBy) => ({
  description: '',
  amount: '',
  date: todayAsIso(),
  category: 'Vivienda',
  allocation: 'Casa',
  paidBy,
  paymentMethod: DEFAULT_MANUAL_METHOD,
});

const AddExpenseModal = ({ isOpen, onClose }) => {
  const { addTransaction, settings } = useTransactions();
  const [form, setForm] = useState(() => emptyForm(settings.manualPayer));

  // Cada apertura parte con el formulario limpio y la fecha de hoy.
  useEffect(() => {
    if (isOpen) setForm(emptyForm(settings.manualPayer));
  }, [isOpen, settings.manualPayer]);

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
  const isValid = form.description.trim().length > 0 && Number.isFinite(amountValue) && amountValue !== 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    await addTransaction({
      id: `man-${uuidv4()}`,
      ...form,
      // Se guarda en DD/MM/YYYY, igual que el resto de los movimientos.
      date: isoToDisplayDate(form.date),
      amount: -Math.abs(amountValue),
      card: 'manual',
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
      aria-labelledby="add-expense-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 id="add-expense-title" className="font-bold text-slate-800">
            Agregar Gasto Fijo / Transferencia
          </h3>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Descripción..."
            className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value.toUpperCase() })}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Monto ($)"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <input
              type="date"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={form.allocation}
              onChange={(e) => setForm({ ...form, allocation: e.target.value })}
            >
              <option value="Casa">Casa (50/50)</option>
              <option value="Carlos">Carlos (100%)</option>
              <option value="Rina">Rina (100%)</option>
            </select>
            <select
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {Object.keys(COLORS)
                .filter((c) => c !== 'Adelantos')
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label htmlFor="expense-paid-by" className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">¿Quién pagó?</span>
              <select
                id="expense-paid-by"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                value={form.paidBy}
                onChange={(e) => setForm({ ...form, paidBy: e.target.value })}
              >
                {PEOPLE.map((p) => (
                  <option key={p} value={p}>
                    Pagó {p}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="expense-method" className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Medio de pago</span>
              <select
                id="expense-method"
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              >
                {Object.entries(PAYMENT_METHODS)
                  .filter(([k]) => k !== 'credito')
                  .map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-700">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 py-2 bg-slate-800 text-white rounded-md disabled:opacity-50"
          >
            Guardar Gasto
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;

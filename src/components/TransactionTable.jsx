import { useState } from 'react';
import { Calendar, Clock, ShoppingCart, Trash2 } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { ALLOCATION_COLORS, COLORS, PAYMENT_METHODS, PEOPLE } from '../data/transactions';
import { formatCurrency } from '../lib/format';
import { isAdvance, isPayerEditable, resolvePaidBy, resolvePaymentMethod } from '../lib/settlement';
import UnbilledImporter from './UnbilledImporter';

const NEXT_ALLOCATION = { Casa: 'Carlos', Carlos: 'Rina', Rina: 'Casa' };

// Categorías reasignables a mano: 'Pago Tarjeta' y 'Adelantos' las fija el
// sistema, así que no se ofrecen como opción.
const CATEGORY_OPTIONS = Object.keys(COLORS).filter((c) => c !== 'Pago Tarjeta' && c !== 'Adelantos');

const TransactionTable = () => {
  const { billedTransactions, unbilledTransactions, selectedCard, settings, updateTransaction, deleteTransaction } =
    useTransactions();
  const [viewMode, setViewMode] = useState('daily');

  // Los adelantos son movimientos de cuadratura, no gasto: viven en el panel de cierre.
  const currentDaily = billedTransactions.filter((t) => !t.isInstallment && !isAdvance(t));
  const currentInstallments = billedTransactions.filter((t) => t.isInstallment);

  const getActiveData = () => {
    if (viewMode === 'daily') return currentDaily;
    if (viewMode === 'installments') return currentInstallments;
    return unbilledTransactions;
  };

  const handleCycleAllocation = (id, current) => {
    updateTransaction(id, { allocation: NEXT_ALLOCATION[current] || 'Casa' });
  };

  // Alterna el pagador entre las partes; sólo aplica a gastos manuales.
  const handleCyclePayer = (t) => {
    const current = resolvePaidBy(t, settings);
    const next = PEOPLE[(PEOPLE.indexOf(current) + 1) % PEOPLE.length];
    updateTransaction(t.id, { paidBy: next });
  };

  const activeData = getActiveData();

  // Las clases van escritas completas a propósito: Tailwind no detecta nombres
  // de clase construidos por interpolación y no generaría el CSS.
  const TAB_BASE = 'flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors';
  const TAB_IDLE = 'text-slate-500 hover:bg-slate-50';

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[650px]">
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setViewMode('daily')}
          className={`${TAB_BASE} ${viewMode === 'daily' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : TAB_IDLE}`}
        >
          <ShoppingCart size={16} /> Movimientos ({currentDaily.filter((t) => t.type !== 'payment').length})
        </button>
        <button
          type="button"
          onClick={() => setViewMode('installments')}
          className={`${TAB_BASE} ${viewMode === 'installments' ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50/50' : TAB_IDLE}`}
        >
          <Calendar size={16} /> Cuotas ({currentInstallments.length})
        </button>
        <button
          type="button"
          onClick={() => setViewMode('unbilled')}
          className={`${TAB_BASE} ${viewMode === 'unbilled' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/50' : TAB_IDLE}`}
        >
          <Clock size={16} /> Por Facturar ({unbilledTransactions.length})
        </button>
      </div>
      <div className="flex-1 overflow-auto p-0 flex flex-col">
        {viewMode === 'unbilled' && <UnbilledImporter />}
        {/* El min-w evita que en móvil se recorten Cat/Asignación/Monto: se
            desplazan horizontalmente en vez de quedar inalcanzables. */}
        <table className="w-full min-w-[660px] text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm z-10">
            <tr>
              {viewMode !== 'installments' && <th className="px-4 py-3 font-medium w-[90px]">Fecha</th>}
              <th className="px-4 py-3 font-medium">Descripción</th>
              {viewMode === 'installments' && <th className="px-4 py-3 font-medium text-center w-[80px]">Cuota</th>}
              <th className="px-4 py-3 font-medium text-center w-[100px]">Cat</th>
              <th className="px-4 py-3 font-medium text-center w-[90px]">Asignación</th>
              <th className="px-4 py-3 font-medium text-center w-[85px]">Pagó</th>
              <th className="px-4 py-3 font-medium text-right w-[100px]">Monto</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeData.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                {viewMode !== 'installments' && (
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">{t.date}</td>
                )}
                <td className="px-4 py-3 font-medium text-slate-800">
                  <div className="flex flex-col">
                    <span className="truncate max-w-[200px] md:max-w-[250px]" title={t.description}>
                      {t.description}
                    </span>
                    {/* En los manuales importa el medio de pago; en los de
                        tarjeta, de cuál salió. */}
                    {t.card === 'manual' ? (
                      <span className="text-[9px] font-bold tracking-wider mt-0.5 text-emerald-600">
                        {PAYMENT_METHODS[resolvePaymentMethod(t)]?.short}
                      </span>
                    ) : (
                      selectedCard === 'all' && (
                        <span className="text-[9px] font-bold tracking-wider mt-0.5 text-slate-400">
                          TER {t.card}
                        </span>
                      )
                    )}
                    {t.type === 'payment' && <span className="text-[10px] text-green-600 font-bold">Pago Cancelado</span>}
                    {t.type === 'refund' && (
                      <span className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">Devolución</span>
                    )}
                  </div>
                </td>
                {viewMode === 'installments' && (
                  <td className="px-4 py-3 text-center text-xs font-medium text-slate-500 bg-slate-50">{t.installment}</td>
                )}
                <td className="px-4 py-3 text-center">
                  {t.type === 'payment' ? (
                    <span
                      className="px-2 py-1 rounded-full text-[10px] font-bold text-white whitespace-nowrap"
                      style={{ backgroundColor: COLORS[t.category] || '#94a3b8' }}
                    >
                      {t.category}
                    </span>
                  ) : (
                    // Editable en línea: reclasificar es parte del cierre mensual.
                    <select
                      value={t.category}
                      onChange={(e) => updateTransaction(t.id, { category: e.target.value })}
                      aria-label={`Categoría de ${t.description}`}
                      title="Cambiar categoría"
                      className="appearance-none bg-none border-0 px-2 py-1 rounded-full text-[10px] font-bold text-white cursor-pointer max-w-[110px] truncate focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
                      style={{ backgroundColor: COLORS[t.category] || '#94a3b8' }}
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c} className="bg-white text-slate-800 font-medium">
                          {c}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {t.type !== 'payment' ? (
                    <button
                      type="button"
                      onClick={() => handleCycleAllocation(t.id, t.allocation)}
                      title="Cambiar asignación"
                      className={`px-2 py-1 text-[11px] font-bold rounded border transition-all shadow-sm ${
                        ALLOCATION_COLORS[t.allocation]
                      }`}
                    >
                      {t.allocation}
                    </button>
                  ) : (
                    <span className="text-slate-300 text-xs">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {t.type === 'payment' ? (
                    <span className="text-slate-300 text-xs">-</span>
                  ) : isPayerEditable(t) ? (
                    <button
                      type="button"
                      onClick={() => handleCyclePayer(t)}
                      title="Cambiar quién desembolsó este gasto"
                      className={`px-2 py-1 text-[11px] font-bold rounded border transition-all shadow-sm ${
                        ALLOCATION_COLORS[resolvePaidBy(t, settings)]
                      }`}
                    >
                      {resolvePaidBy(t, settings)}
                    </button>
                  ) : (
                    // Lo define el titular de la tarjeta, no el ítem.
                    <span
                      title={`Titular de la tarjeta ${t.card} — se cambia en Configuración`}
                      className="px-2 py-1 text-[11px] font-medium rounded border border-slate-200 bg-slate-50 text-slate-500 whitespace-nowrap"
                    >
                      {resolvePaidBy(t, settings)}
                    </span>
                  )}
                </td>
                <td className={`px-4 py-3 text-right font-bold ${t.amount > 0 ? 'text-green-600' : 'text-slate-700'}`}>
                  {formatCurrency(t.amount)}
                </td>
                <td className="px-2 py-3 text-center">
                  <button
                    type="button"
                    aria-label={`Eliminar ${t.description}`}
                    onClick={() => {
                      if (window.confirm('¿Eliminar?')) deleteTransaction(t.id);
                    }}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {activeData.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-10">
            No hay movimientos en esta vista.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;

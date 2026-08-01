import { ArrowRight, Calculator, HandCoins, Plus, Trash2 } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { PEOPLE } from '../data/transactions';
import { formatCurrency } from '../lib/format';

const PERSON_STYLES = {
  Carlos: { title: 'text-blue-300', amount: 'text-blue-400' },
  Rina: { title: 'text-fuchsia-300', amount: 'text-fuchsia-400' },
};

const PersonCard = ({ person, settlement }) => {
  const style = PERSON_STYLES[person] ?? { title: 'text-slate-300', amount: 'text-slate-200' };
  const balance = settlement.balance[person];
  const advPaid = settlement.advancesPaid[person];
  const advReceived = settlement.advancesReceived[person];

  return (
    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 shadow-inner">
      <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${style.title}`}>Aporte {person}</h4>

      <div className="flex justify-between text-sm text-slate-300 mb-1">
        <span>Cuota de Casa Compartida:</span>
        <span>{formatCurrency(settlement.casaShare[person])}</span>
      </div>
      <div className="flex justify-between text-sm text-slate-300 mb-2">
        <span>Extras Personales (100%):</span>
        <span>{formatCurrency(settlement.personal[person])}</span>
      </div>
      <div className="flex justify-between text-sm font-semibold text-white border-t border-slate-600/70 pt-2 mb-3">
        <span>Le corresponde:</span>
        <span>{formatCurrency(settlement.responsibility[person])}</span>
      </div>

      <div className="flex justify-between text-sm text-slate-300 mb-1">
        <span>Desembolsó (tarjetas + cuentas):</span>
        <span className="text-emerald-300">{formatCurrency(settlement.outlay[person])}</span>
      </div>
      {advPaid > 0 && (
        <div className="flex justify-between text-xs text-sky-300 mb-1">
          <span>Adelantos entregados:</span>
          <span>+{formatCurrency(advPaid)}</span>
        </div>
      )}
      {advReceived > 0 && (
        <div className="flex justify-between text-xs text-sky-300 mb-1">
          <span>Adelantos recibidos:</span>
          <span>-{formatCurrency(advReceived)}</span>
        </div>
      )}

      <div className="flex justify-between text-xl font-bold text-white border-t border-slate-600 pt-3 mt-2">
        <span>Balance:</span>
        <span className={balance >= 0 ? style.amount : 'text-amber-400'}>
          {balance > 0 ? '+' : ''}
          {formatCurrency(balance)}
        </span>
      </div>
      <p className="text-[11px] text-slate-400 mt-1">
        {balance > 0
          ? 'Puso más de lo que le tocaba: le deben esta diferencia.'
          : balance < 0
            ? 'Puso menos de lo que le tocaba: debe esta diferencia.'
            : 'Está en cero.'}
      </p>
    </div>
  );
};

const SettlementPanel = ({ onRegisterAdvance }) => {
  const { settlement, globalSettlement, selectedCard, deleteTransaction } = useTransactions();
  const { settleUp, advances } = settlement;

  const isPartialView = selectedCard !== 'all';
  const globalAmount = globalSettlement.settleUp?.amount ?? 0;

  return (
    <div className="max-w-6xl mx-auto mb-8 bg-slate-800 text-white p-5 rounded-xl shadow-md border border-slate-700">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-emerald-400">
          <Calculator size={18} /> Cierre Mensual Exacto: ¿Cuánto le toca pagar a cada uno?
        </h3>
        <button
          type="button"
          onClick={onRegisterAdvance}
          className="flex items-center gap-1.5 text-xs bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded transition-colors font-medium shadow-sm"
        >
          <Plus size={14} /> Registrar Adelanto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PEOPLE.map((person) => (
          <PersonCard key={person} person={person} settlement={settlement} />
        ))}
      </div>

      {/* Resultado final: el único número que se transfiere. */}
      <div className="mt-6 bg-emerald-500/10 border border-emerald-500/40 rounded-lg p-4">
        {settleUp ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-lg font-bold">
              <HandCoins size={22} className="text-emerald-400 shrink-0" />
              <span className="flex items-center gap-2 flex-wrap">
                <span className="text-white">{settleUp.from}</span>
                <ArrowRight size={18} className="text-emerald-400" />
                <span className="text-white">{settleUp.to}</span>
              </span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{formatCurrency(settleUp.amount)}</div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <HandCoins size={20} className="text-emerald-400" /> Las cuentas están cuadradas: nadie le debe nada a nadie.
          </div>
        )}

        {isPartialView && (
          <p className="text-xs text-amber-300/90 mt-3 border-t border-emerald-500/20 pt-3">
            Estás viendo sólo una parte de los movimientos. La transferencia real del mes completo es{' '}
            <strong className="text-amber-200">{formatCurrency(globalAmount)}</strong>
            {globalSettlement.settleUp
              ? ` de ${globalSettlement.settleUp.from} a ${globalSettlement.settleUp.to}`
              : ''}{' '}
            — cámbiate a la vista «Todo» para cerrar el mes.
          </p>
        )}

        {Math.abs(settlement.check) > 0.5 && (
          <p className="text-xs text-red-300 mt-3">
            Revisión: los balances no suman cero ({formatCurrency(settlement.check)}). Hay un pagador fuera de{' '}
            {PEOPLE.join(' / ')}.
          </p>
        )}
      </div>

      {advances.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
            Adelantos del mes ({advances.length})
          </h4>
          <ul className="divide-y divide-slate-700 rounded-lg border border-slate-700 overflow-hidden">
            {advances.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 px-3 py-2 bg-slate-700/30 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-400 text-xs whitespace-nowrap">{a.date}</span>
                  <span className="text-white truncate">
                    {a.from} <span className="text-sky-400">→</span> {a.to}
                  </span>
                  {a.description && <span className="text-slate-400 text-xs truncate">· {a.description}</span>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-sky-300">{formatCurrency(Math.abs(a.amount))}</span>
                  <button
                    type="button"
                    aria-label={`Eliminar adelanto de ${a.from} a ${a.to}`}
                    onClick={() => {
                      if (window.confirm('¿Eliminar este adelanto?')) deleteTransaction(a.id);
                    }}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettlementPanel;

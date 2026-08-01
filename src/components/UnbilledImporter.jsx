import { useState } from 'react';
import { ArrowRight, ClipboardPaste } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

const UnbilledImporter = () => {
  const { selectedCard, unbilledTransactions, addTransactionsBulk, updateTransaction } = useTransactions();
  const [rawText, setRawText] = useState('');

  const processUnbilledText = () => {
    if (!rawText.trim()) return;
    const targetCard = selectedCard === 'all' || selectedCard === 'manual' ? '9979' : selectedCard;
    if (
      (selectedCard === 'all' || selectedCard === 'manual') &&
      !window.confirm('Los movimientos se asignarán a la tarjeta W.Member (9979). ¿Continuar?')
    ) {
      return;
    }

    const dateBlocks = rawText.split(/(?=\d{2}[/-]\d{2}[/-]\d{4})/);
    const parsed = [];

    dateBlocks.forEach((block) => {
      const dateMatch = block.match(/^(\d{2}[/-]\d{2}[/-]\d{4})/);
      if (!dateMatch) return;
      const date = dateMatch[0].replace(/-/g, '/');
      const textAfterDate = block.slice(dateMatch[0].length);
      const amountRegex = /([+-]\s?\$?\s?\d{1,3}(?:\.\d{3})*)/;
      const parts = textAfterDate.split(amountRegex);

      for (let i = 0; i < parts.length - 1; i += 2) {
        const descRaw = parts[i].trim();
        const amtRaw = parts[i + 1];
        if (!amtRaw) continue;
        let desc = descRaw.replace(/^Monto cargoMonto abono/i, '').trim();
        if (!desc && i === 0) desc = 'Gasto del Banco';
        if (!desc) continue;
        const amountStr = amtRaw.replace(/[^\d+-]/g, '');
        let amount = parseInt(amountStr, 10);
        const isRefund =
          amtRaw.includes('+') ||
          desc.toUpperCase().includes('ABONO') ||
          desc.toUpperCase().includes('PAGO') ||
          desc.toUpperCase().includes('NOTA DE CREDITO');
        amount = isRefund ? Math.abs(amount) : -Math.abs(amount);

        parsed.push({
          id: `unbilled-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          date,
          description: desc.substring(0, 40),
          amount,
          category: isRefund ? 'Abonos' : 'Sin Clasificar',
          type: isRefund ? 'refund' : null,
          allocation: 'Casa',
          card: targetCard,
          isInstallment: false,
          isUnbilled: true,
        });
      }
    });

    // Deduplicación por conteo: si la cartola trae dos veces el mismo cargo, se
    // conservan ambos; sólo se descartan los que ya estaban importados.
    const existingCounts = {};
    unbilledTransactions
      .filter((t) => t.card === targetCard)
      .forEach((t) => {
        const key = `${t.date}|${t.description}|${t.amount}`;
        existingCounts[key] = (existingCounts[key] || 0) + 1;
      });

    const toAdd = [];
    parsed.forEach((newTx) => {
      const key = `${newTx.date}|${newTx.description}|${newTx.amount}`;
      if (existingCounts[key] && existingCounts[key] > 0) {
        existingCounts[key] -= 1;
      } else {
        toAdd.push(newTx);
      }
    });

    if (toAdd.length > 0) {
      addTransactionsBulk(toAdd);
      setRawText('');
    } else {
      alert('No se detectaron movimientos nuevos.');
    }
  };

  const commitUnbilledToBilled = () => {
    const dataToCommit =
      selectedCard === 'all' || selectedCard === 'manual'
        ? unbilledTransactions
        : unbilledTransactions.filter((t) => t.card === selectedCard);
    if (dataToCommit.length === 0) return;
    if (window.confirm(`¿Pasar ${dataToCommit.length} movimientos a facturación?`)) {
      dataToCommit.forEach((t) => {
        updateTransaction(t.id, { isUnbilled: false });
      });
    }
  };

  return (
    <div className="p-4 bg-orange-50/30 border-b border-orange-100 shrink-0">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="unbilled-paste" className="text-xs font-bold text-orange-700 uppercase tracking-wide flex items-center gap-1">
          <ClipboardPaste size={14} /> Sincronizar Cartola para Próximo Mes
        </label>
        {unbilledTransactions.length > 0 && (
          <button
            type="button"
            onClick={commitUnbilledToBilled}
            className="flex items-center gap-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded transition-colors font-medium shadow-sm"
          >
            <ArrowRight size={14} /> Confirmar a Movimientos
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <textarea
          id="unbilled-paste"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Pega los gastos recientes que aparecerán en la próxima facturación..."
          className="flex-1 text-sm border-slate-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 h-16 resize-none"
        />
        <button
          type="button"
          onClick={processUnbilledText}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm whitespace-nowrap"
        >
          Guardar Proyección
        </button>
      </div>
    </div>
  );
};

export default UnbilledImporter;

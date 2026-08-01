import { useMemo } from 'react';
import { Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Layers } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';
import { COLORS } from '../data/transactions';
import { formatCurrency } from '../lib/format';
import { isExpenseNeutral } from '../lib/settlement';

const ExpenseChart = () => {
  const { billedTransactions, stats, selectedCard } = useTransactions();

  const chartData = useMemo(() => {
    const categoryTotals = {};
    billedTransactions.forEach((t) => {
      if (t.amount < 0 && !isExpenseNeutral(t)) {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
      }
    });
    return Object.keys(categoryTotals)
      .map((cat) => ({ name: cat, value: categoryTotals[cat], color: COLORS[cat] || '#94a3b8' }))
      .sort((a, b) => b.value - a.value);
  }, [billedTransactions]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <Layers size={18} /> Composición del Gasto {selectedCard === 'all' ? '(Total)' : ''}
      </h3>
      <div className="h-[250px] w-full relative">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
                <Label
                  position="center"
                  content={({ viewBox }) => {
                    const { cx, cy } = viewBox;
                    return (
                      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={cx} y={cy - 10} className="fill-slate-400 text-[10px] font-bold uppercase">
                          Facturado
                        </tspan>
                        <tspan x={cx} y={cy + 14} className="fill-slate-800 text-lg font-bold">
                          {formatCurrency(Math.abs(stats.totalBilled))}
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
              <RechartsTooltip formatter={(val) => formatCurrency(val)} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">Sin datos</div>
        )}
      </div>
      <div className="mt-4 space-y-2 max-h-[200px] overflow-y-auto pr-1">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600">{item.name}</span>
            </div>
            <span className="font-medium text-slate-800">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;

import { resolvePaidBy } from './settlement';

const HEADERS = [
  'Fecha',
  'Descripcion',
  'Cuota',
  'Categoria',
  'Asignacion',
  'Pago',
  'Tarjeta',
  'Estado',
  'Monto',
];

const escapeCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const toRow = (t, settings) => [
  t.date ?? '',
  t.type === 'advance' ? `Adelanto ${t.from} -> ${t.to}${t.description ? `: ${t.description}` : ''}` : t.description,
  t.installment ?? '',
  t.category,
  t.type === 'payment' || t.type === 'advance' ? '-' : t.allocation,
  t.type === 'payment' ? '-' : t.type === 'advance' ? t.from : resolvePaidBy(t, settings),
  t.card === 'manual' ? 'EFECTIVO/TRANSF.' : t.card,
  t.isUnbilled ? 'Por facturar' : 'Facturado',
  t.amount,
];

// Excel en es-CL espera punto y coma como separador, no coma.
export const buildCsv = (transactions, settings) =>
  [HEADERS, ...transactions.map((t) => toRow(t, settings))]
    .map((row) => row.map(escapeCell).join(';'))
    .join('\n');

export const downloadCsv = (transactions, filename, settings) => {
  // El BOM evita que Excel rompa las tildes al abrir el archivo.
  const blob = new Blob([`﻿${buildCsv(transactions, settings)}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

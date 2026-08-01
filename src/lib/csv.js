const HEADERS = ['Fecha', 'Descripcion', 'Cuota', 'Categoria', 'Asignacion', 'Tarjeta', 'Estado', 'Monto'];

const escapeCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const toRow = (t) => [
  t.date ?? '',
  t.description,
  t.installment ?? '',
  t.category,
  t.type === 'payment' ? '-' : t.allocation,
  t.card === 'manual' ? 'EFECTIVO/TRANSF.' : t.card,
  t.isUnbilled ? 'Por facturar' : 'Facturado',
  t.amount,
];

// Excel en es-CL espera punto y coma como separador, no coma.
export const buildCsv = (transactions) =>
  [HEADERS, ...transactions.map(toRow)]
    .map((row) => row.map(escapeCell).join(';'))
    .join('\n');

export const downloadCsv = (transactions, filename) => {
  // El BOM evita que Excel rompa las tildes al abrir el archivo.
  const blob = new Blob([`﻿${buildCsv(transactions)}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

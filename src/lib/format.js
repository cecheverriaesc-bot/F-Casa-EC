export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

// El resto de la app guarda las fechas como DD/MM/YYYY, pero <input type="date">
// entrega YYYY-MM-DD. Estos dos helpers hacen el puente en el formulario manual.
export const isoToDisplayDate = (iso) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  if (!match) return iso;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
};

export const todayAsIso = () => new Date().toISOString().split('T')[0];

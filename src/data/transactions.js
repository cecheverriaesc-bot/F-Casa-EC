// NOTA: la cartola de julio 2026 vive ahora en Supabase, no acá. Este archivo
// sólo conserva la configuración (categorías, personas, plantillas). La carga
// inicial quedó registrada en las migraciones del proyecto.

export const COLORS = {
  'Supermercado': '#10b981', 'Delivery': '#ef4444', 'Salud': '#ec4899', 'Transporte': '#f59e0b',
  'Combustible': '#f97316', 'Tiendas': '#8b5cf6', 'Servicios': '#64748b', 'Viajes': '#3b82f6',
  'Regalos/Varios': '#a855f7', 'Restaurantes': '#e11d48', 'Deporte': '#06b6d4', 'Impuestos': '#9ca3af',
  'Pago Tarjeta': '#22c55e', 'Abonos': '#84cc16', 'Varios': '#6366f1', 'Vivienda': '#059669',
  'Cuidado Infantil': '#14b8a6', 'Servicio Doméstico': '#eab308', 'Imposiciones': '#a16207',
  // Agua, luz y gas separados de 'Servicios' para poder seguirlos mes a mes.
  'Servicios Básicos': '#0891b2',
  'Adelantos': '#0ea5e9', 'Sin Clasificar': '#94a3b8',
};

// Cómo salió la plata. Lo cargado a una tarjeta es siempre crédito; los gastos
// manuales distinguen efectivo, débito y transferencia.
export const PAYMENT_METHODS = {
  efectivo: { label: 'Efectivo', short: 'EFECTIVO', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  debito: { label: 'Débito', short: 'DÉBITO', badge: 'bg-teal-50 text-teal-700 border-teal-200' },
  transferencia: { label: 'Transferencia', short: 'TRANSF.', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  credito: { label: 'Tarjeta de crédito', short: 'CRÉDITO', badge: 'bg-slate-50 text-slate-500 border-slate-200' },
};

export const MANUAL_PAYMENT_METHODS = ['efectivo', 'debito', 'transferencia'];

// Medio asumido para un gasto manual que no lo trae explícito.
export const DEFAULT_MANUAL_METHOD = 'transferencia';

export const CURRENT_PERIOD = { month: 7, year: 2026, label: 'Julio 2026' };

// Las dos partes del cierre. El orden importa: en un reparto desparejo el
// primero toma la fracción redondeada y el segundo el resto.
export const PEOPLE = ['Carlos', 'Rina'];

// Titular que paga cada tarjeta: define quién desembolsa lo cargado ahí.
// Editable en el panel de Configuración.
export const DEFAULT_CARD_OWNERS = { '9979': 'Carlos', '6259': 'Carlos' };

// Pagador de un gasto manual que no trae `paidBy` propio.
export const DEFAULT_MANUAL_PAYER = 'Carlos';

// Fracción de los gastos 'Casa' que asume PEOPLE[0]. 0.5 = mitad y mitad.
export const DEFAULT_SPLIT_RATIO = 0.5;

export const ALLOCATION_COLORS = {
  'Casa': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200',
  'Carlos': 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
  'Rina': 'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 border-fuchsia-200',
};

/**
 * Gastos fijos que se repiten todos los meses y no llegan en ninguna cartola:
 * salen en efectivo, débito o transferencia. El panel «Gastos fijos del mes»
 * los usa como checklist para que ninguno se quede fuera del cierre.
 *
 * `amount: null` marca los que todavía no tienen monto confirmado: aparecen
 * como pendientes y no se pueden cargar hasta que se les ponga cifra.
 */
export const RECURRING_TEMPLATES = [
  {
    key: 'arriendo', description: 'ARRIENDO', amount: 884000, day: 1,
    category: 'Vivienda', allocation: 'Casa', paymentMethod: 'transferencia',
    note: 'Monto fijo hasta septiembre 2026; revisar al renovar.',
  },
  {
    key: 'ggcc', description: 'GASTOS COMUNES', amount: 279277, day: 5,
    category: 'Vivienda', allocation: 'Casa', paymentMethod: 'transferencia',
    note: 'Varía cada mes: confirmar el monto real antes de cargar.',
  },
  {
    key: 'seguro-ninas', description: 'SEGURO COMPLEMENTARIO NIÑAS', amount: 70000, day: 5,
    category: 'Salud', allocation: 'Casa', paymentMethod: 'transferencia',
  },
  {
    key: 'agua', description: 'AGUAS CORDILLERA (CUENTA)', amount: 13260, day: 25,
    category: 'Servicios Básicos', allocation: 'Casa', paymentMethod: 'debito',
    note: 'Varía cada mes: confirmar el monto real antes de cargar.',
  },
  {
    key: 'luz', description: 'ENEL (LUZ)', amount: 170540, day: 25,
    category: 'Servicios Básicos', allocation: 'Casa', paymentMethod: 'debito',
    note: 'Varía cada mes y sube fuerte en invierno: confirmar antes de cargar.',
  },
  {
    key: 'nicole', description: 'NICOLE (CUIDADO NIÑAS)', amount: 94500, day: 5,
    category: 'Cuidado Infantil', allocation: 'Casa', paymentMethod: 'transferencia',
    note: 'Cuidado de las niñas en la mañana.',
  },
  {
    key: 'miriam', description: 'SRA MIRIAM (ASESORA DEL HOGAR)', amount: 640000, day: 5,
    category: 'Servicio Doméstico', allocation: 'Casa', paymentMethod: 'transferencia',
    note: 'Sueldo líquido mensual.',
  },
  {
    // Único fijo que no es 50/50: es de Carlos, así que va 100% a su cuenta.
    key: 'estacionamiento', description: 'ESTACIONAMIENTO (VICTO)', amount: 50000, day: 5,
    category: 'Transporte', allocation: 'Carlos', paymentMethod: 'transferencia',
    note: 'Gasto personal de Carlos: no se reparte.',
  },
  {
    key: 'imposiciones', description: 'IMPOSICIONES (PREVIRED)', amount: 178632, day: 10,
    category: 'Imposiciones', allocation: 'Casa', paymentMethod: 'transferencia',
    note: 'AFP, salud y cesantía de la asesora. Aproximado: confirmar con Previred.',
  },
];

// Etiquetas de cada vista de tarjeta, usadas por el header y el exportador.
export const CARD_LABELS = {
  all: 'Todo',
  '9979': 'W.Member',
  '6259': 'Limited',
  manual: 'Fijos',
};

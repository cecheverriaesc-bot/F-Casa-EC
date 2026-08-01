// ==========================================
// BASE DE DATOS ESTRICTA: SOLO CARTOLAS FACTURADAS JULIO 2026
// ==========================================
export const ALL_TRANSACTIONS = [
  // --- GASTOS FIJOS / TRANSFERENCIAS (Actualizados a Julio) ---
  { id: 'man-1', date: '01/07/2026', description: 'ARRIENDO', amount: -884000, category: 'Vivienda', allocation: 'Casa', card: 'manual', paymentMethod: 'transferencia', isInstallment: false, isUnbilled: false },
  { id: 'man-2', date: '05/07/2026', description: 'GASTOS COMUNES', amount: -279277, category: 'Vivienda', allocation: 'Casa', card: 'manual', paymentMethod: 'transferencia', isInstallment: false, isUnbilled: false },
  { id: 'man-3', date: '05/07/2026', description: 'SEGURO COMPLEMENTARIO NIÑAS', amount: -70000, category: 'Salud', allocation: 'Casa', card: 'manual', paymentMethod: 'transferencia', isInstallment: false, isUnbilled: false },
  { id: 'man-4', date: '05/07/2026', description: 'TIO TOTI', amount: -120000, category: 'Varios', allocation: 'Casa', card: 'manual', paymentMethod: 'transferencia', isInstallment: false, isUnbilled: false },
  { id: 'man-5', date: '05/07/2026', description: 'STA MARIA', amount: -40000, category: 'Salud', allocation: 'Casa', card: 'manual', paymentMethod: 'transferencia', isInstallment: false, isUnbilled: false },
  { id: 'man-6', date: '05/07/2026', description: 'SRA MIRIAM (ASESORA DEL HOGAR)', amount: -640000, category: 'Servicio Doméstico', allocation: 'Casa', card: 'manual', paymentMethod: 'transferencia', isInstallment: false, isUnbilled: false },
  { id: 'man-7', date: '05/07/2026', description: 'NICOLE (CUIDADO NIÑAS)', amount: -94500, category: 'Cuidado Infantil', allocation: 'Casa', card: 'manual', paymentMethod: 'transferencia', isInstallment: false, isUnbilled: false },

  // --- DEUDAS EN CUOTAS FUERA DE TARJETA ---
  // Deuda con la suegra por la estufa: $73.331 mensuales durante 6 meses.
  { id: 'man-C-1', description: 'ESTUFA TOYOTOMI (SUEGRA)', installment: '01/06', amount: -73331, category: 'Tiendas', allocation: 'Casa', card: 'manual', paymentMethod: 'transferencia', isInstallment: true, isUnbilled: false },

  // --- TARJETA 9979 (WorldMember) - COMPRAS Y CARGOS JULIO 2026 ---
  { id: '9979-M-1', date: '23/06/2026', description: 'UNIMARC VITACURA', amount: -3290, category: 'Supermercado', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-2', date: '26/06/2026', description: 'PASEO EL TAMARUGO', amount: -1500, category: 'Varios', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-3', date: '26/06/2026', description: 'DL RAPPI CHILE RAPPI', amount: -8630, category: 'Delivery', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-4', date: '26/06/2026', description: 'JUMBO ONECLICK', amount: -88642, category: 'Supermercado', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-5', date: '26/06/2026', description: 'JUMBO ONECLICK', amount: -2254, category: 'Supermercado', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-6', date: '27/06/2026', description: 'DL RAPPI CHILE RAPPI', amount: -8240, category: 'Delivery', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-7', date: '29/06/2026', description: 'DL RAPPI CHILE RAPPI', amount: -20980, category: 'Delivery', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-8', date: '29/06/2026', description: 'JUMBO BILBAO', amount: -29303, category: 'Supermercado', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-9', date: '29/06/2026', description: 'JUMBO BILBAO', amount: -11666, category: 'Supermercado', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-10', date: '30/06/2026', description: 'DL RAPPI CHILE RAPPI', amount: -2490, category: 'Delivery', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-11', date: '30/06/2026', description: 'JUMBO ONECLICK', amount: -193747, category: 'Supermercado', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-12', date: '01/07/2026', description: 'PARIS LA DEHESA', amount: -17980, category: 'Tiendas', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-13', date: '01/07/2026', description: 'PARIS LA DEHESA', amount: -26210, category: 'Tiendas', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-14', date: '03/07/2026', description: 'SABA ARAUCO KENNEDY', amount: -750, category: 'Transporte', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-15', date: '03/07/2026', description: 'MULTIMED', amount: -26116, category: 'Salud', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-16', date: '03/07/2026', description: 'COPEC ARCOPRIME', amount: -74760, category: 'Combustible', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-17', date: '03/07/2026', description: 'JUMBO LA DEHESA', amount: -5670, category: 'Supermercado', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-18', date: '03/07/2026', description: 'PARKING LA DEHESA', amount: -1800, category: 'Transporte', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-19', date: '03/07/2026', description: 'MULTIMED', amount: -46719, category: 'Salud', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-20', date: '05/07/2026', description: 'SALCOBRAND AVDA. LAS C', amount: -39026, category: 'Salud', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-21', date: '06/07/2026', description: 'SB 941', amount: -8219, category: 'Salud', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-22', date: '07/07/2026', description: 'SB 933', amount: -12824, category: 'Salud', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-23', date: '08/07/2026', description: 'ARAMCO', amount: -21000, category: 'Combustible', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-24', date: '10/07/2026', description: 'TUU AGUAS HONTANAR', amount: -13500, category: 'Servicios', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-25', date: '11/07/2026', description: 'SALCOBRAND LAS CONDES', amount: -33344, category: 'Salud', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-26', date: '11/07/2026', description: 'HIP LIDER PUENTE NUEVO', amount: -39640, category: 'Supermercado', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-27', date: '12/07/2026', description: 'MERCADOPAGO RYMCO', amount: -20000, category: 'Varios', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-28', date: '15/07/2026', description: 'ADMINISTRACION Y GESTION', amount: -73515, category: 'Servicios', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-29', date: '17/07/2026', description: 'HIP LIDER PUENTE NUEVO', amount: -20720, category: 'Supermercado', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-30', date: '19/07/2026', description: 'OKM QUINCHAMALI', amount: -13440, category: 'Transporte', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-M-31', date: '19/07/2026', description: 'EL GAUCHITO', amount: -18950, category: 'Restaurantes', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },

  // --- TARJETA 9979 (WorldMember) - CUOTAS JULIO 2026 ---
  { id: '9979-C-1', description: 'MACONLINE ALTO LAS CONDES', installment: '15/36', amount: -39583, category: 'Tiendas', allocation: 'Carlos', card: '9979', isInstallment: true, isUnbilled: false },
  { id: '9979-C-2', description: 'CUNCUNA LA DEHESA', installment: '06/06', amount: -6902, category: 'Regalos/Varios', allocation: 'Casa', card: '9979', isInstallment: true, isUnbilled: false },
  { id: '9979-C-3', description: 'MERPAGO KAYAKCHILE', installment: '07/12', amount: -3332, category: 'Viajes', allocation: 'Casa', card: '9979', isInstallment: true, isUnbilled: false },
  { id: '9979-C-4', description: 'PITS', installment: '04/06', amount: -22620, category: 'Transporte', allocation: 'Carlos', card: '9979', isInstallment: true, isUnbilled: false },
  { id: '9979-C-5', description: 'MERPAGO CORDPRINCESS', installment: '03/03', amount: -4160, category: 'Tiendas', allocation: 'Casa', card: '9979', isInstallment: true, isUnbilled: false },
  { id: '9979-C-6', description: 'SALCOBRAND AV EL RODEO', installment: '02/03', amount: -22544, category: 'Salud', allocation: 'Casa', card: '9979', isInstallment: true, isUnbilled: false },
  { id: '9979-C-7', description: 'SALCOBRAND AVDA. LAS C', installment: '01/03', amount: -18252, category: 'Salud', allocation: 'Casa', card: '9979', isInstallment: true, isUnbilled: false },
  { id: '9979-C-8', description: 'SALCOBRAND AVDA. LAS C', installment: '01/03', amount: -26817, category: 'Salud', allocation: 'Casa', card: '9979', isInstallment: true, isUnbilled: false },
  { id: '9979-C-9', description: 'FUNTOPIAPARK MALL SPORT', installment: '02/03', amount: -10000, category: 'Regalos/Varios', allocation: 'Casa', card: '9979', isInstallment: true, isUnbilled: false },
  { id: '9979-C-10', description: 'TIENDA SANTIAGO MALL SPO', installment: '01/03', amount: -22392, category: 'Tiendas', allocation: 'Casa', card: '9979', isInstallment: true, isUnbilled: false },
  { id: '9979-C-11', description: 'COLLOKY LA DEHESA', installment: '02/06', amount: -5873, category: 'Tiendas', allocation: 'Casa', card: '9979', isInstallment: true, isUnbilled: false },

  // --- TARJETA 9979 (WorldMember) - IMPUESTOS Y ABONOS JULIO 2026 ---
  { id: '9979-TAX-1', date: '03/07/2026', description: 'IMPTO. DECRETO LEY 3475', amount: -127, category: 'Impuestos', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-TAX-2', date: '15/07/2026', description: 'IMPTO. DECRETO LEY 3475', amount: -138, category: 'Impuestos', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-REF-1', date: '01/07/2026', description: 'NOTA DE CREDITO', amount: 22, category: 'Abonos', type: 'refund', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },
  { id: '9979-PAY-1', date: '05/07/2026', description: 'MONTO CANCELADO', amount: 1332034, category: 'Pago Tarjeta', type: 'payment', allocation: 'Casa', card: '9979', isInstallment: false, isUnbilled: false },

  // --- TARJETA 6259 (Limited) - COMPRAS Y CARGOS JULIO 2026 ---
  { id: '6259-M-1', date: '28/06/2026', description: 'DL RAPPI CHILE RAPPI', amount: -11700, category: 'Delivery', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-2', date: '28/06/2026', description: 'DL RAPPI CHILE RAPPI', amount: -17990, category: 'Delivery', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-3', date: '04/07/2026', description: 'DL RAPPI CHILE RAPPI', amount: -11460, category: 'Delivery', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-4', date: '05/07/2026', description: 'AGUAS CORDILLERA', amount: -15290, category: 'Servicios', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-5', date: '07/07/2026', description: 'DL RAPPI CHILE RAPPI', amount: -8490, category: 'Delivery', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-6', date: '08/07/2026', description: 'JUMBO ONECLICK', amount: -3656, category: 'Supermercado', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-7', date: '08/07/2026', description: 'JUMBO ONECLICK', amount: -115892, category: 'Supermercado', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-8', date: '13/07/2026', description: 'ONECLICK RECURRENTE ESA', amount: -10151, category: 'Servicios', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-9', date: '15/07/2026', description: 'JUMBO ONECLICK', amount: -171094, category: 'Supermercado', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-10', date: '16/07/2026', description: 'JUMBO ONECLICK', amount: -3373, category: 'Supermercado', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-11', date: '18/07/2026', description: 'PAYU UBER TRIP', amount: -17483, category: 'Transporte', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
  { id: '6259-M-12', date: '19/07/2026', description: 'DL RAPPI CHILE RAPPI', amount: -8140, category: 'Delivery', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },

  // --- TARJETA 6259 (Limited) - CUOTAS JULIO 2026 ---
  { id: '6259-C-1', description: 'MUNICIPALIDAD DE COLINA C', installment: '03/03', amount: -65731, category: 'Impuestos', allocation: 'Casa', card: '6259', isInstallment: true, isUnbilled: false },
  { id: '6259-C-2', description: 'LIDER.CL COMPRA DIRECTA', installment: '03/03', amount: -29130, category: 'Supermercado', allocation: 'Casa', card: '6259', isInstallment: true, isUnbilled: false },
  { id: '6259-C-3', description: 'OPALINE LOS TRAPENSES', installment: '03/03', amount: -22660, category: 'Tiendas', allocation: 'Casa', card: '6259', isInstallment: true, isUnbilled: false },

  // --- TARJETA 6259 (Limited) - IMPUESTOS Y ABONOS JULIO 2026 ---
  { id: '6259-PAY-1', date: '05/07/2026', description: 'MONTO CANCELADO', amount: 284912, category: 'Pago Tarjeta', type: 'payment', allocation: 'Casa', card: '6259', isInstallment: false, isUnbilled: false },
];

// Bandeja completamente vacía para iniciar el próximo mes
export const INITIAL_UNBILLED = [];

export const COLORS = {
  'Supermercado': '#10b981', 'Delivery': '#ef4444', 'Salud': '#ec4899', 'Transporte': '#f59e0b',
  'Combustible': '#f97316', 'Tiendas': '#8b5cf6', 'Servicios': '#64748b', 'Viajes': '#3b82f6',
  'Regalos/Varios': '#a855f7', 'Restaurantes': '#e11d48', 'Deporte': '#06b6d4', 'Impuestos': '#9ca3af',
  'Pago Tarjeta': '#22c55e', 'Abonos': '#84cc16', 'Varios': '#6366f1', 'Vivienda': '#059669',
  'Cuidado Infantil': '#14b8a6', 'Servicio Doméstico': '#eab308', 'Imposiciones': '#a16207',
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
    key: 'imposiciones', description: 'IMPOSICIONES (PREVIRED)', amount: null, day: 10,
    category: 'Imposiciones', allocation: 'Casa', paymentMethod: 'transferencia',
    note: 'AFP, salud y seguro de cesantía de la asesora del hogar.',
  },
];

// Etiquetas de cada vista de tarjeta, usadas por el header y el exportador.
export const CARD_LABELS = {
  all: 'Todo',
  '9979': 'W.Member',
  '6259': 'Limited',
  manual: 'Fijos',
};

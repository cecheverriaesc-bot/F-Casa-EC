import { DEFAULT_MANUAL_METHOD, PEOPLE } from '../data/transactions';

// Un ítem es "neutro para el gasto" cuando mueve plata pero no representa
// consumo del mes: el pago de la tarjeta (flujo de caja del ciclo anterior) y
// los adelantos entre Carlos y Rina (sólo cambian quién debe a quién).
export const isExpenseNeutral = (t) => t.type === 'payment' || t.type === 'advance';

export const isAdvance = (t) => t.type === 'advance';

// De qué bolsillo salió la plata. La tarjeta manda sobre el ítem: si la 9979 la
// paga Carlos, todo lo cargado ahí lo desembolsó Carlos. Los gastos manuales sí
// se definen ítem por ítem, y si no traen dato caen al pagador por defecto.
export const resolvePaidBy = (t, { cardOwners, manualPayer }) => {
  if (t.card && t.card !== 'manual') return cardOwners[t.card] ?? manualPayer;
  return t.paidBy ?? manualPayer;
};

// Sólo los gastos manuales se pueden reasignar de a uno; los de tarjeta se
// cambian moviendo al titular de la tarjeta en Configuración.
export const isPayerEditable = (t) => t.card === 'manual' && !isExpenseNeutral(t);

// Cómo salió la plata. Todo lo cargado a una tarjeta es crédito; lo manual
// puede ser efectivo, débito o transferencia.
export const resolvePaymentMethod = (t) => {
  if (t.card && t.card !== 'manual') return 'credito';
  return t.paymentMethod ?? DEFAULT_MANUAL_METHOD;
};

const zeroed = () => Object.fromEntries(PEOPLE.map((p) => [p, 0]));

/**
 * Cuadratura del mes.
 *
 *   responsabilidad = cuota de los gastos 'Casa' + 100% de los gastos propios
 *   desembolso      = todo lo que efectivamente pagó con sus tarjetas y cuentas
 *   balance         = desembolso - responsabilidad (+/- adelantos ya transferidos)
 *
 * Un balance positivo significa que puso más de lo que le tocaba, así que la
 * otra parte le debe esa diferencia. Los dos balances suman cero por
 * construcción, y `check` lo verifica.
 */
export const computeSettlement = ({ billedTransactions, splitRatio, cardOwners, manualPayer }) => {
  const expenses = billedTransactions.filter((t) => !isExpenseNeutral(t));
  const advances = billedTransactions.filter(isAdvance);

  const sumAllocation = (owner) =>
    Math.abs(expenses.filter((t) => t.allocation === owner).reduce((acc, t) => acc + t.amount, 0));

  const casaTotal = sumAllocation('Casa');
  const personal = Object.fromEntries(PEOPLE.map((p) => [p, sumAllocation(p)]));

  // El primero de PEOPLE toma la fracción redondeada y el segundo el resto, así
  // las dos cuotas suman siempre exactamente el total de Casa (sin perder pesos).
  const [first, second] = PEOPLE;
  const casaShare = zeroed();
  casaShare[first] = Math.round(casaTotal * splitRatio);
  casaShare[second] = casaTotal - casaShare[first];

  const responsibility = Object.fromEntries(PEOPLE.map((p) => [p, casaShare[p] + personal[p]]));

  // Los montos vienen negativos para gastos y positivos para devoluciones, así
  // que una nota de crédito reduce el desembolso de quien la recibió.
  const outlay = zeroed();
  expenses.forEach((t) => {
    const payer = resolvePaidBy(t, { cardOwners, manualPayer });
    if (payer in outlay) outlay[payer] += -t.amount;
  });

  const advancesPaid = zeroed();
  const advancesReceived = zeroed();
  advances.forEach((a) => {
    const amount = Math.abs(a.amount);
    if (a.from in advancesPaid) advancesPaid[a.from] += amount;
    if (a.to in advancesReceived) advancesReceived[a.to] += amount;
  });

  const balance = Object.fromEntries(
    PEOPLE.map((p) => [p, outlay[p] - responsibility[p] + advancesPaid[p] - advancesReceived[p]]),
  );

  const creditor = PEOPLE.find((p) => balance[p] > 0) ?? null;
  const debtor = PEOPLE.find((p) => balance[p] < 0) ?? null;
  const transfer = creditor ? balance[creditor] : 0;

  return {
    casaTotal,
    casaShare,
    personal,
    responsibility,
    outlay,
    advancesPaid,
    advancesReceived,
    balance,
    advances,
    // Quién le transfiere a quién para quedar en cero.
    settleUp: transfer > 0 ? { from: debtor, to: creditor, amount: transfer } : null,
    // Los balances deben sumar cero; si no, hay un pagador fuera de PEOPLE.
    check: PEOPLE.reduce((acc, p) => acc + balance[p], 0),
  };
};

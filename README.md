# F-Casa-EC — Cierre Financiero de Julio

Panel para auditar el cierre financiero mensual del hogar: movimientos de tarjetas,
cuotas arrastradas, gastos fijos y el reparto de cuánto le toca pagar a cada uno.

## Puesta en marcha

```bash
npm install
npm run dev      # http://localhost:5173
```

Otros comandos:

```bash
npm run build    # build de producción en dist/
npm run preview  # sirve el build ya generado
```

## Qué muestra

- **KPIs**: compras del mes, cuotas arrastradas, proyección del próximo mes y total facturado.
- **Distribución**: cuánto suma lo asignado a Casa, Carlos y Rina.
- **Cierre mensual**: responsabilidad, desembolso real y balance de cada uno, con el
  monto exacto que una parte le transfiere a la otra (ver más abajo).
- **Tabla**: pestañas de Movimientos, Cuotas y Por Facturar. La asignación de cada
  ítem se cambia haciendo clic en el botón `Casa → Carlos → Rina`, y el pagador de
  los gastos fijos en la columna `Pagó`.
- **Gráfico**: composición del gasto facturado por categoría.

Las vistas por tarjeta (`Todo`, `W.Member 9979`, `Limited 6259`, `Fijos`) recalculan
todos los totales sobre el subconjunto seleccionado.

## Cuadratura: quién le debe a quién

Saber cuánto le corresponde a cada uno no basta para cerrar el mes; hay que
compararlo con lo que cada uno efectivamente desembolsó.

```
responsabilidad = cuota de los gastos 'Casa' + 100% de los gastos propios
desembolso      = todo lo pagado con sus tarjetas y cuentas
balance         = desembolso - responsabilidad + adelantos entregados - recibidos
```

Un balance positivo significa que puso más de lo que le tocaba, así que la otra parte
le debe esa diferencia. Los dos balances suman cero por construcción; el panel avisa
en rojo si no lo hacen.

- **De qué bolsillo salió**: lo cargado a una tarjeta lo desembolsa su **titular**
  (configurable). Los gastos fijos llevan `paidBy` propio, editable ítem por ítem.
- **Adelantos**: si una parte le transfiere plata a la otra a mitad de mes, se registra
  con `Registrar Adelanto`. **No suma al gasto de la casa**: sólo descuenta del balance.
  Si el adelanto supera la deuda, la dirección de la transferencia se invierte sola.
- **Pagos de tarjeta** (`MONTO CANCELADO`): quedan fuera tanto del gasto como del
  desembolso. Son el pago del ciclo anterior, no consumo del mes.
- **Reparto flexible**: el % de Casa que asume cada uno se ajusta en Configuración
  (50/50 por defecto). El peso impar va siempre a `PEOPLE[1]` para que las dos cuotas
  sumen exactamente el total de Casa.

> **Supuesto por defecto**: ambas tarjetas y los gastos fijos figuran a nombre de
> **Carlos**. Si la 6259 o algún gasto fijo salen de la cuenta de Rina, ajústalo en
> «Configuración del reparto» y en la columna `Pagó` — los balances se recalculan solos.

### Cifras de julio 2026 (vista `Todo`)

| Concepto | Monto |
| --- | --- |
| Compras del mes | $2.668.302 |
| Cuotas arrastradas | $299.996 |
| **Total facturado** | **$2.968.276** |
| Aporte Carlos | $1.515.240 |
| Aporte Rina | $1.453.036 |

Los pagos de tarjeta (`MONTO CANCELADO`) quedan fuera del total facturado: son el
pago del ciclo anterior, no gasto del mes.

## Cómo cargar movimientos

- **Gasto fijo / transferencia**: botón `Gasto Fijo` en el header. Queda con
  `card: 'manual'` y aparece en la vista `Fijos`.
- **Cartola por facturar**: pestaña `Por Facturar` → pega el texto de la cartola y
  presiona `Guardar Proyección`. El parser detecta fechas `DD/MM/YYYY` y montos, y
  descarta los movimientos que ya habías importado antes. Con `Confirmar a
  Movimientos` pasan a la facturación del mes.
- **Exportar**: botón `Exportar` genera un CSV (separador `;`, con BOM) de la vista
  actual, listo para abrir en Excel.

## Estructura

```
src/
├── App.jsx                        # shell: estados de carga/error y layout
├── main.jsx
├── index.css                      # entrada de Tailwind
├── components/                    # Header, KPIStats, AllocationBar, SettlementPanel,
│                                  # SettingsPanel, TransactionTable, UnbilledImporter,
│                                  # ExpenseChart, AddExpenseModal, AddAdvanceModal
├── context/TransactionContext.jsx # estado global, filtro por tarjeta y cálculo de stats
├── data/transactions.js           # cartolas de julio 2026, personas, colores y defaults
└── lib/
    ├── api.js                     # mock API en memoria (punto de cambio a backend real)
    ├── settlement.js              # cuadratura: responsabilidad, desembolso y balance
    ├── csv.js                     # exportación
    └── format.js                  # moneda CLP y fechas
```

Los datos viven en `src/lib/api.js`, un almacén en memoria que imita el contrato de un
backend. Los cambios **no persisten** al recargar la página: para conectar una API real,
basta con reemplazar el cuerpo de esos métodos por llamadas `fetch`; el contexto y los
componentes no necesitan cambios.

## Stack

React 18 · Vite 7 · Tailwind CSS 3 (+ plugin `forms`) · Recharts 2 · lucide-react

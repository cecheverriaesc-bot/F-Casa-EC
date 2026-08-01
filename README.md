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
- **Cierre mensual**: lo de Casa se divide 50/50 y se le suman a cada uno sus extras
  personales. El peso impar de la división se asigna a Rina para que las dos mitades
  sumen siempre exactamente el total de Casa.
- **Tabla**: pestañas de Movimientos, Cuotas y Por Facturar. La asignación de cada
  ítem se cambia haciendo clic en el botón `Casa → Carlos → Rina`.
- **Gráfico**: composición del gasto facturado por categoría.

Las vistas por tarjeta (`Todo`, `W.Member 9979`, `Limited 6259`, `Fijos`) recalculan
todos los totales sobre el subconjunto seleccionado.

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
│                                  # TransactionTable, UnbilledImporter, ExpenseChart,
│                                  # AddExpenseModal
├── context/TransactionContext.jsx # estado global, filtro por tarjeta y cálculo de stats
├── data/transactions.js           # cartolas de julio 2026, colores y categorías
└── lib/
    ├── api.js                     # mock API en memoria (punto de cambio a backend real)
    ├── csv.js                     # exportación
    └── format.js                  # moneda CLP y fechas
```

Los datos viven en `src/lib/api.js`, un almacén en memoria que imita el contrato de un
backend. Los cambios **no persisten** al recargar la página: para conectar una API real,
basta con reemplazar el cuerpo de esos métodos por llamadas `fetch`; el contexto y los
componentes no necesitan cambios.

## Stack

React 18 · Vite 7 · Tailwind CSS 3 (+ plugin `forms`) · Recharts 2 · lucide-react

# Frontend design system (MVP)

> Tokens and component mapping for the HR Pulse-style mockups. Scope is
> narrowed to what we ship in v1; deferred UI is listed in
> [visual-spec.md](visual-spec.md) and [../tradeoffs.md](../tradeoffs.md).

## Reference mockups

| Screen | Asset |
|--------|--------|
| Employees | [employees-page-mockup.png](assets/employees-page-mockup.png) |
| Salary Insights | [insights-page-mockup.png](assets/insights-page-mockup.png) |

## Color tokens

| Token | Hex | Usage |
|-------|-----|--------|
| `primary.main` | `#4A56E2` | Primary buttons, active nav, avg chart series |
| `primary.dark` | `#2E3A9E` | Max salary bars, emphasis |
| `primary.light` | `#A5B4FC` | Min salary bars, subtle fills |
| `background.default` | `#F5F7FB` | Page background |
| `background.paper` | `#FFFFFF` | Cards, sidebar surface, dialogs |
| `divider` | `#E5E9F2` | Borders, table rules |
| `text.primary` | `#1A1D26` | Headings, table body |
| `text.secondary` | `#6B7280` | Captions, column headers |
| `success.main` | `#22C55E` | Positive deltas (deferred KPIs) |
| `error.main` | `#EF4444` | Delete confirm, negative deltas |
| `warning.main` | `#F59E0B` | Tags (deferred) |

Chart series (insights grouped bars): **min** = `primary.light`, **avg** =
`primary.main`, **max** = `primary.dark`.

## Typography

- **Font family**: Inter (Google Fonts via MUI `CssBaseline`).
- **Page title**: 24px / 600 / `text.primary`.
- **Section title**: 18px / 600.
- **Table header**: 12px / 600 / uppercase optional / `text.secondary`.
- **Body**: 14px / 400.
- **Button**: 14px / 600.

## Spacing and shape

- Base unit: **8px** (`theme.spacing(1)`).
- Card padding: 24px; table cell padding: 12px 16px.
- Card radius: **12px**; button radius: **8px**; dialog radius: **12px**.

## Layout (MVP shell)

- **Sidebar width**: 240px fixed; white surface; active item = light primary
  tint background + primary text.
- **Main**: fluid column; max content width unconstrained for tables.
- **Header**: page title left; primary actions right on Employees page.

## Component mapping (MUI v6)

| Pattern | MUI component | MVP use |
|---------|-------------|---------|
| App shell | `Box` + `Drawer` (permanent) + `List` | Sidebar: Employees, Salary Insights only |
| Page header | `Typography` + `Stack` | Title + Add Employee CTA |
| Data table | `Table` or `DataGrid` (prefer `Table` for simpler tests) | Employees list |
| CRUD | `Dialog` + `TextField` | Add / Edit employee |
| Delete confirm | `Dialog` + `Button` color=`error` | Row delete |
| Country chart | Recharts `BarChart` in `ResponsiveContainer` | Top 8 countries min/avg/max |
| Drill-down | `Dialog` `maxWidth="md"` `fullWidth` | Job titles for selected country |
| Pagination | `TablePagination` or custom | 50 rows per page (API default) |

## Navigation scope (v1)

**In:** Employees, Salary Insights.

**Out (deferred):** Departments, Countries, Benchmarks, Reports, Settings,
WORKFORCE / ANALYTICS group labels in mockup.

## Implementation note

Theme values will live in `frontend/src/theme/` once the MUI scaffold slice
lands. Until then, this document is the contract for red/green UI commits.

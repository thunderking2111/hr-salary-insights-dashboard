# Frontend visual spec (MVP vs mockups)

> What we ship in v1 versus what the HR Pulse mockups show. Layout and flows
> are in [wireframes.md](wireframes.md) and [ux-flows.md](ux-flows.md); tokens
> in [design-system.md](design-system.md).

## Reference assets

| Mockup | File | Primary screen |
|--------|------|----------------|
| Employees | [employees-page-mockup.png](assets/employees-page-mockup.png) | Directory + table chrome |
| Salary Insights | [insights-page-mockup.png](assets/insights-page-mockup.png) | Analytics dashboard |

## MVP — keep (implement)

| Mockup element | MVP treatment |
|----------------|---------------|
| Left sidebar (240px), light surface | Permanent drawer; **Employees** and **Salary Insights** only |
| Page title + primary CTA | Employees: “Employees” + **Add Employee** (primary button) |
| Employee data table | Full-width `Table`; pagination 50/page |
| Add / Edit / Delete | MUI `Dialog` patterns per wireframes |
| Insights grouped bar chart (top countries) | Recharts grouped bars: min / avg / max; **top 8** countries |
| Chart card **View all** | Navigates to paginated salary-by-country list |
| Below-chart salary-by-job table | **Single selected country** (first on chart by default; bar click updates); **top 10** rows |
| **View all job titles** | Modal with full job-title list for selected country |
| Country list row click | Same job-title modal |
| Color system (~indigo primary) | Theme tokens in design-system (`#4A56E2` family) |
| Inter typography | Via MUI theme + `CssBaseline` |

## MVP — simplify (partial mockup)

| Mockup element | MVP treatment |
|----------------|---------------|
| Insights page density (KPI row + many widgets) | **Chart + one job table + list route** only |
| Country breakdown table on chart page | Replaced by **salary-by-job** table tied to chart selection (not a duplicate country table) |
| Sidebar section labels (WORKFORCE / ANALYTICS) | Omitted; flat two-item nav |
| Logo / product name “HR Pulse” | Text or simple wordmark in sidebar header (no marketing site chrome) |

## Deferred (mockup only — not v1)

Captured in [../tradeoffs.md](../tradeoffs.md#deferred-frontend-ui). Summary:

- KPI / stat cards (headcount, avg salary delta, etc.)
- Search, filters, column picker, export on employees
- Right-hand detail panels and “quick actions”
- Extra sidebar routes: Departments, Countries, Benchmarks, Reports, Settings
- Secondary insights widgets: histogram, department bar chart, YoY table,
  benchmark comparison cards
- Notifications, profile menu, global search in header
- Server-side pagination for country insights (client slice until API grows)

## Implementation status (MVP)

The running UI matches the wireframe scope: MUI shell, employees CRUD,
insights chart with bar/column selection, below-chart job table, country list
route, and job-title modals. Chart interactions use full-band column hit
areas, abortable job-title fetches, and no bar re-animation on selection.

| Area | Status |
|------|--------|
| Shell | Sidebar + main layout (`AppShell`) |
| Insights chart | Grouped Recharts bar chart (top 8) |
| Below-chart jobs | Top 10 for selected country; loading spinner in region |
| Country list | `/insights/countries` with client pagination |
| Chart selection | Bar/column click → single-country job table |

## Accessibility (MVP bar)

- Chart: `figure` + `aria-label`; bars keyboard-focusable where Recharts allows.
- Tables: proper `th scope="col"`; dialog `aria-labelledby`.
- Errors: `role="alert"`.
- Color: do not rely on color alone for min/avg/max (legend labels).

## Sign-off checklist (before closing design pack)

- [x] design-system.md tokens reflected in `frontend/src/theme/` (key palette
  covered by `theme.test.ts`)
- [x] wireframes.md routes and flows covered by tests (employees, insights
  chart, countries list, dialogs)
- [x] ux-flows.md sequences implemented for MVP scope; deferred items in
  tradeoffs.md
- [x] Deferred items listed in tradeoffs.md

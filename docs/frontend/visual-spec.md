# Frontend visual spec (MVP vs mockups)

> What we ship in v1 versus what the OrgPulse mockups show. Layout and flows
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
| Logo / product name “OrgPulse” | Text or simple wordmark in sidebar header (no marketing site chrome) |

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

## Current implementation gap

The running UI is still **unstyled HTML** from early TDD slices. This spec is
the target for upcoming **MUI + Recharts** red/green commits. Behavior already
in code (employees CRUD, basic insights table/dialog) will be **restyled and
re-wired** to match wireframes without changing API contracts.

| Area | Today | Target (MVP spec) |
|------|--------|-------------------|
| Shell | Top text nav | Sidebar + main layout |
| Insights chart | Empty list bullets in `figure` | Grouped Recharts bar chart |
| Insights tables | Country table + per-row button | Below-chart top-10 jobs + View all modal |
| Country list | Not routed | `/insights/countries` paginated table |
| Chart selection | Button per country | Bar click → single-country job table |

## Accessibility (MVP bar)

- Chart: `figure` + `aria-label`; bars keyboard-focusable where Recharts allows.
- Tables: proper `th scope="col"`; dialog `aria-labelledby`.
- Errors: `role="alert"`.
- Color: do not rely on color alone for min/avg/max (legend labels).

## Sign-off checklist (before closing design pack)

- [ ] design-system.md tokens reflected in `frontend/src/theme/`
- [ ] wireframes.md routes and flows covered by tests
- [ ] ux-flows.md sequences implemented or explicitly deferred with issue link
- [ ] Deferred items listed in tradeoffs.md

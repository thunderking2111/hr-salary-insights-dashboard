# Trade-offs and Decisions

> Record of intentional trade-offs made during the build. Each refactor commit
> also appends a short note here explaining what changed and why the previous
> invariants remain safe.

## Initial trade-offs

### SQLite over Postgres

- **Why**: Frictionless local dev; sufficient for 10k rows; assessment scope.
- **Cost**: Concurrency ceiling; not ideal for production multi-writer loads.
- **Mitigation**: ORM-driven model means a Postgres swap is a settings change.

### Django + DRF over a thin framework (FastAPI / Flask)

- **Why**: Batteries-included — ORM, admin, validation, routing all in one.
- **Cost**: Heavier than a minimal stack.
- **Mitigation**: We use only the parts we need; the app boundary is small.

### Server-side aggregation over client-side

- **Why**: Single source of truth; consistent metrics; cheap on small data.
- **Cost**: Slightly more API surface area.
- **Mitigation**: Aggregations live behind a small, well-tested service module.

### Backend-first delivery

- **Why**: Lock the API contract; demonstrate TDD on one language at a time.
- **Cost**: No clickable UI mid-way through.
- **Mitigation**: API is exercisable via tests, `httpie`/`curl`, and Django
  admin (when configured).

### Default currency `INR`

- **Why**: Org context is Indian; an `INR` default produces realistic
  examples (salary ranges, insights output) without implicit USD bias.
- **Cost**: Examples are denominated in a single currency.
- **Mitigation**: The `currency` field is persisted per employee, so future
  multi-currency support is a serializer + view change, not a schema change.

### Start with separate CRUD views, refactor to `ModelViewSet`

See [ADR 0002](adr/0002-views-then-viewset-refactor.md) for the full
rationale and the refactor checklist. Summary: an interim cost of slightly
more code buys a clean TDD history and an honest refactor commit at the end.

### Employee CRUD collapsed into `EmployeeViewSet` (2026-05-28)

- **What changed**: Separate list/create/retrieve/update/destroy view classes
  and manual URL entries were replaced by one `ModelViewSet` and a
  `DefaultRouter` registration.
- **Why safe**: All API tests are transport-level (URL, status, JSON) and were
  left unchanged; the full suite stayed green before and after. Paths remain
  `/api/employees/` and `/api/employees/{id}/`.

### Salary insights moved into `employees/services/insights.py` (2026-05-28)

- **What changed**: ORM aggregation left the insight views and now lives in
  pure service functions returning small dataclasses.
- **Why safe**: Insight API tests were not edited; URLs and JSON shapes are
  unchanged and the full suite stayed green. Views only serialize and respond.

### Insights performance: SQL medians, indexes, and cache (2026-06-05)

- **What changed**: Median salary is computed in SQLite via window functions in
  a single query per insight (no Python full-table scan). Indexes on `country`
  and `(country, job_title)` support group-by filters. Insight results are
  cached in LocMem with version-bump invalidation on employee create/update/delete
  and after seeding.
- **Why safe**: Existing insight correctness tests unchanged; new tests pin
  query count (1 DB query per uncached call), cache hits (0 queries), cache
  invalidation, indexes on the model, and a 10k-seed API latency budget.

## Deferred frontend UI

> Items visible in the OrgPulse mockups ([design pack](frontend/visual-spec.md))
> but **out of MVP scope**. Revisit after chart + country list + MUI shell slices
> are green.

| Area | Deferred item | Why defer |
|------|----------------|-----------|
| Shell | Sidebar groups, extra nav (Departments, Countries, Benchmarks, Reports, Settings) | No backend routes or product goal in README v1 |
| Employees | Search, filters, column visibility, export | Adds UX and API query complexity without core CRUD value |
| Employees | Right-hand profile / detail drawer | Not required for create-edit-delete |
| Insights | KPI / stat cards (totals, deltas, badges) | Needs extra metrics endpoints or client aggregates |
| Insights | Salary histogram, department charts, YoY table | Separate visualizations; not in README goals |
| Insights | Benchmark / external comparison panels | No benchmark data model |
| Insights | Global header search, notifications, avatar menu | Auth and notifications out of scope |
| Insights | Server-side pagination on `salary-by-country` | API returns full list; client pagination sufficient at ~10k employees scale for country count |
| Insights | Multi-country job table (compare several countries at once) | UX flows specify **single selected country** only |

### Insights chart job-title fetch ordering (2026-06-04)

- **Risk**: Rapid country changes on the chart could let a slow, stale
  `salary-by-job-title` response overwrite rows for the newly selected country.
- **Mitigation**: Abort the in-flight request when `chartCountry` changes;
  ignore `AbortError` in the effect. Job table header/data update together only
  after the latest request succeeds.
- **Why not a client cache**: Country count is small; explicit abort keeps MVP
  logic obvious and matches existing `useEffect` fetch style.

Approved MVP scope is documented in
[`docs/frontend/visual-spec.md`](frontend/visual-spec.md),
[`wireframes.md`](frontend/wireframes.md), and [`ux-flows.md`](frontend/ux-flows.md).

# ADR 0001 — Insights live as a service module inside `employees`, not a separate app

- **Status**: Accepted
- **Date**: Project bootstrap
- **Deciders**: HR Manager assessment author + AI pair
- **Supersedes**: —
- **Superseded by**: —

## Context

The application has two responsibilities:

1. CRUD over the `Employee` aggregate.
2. Salary insights derived **exclusively** from that same `Employee`
   aggregate.

We must decide where insights live.

## Considered options

### Option A — Separate `insights` Django app

Create `backend/insights/` with its own URLs, views, services.

- Pros: Visible separation; could host non-employee analytics later.
- Cons: Inter-app coupling on `Employee`; an extra boundary with no current
  decoupling benefit; premature modularization that would likely need to be
  reversed when learning more.

### Option B — Stuff aggregation logic in `views.py`

Compute aggregates directly inside DRF views.

- Pros: Minimal moving parts.
- Cons: Conflates HTTP and business logic; tests need a test client to
  exercise aggregations; reuse from management commands or admin is awkward.

### Option C — Service module inside the `employees` app  *(chosen)*

`backend/employees/services/insights.py` holds pure functions that take
primitive arguments and return small typed result objects. Views call into
this service.

- Pros:
  - Cohesion: insights derive from `Employee`; they belong with `Employee`.
  - Layering: HTTP, validation, and domain logic remain distinct.
  - Testability: services can be unit-tested without HTTP.
  - Reusability: same functions called from views, management commands, or
    the admin.
  - Easy future split: if insights ever grow their own data sources, lifting
    `services/insights.py` into a new app is a mechanical move.
- Cons:
  - Insights and `Employee` share a Django app (they share a model already).

## Decision

We adopt **Option C**.

## Consequences

- `backend/employees/services/insights.py` is the single home for aggregation
  logic.
- Aggregation tests target the service directly; API tests assert on HTTP
  shape only.
- A future ADR would be required to split into a standalone `insights` app
  (triggered by: cross-source analytics, persistent rollups, or separate
  ownership).

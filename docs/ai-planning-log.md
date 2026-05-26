# AI Planning Log

> Chronological record of AI-assisted planning checkpoints and decisions.
> Code-level prompts are intentionally kept out of git history during the build
> and will be promoted at the end of the project (final docs phase).

## Checkpoint 1 — Project framing

- **When**: Day 1, pre-implementation.
- **Decision**: Build backend first, then frontend.
- **Rationale**:
  - The assessment's core complexity is data and insights — they belong on the
    server.
  - Locking the API contract first makes the frontend trivially testable.
  - Strict TDD is easier to demonstrate on a single language at a time.

## Checkpoint 2 — Stack selection

- **Decision**: Django + DRF (backend), React + Vite + MUI (frontend), SQLite.
- **Rationale**:
  - Django + DRF maximizes signal-to-effort: ORM, validation, admin, routing.
  - Vite gives a fast frontend dev loop; MUI gives polish without YAK shaving.
  - SQLite is sufficient for 10k employees and removes infra friction.

## Checkpoint 3 — Commit discipline

- **Decision**: Approval-gated, ultra-small commits following red → green →
  refactor.
- **Rationale**: Demonstrates the Three Laws of TDD and produces a readable
  history that an interviewer can audit linearly.

## Checkpoint 4 — Documentation cadence

- **Decision**: Treat `docs/` as a living artifact updated each slice.
- **Rationale**: Final-day documentation dumps are unconvincing; incremental
  docs prove that planning happened throughout, not retroactively.

## Checkpoint 5 — Architecture defined upfront (not discovered mid-build)

- **When**: Pre-scaffold, during the bootstrap slice.
- **Decision**: Land a high-level [architecture document](architecture.md)
  and the first [ADR](adr/0001-insights-as-service-module.md) **before**
  writing a single line of production code. Implementation specifics
  (endpoint payloads, schema lengths, indexes) are committed alongside the
  code that introduces them.
- **Rationale**:
  - Architecture surprises mid-build are the most expensive kind of rework.
  - With the contract locked, every red test we write is justified by a
    concrete promise the API is making — not by an after-the-fact guess.
  - It makes the AI usage credible: planning visibly precedes coding rather
    than being narrated after the fact.
- **Boundaries fixed now**:
  - HTTP / serializer / service / model layers are distinct; views never
    embed aggregation logic.
  - Insights live in `employees/services/insights.py` (ADR 0001), not in a
    separate app.
  - Aggregations happen in SQL via the ORM (`AVG`, `MIN`, `MAX`, `COUNT`),
    never by iterating in Python.
  - Errors return a uniform envelope (`{ "error": { code, message, fields } }`).
  - Seeder uses `bulk_create` and a seeded RNG; deterministic by default.

## Checkpoint 6 — Defaults and build shape

- **When**: Pre-scaffold, immediately after locking the architecture.
- **Decisions**:
  - **Default currency = `INR`** (org context). See
    [tradeoffs](tradeoffs.md#default-currency-inr).
  - **Start CRUD with separate views, refactor to `ModelViewSet`** later.
    See [ADR 0002](adr/0002-views-then-viewset-refactor.md).

## Checkpoint 7 — AGENTS.md as operational source of truth

- **When**: Pre-scaffold, immediately before tooling setup.
- **Decision**: Land [`AGENTS.md`](../AGENTS.md) at the repo root with the
  non-negotiable rules an AI agent must follow on this codebase (no auto
  commits, no auto pushes, no secrets in history, no scope creep, no giant
  commits, no skipping tests for core behavior, no co-author trailers, etc.).
- **Rationale**: A short, explicit rulebook for AI agents reduces ambiguity
  far more reliably than rehearsing the same rules in each new conversation.

<!-- Future planning checkpoints will be appended here. -->

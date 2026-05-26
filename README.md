# HR Salary Insights Dashboard

A minimal yet production-quality salary management tool for an organization of
~10,000 employees. Built for an HR Manager persona to manage the workforce and
derive salary insights.

> Status: **in-progress** — backend-first build using strict TDD.

## High-level goals

- Manage employees (create, read, update, delete) via a clean UI.
- Compute salary insights:
  - Minimum, maximum, and average salary per country.
  - Average salary for a job title within a country.
  - Additional metrics meaningful to an HR Manager (added incrementally).
- Seed 10,000 employees fast and deterministically.

## Repository layout

```text
hr-salary-insights-dashboard/
  backend/                 # Django + DRF API (added incrementally)
  frontend/                # React + Vite UI (added after backend is complete)
  docs/                    # Living documentation (architecture, ADRs, etc.)
  AGENTS.md                # Operational rules for any AI agent on this repo
  README.md                # You are here
```

> The repository is built **backend-first**: backend APIs, tests, seeding, and
> backend CI are completed before the frontend begins.

## Engineering approach

- **Strict TDD** following the Three Laws of TDD.
  - Each behavior change goes through a red commit → green commit (→ optional
    refactor commit).
  - One failing test per red commit wherever possible.
- **Small, reviewable commits** with explicit intent in the commit message.
- **Living documentation** — `docs/` is updated alongside each slice.
- **AI-assisted, human-verified** — AI is used for acceleration; every change is
  reviewed, tested, and rationalized before commit.

## Documentation index

High-level architecture and key decisions are defined **upfront**;
implementation details (endpoint payloads, schema specifics) land with the
code that introduces them.

- [Architecture (high-level)](docs/architecture.md)
- [Architectural Decision Records (ADRs)](docs/adr/)
- [AI planning log](docs/ai-planning-log.md)
- [Testing strategy](docs/testing-strategy.md)
- [Trade-offs and decisions](docs/tradeoffs.md)
- [AGENTS.md](AGENTS.md) — operational rules for AI agents in this repo

## Getting started

The local toolchain and run instructions will be added with the corresponding
slices (Python tooling, Django scaffold, seeder, etc.).

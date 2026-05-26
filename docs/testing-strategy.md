# Testing Strategy

> Living document. Updated as new layers are added.

## Principles

- **Fast**: the suite must run in under a few seconds locally and in CI.
- **Deterministic**: no time, randomness, or network in tests unless explicitly
  controlled (seeded randomness, frozen clocks).
- **Readable**: each test states the behavior it asserts in its name; the body
  is arrange / act / assert with no clever indirection.
- **Tight feedback loop**: one behavior per red commit wherever possible.

## Layers (planned)

1. **Backend unit tests** — model validation, serializer logic, pure helpers.
2. **Backend integration tests (API)** — DRF view behavior end-to-end against
   an in-memory test database.
3. **Backend insight tests** — aggregation correctness on curated fixtures.
4. **Seeder tests** — correctness (full names, counts) and performance budget.
5. **Frontend component tests** — render, interaction, and contract-against-API
   behavior (added in the frontend phase).

## Tooling

- Python: `pytest` + `pytest-django`.
- Linting: `ruff` (run via `pre-commit` and in CI).
- Frontend (later): `vitest` + `@testing-library/react`.

## What we do not test (intentionally)

- Django framework itself.
- Third-party library internals.
- UI styles (we test behavior, not pixels).

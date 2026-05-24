# Technical decisions

Record of intentional choices for the salary management assessment. Updated as the implementation evolves.

## Stack

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend language | Python (Django) | Strong fit for ORM, admin, rapid API development; aligns with common JD preferences |
| API style | REST (DRF) | Simple contract for React; easy to test with `APIClient` |
| Database | **SQLite** | Explicitly allowed in assessment; zero ops for local dev and demo; 10k employees is well within SQLite comfort for this workload |
| Frontend | **React** (Vite) | Assessment specifies React or Next.js; Vite keeps build fast for a focused SPA |
| Auth | None for MVP | Persona is a single HR operator; avoids JWT/session scope creep; can document as post-MVP |

## Data model extras

Beyond required fields (full name, job title, country, salary):

| Field | Why |
|-------|-----|
| `email` | Practical HR identifier; optional uniqueness |
| `department` | Common filter dimension for managers |
| `currency` | Supports credible multi-country datasets even when insights are compared in one currency at a time |

Names split into `first_name` / `last_name` so the **seed script** can combine lines from `first_names.txt` and `last_names.txt` exactly as specified.

## Configuration

| Decision | Rationale |
|----------|-----------|
| `django-environ` + `DATABASE_URL` | Single env var for SQLite; easy to swap for Postgres in production if needed |
| `.env` gitignored, documented in README | No secrets in repo; simple onboarding without `.env.example` |

## Code quality & process

| Decision | Rationale |
|----------|-----------|
| **TDD** with pytest + pytest-django | Assessment expects meaningful unit tests; red-green-refactor shows in commit history |
| Ruff + pre-commit | Consistent style; catches issues before review |
| Incremental commits | Chore → docs → data files → Django → tests/features → UI → deploy/demo |

### TDD: 404 tests deferred to GREEN (new endpoints)

For a **new URL**, a test that only asserts `response.status_code == 404` can **pass at RED** before the route exists (Django returns 404 for “URL not found”), which is a false green.

**Compromise used on** `GET /api/v1/insights/by-country/{country}/`:

- **RED:** happy path only (expects 200; fails with 404 until the route exists).
- **GREEN:** implementation plus the “no employees for this country → 404” test.

**Alternative for strict RED:** assert JSON body shape, or that a sibling URL returns 200, so the 404 test fails until the view is wired.

We may use the stricter pattern on later endpoints; this note is for reviewers reading commit history.

### TDD: batch RED tests for one feature slice

For a **single cohesive capability** (one command, one viewset, one service), multiple small tests in **one RED commit** are acceptable when they share the same fixture setup and one GREEN implementation satisfies all of them.

**Used for:** Employee CRUD API (five tests), `seed_employees` (four tests in `employees/tests/test_seed.py`).

**Still prefer one test per RED** for isolated model rules (e.g. `__str__`, salary validator) where each commit maps to one behavior.

This keeps commit history readable without requiring a RED commit per assertion on every feature.

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

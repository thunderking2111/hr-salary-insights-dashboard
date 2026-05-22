# Agent instructions (Cursor)

Guidance for AI agents working on this repository. Read this file first, then [`README.md`](README.md) for assessment scope and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) / [`docs/DECISIONS.md`](docs/DECISIONS.md) for design detail.

## Project

- **Goal:** Salary management tool for **10,000 employees** (HR Manager persona).
- **Stack:** Django 6 + DRF + SQLite (`DATABASE_URL` in `.env`), React (Vite) frontend, pytest + pytest-django.
- **Deliverables:** Employee CRUD + salary insights in UI, performant seed script, deployment, video demo, incremental commits with tests.

## Required behavior (assessment)

Implement only what the JD requires in **README** product scope unless the user explicitly asks for more:

- **UI:** Add, view, update, delete employees.
- **Employee fields:** Full name, job title, country, salary (+ optional extras documented in `DECISIONS.md`).
- **Insights (UI):** Min, max, avg salary per country; avg salary by job title in a country; other HR-useful metrics as agreed in docs.
- **Seed:** 10,000 rows; names from `data/first_names.txt` + `data/last_names.txt`; optimize for **repeat runs** (`bulk_create`, batched transactions).
- **Tests:** Meaningful, fast, deterministic unit/API tests — prefer **TDD** (failing test → minimal code → refactor).

## Development workflow

1. **TDD:** Add or update a failing test, implement the smallest change to pass, refactor if needed. Keep tests isolated and readable.
2. **Commits:** Small, logical steps with [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `test:`, `fix:`, `docs:`, `chore:`).
3. **Quality:** Match existing style; run `ruff check` / `ruff format` on Python changes. Respect pre-commit hooks.
4. **Docs:** Update `docs/DECISIONS.md` when making non-obvious trade-offs; do not duplicate full architecture in code comments.

## Implementation rules

| Topic | Rule |
|-------|------|
| Insights | Compute with DB aggregations (`annotate` / `aggregate`), not Python over the full queryset |
| API | REST under `/api/v1/`; consistent DRF error responses |
| CORS | Enable for local React dev when frontend exists |
| Auth | **No authentication** for MVP unless the user asks |
| Secrets | Never commit `.env`, `db.sqlite3`, `venv/`, or `node_modules/` |

## Repository layout (target)

```text
backend/          # Django + DRF
frontend/         # React (Vite)
data/             # first_names.txt, last_names.txt
docs/             # ARCHITECTURE.md, DECISIONS.md
scripts/          # seed helpers (if not a management command)
```

## Commands

```bash
# Quality
ruff check .
ruff format .
pre-commit run --all-files
pytest
```

## When unsure

- Prefer **simpler** solutions over extra abstractions.
- Align with [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) API sketch; propose changes in `DECISIONS.md` before large deviations.
- Ask the user before adding dependencies, auth, or scope outside the README/JD.

## Do not

- Create commits unless the user asks.
- Push to remote unless the user asks.
- Commit real `.env` values.
- Replace README product scope with extra features without user approval.
- Generate enormous single commits or skip tests for core behavior.

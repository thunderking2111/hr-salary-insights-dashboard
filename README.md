# HR Salary Insights Dashboard

A minimal yet production-quality salary management tool for an organization of
~10,000 employees. Built for an HR Manager persona to manage the workforce and
derive salary insights.

> Status: **MVP in progress** — backend APIs and seeding are in place; the
> React frontend implements employees CRUD and salary insights (chart, job
> tables, country list) with strict TDD.

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
  frontend/                # React + Vite + MUI + Recharts UI
  docs/                    # Living documentation (architecture, ADRs, etc.)
  AGENTS.md                # Operational rules for any AI agent on this repo
  README.md                # You are here
```

> Build order was **backend-first** (APIs, tests, seeding, CI), then frontend
> features slice-by-slice with Vitest + Testing Library.

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

### Prerequisites

- Python 3.10+
- `git`

### Backend setup

```bash
# 1. Create and activate a virtual environment.
python3 -m venv .venv
source .venv/bin/activate

# 2. Install backend dependencies (runtime + dev).
pip install -r backend/requirements-dev.txt

# 3. Install pre-commit git hooks.
pre-commit install

# 4. Configure backend environment.
cp backend/.env.example backend/.env
# Edit backend/.env and set DJANGO_SECRET_KEY (required).
# Generate a key with:
#   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Backend commands

All backend commands run from the `backend/` directory.

```bash
cd backend
export $(grep -v '^#' .env | xargs)   # load env vars from .env

python manage.py check        # project sanity check
python manage.py migrate      # apply DB migrations
python manage.py seed_employees --count=10000 --seed=42 --clear
                              # bulk-load demo data (default count is 10000)
python manage.py runserver    # local dev server

pytest -v                     # run the test suite
```

### Frontend setup

Requires Node.js 20+.

```bash
cd frontend
npm ci                        # install dependencies (use npm install if no lockfile yet)
npm run lint                  # ESLint
npm run lint:fix              # ESLint with auto-fix
npm run build                 # typecheck + production bundle
npm run dev                   # Vite dev server (proxies /api to Django)
npm test                      # Vitest
```

Seed the backend (`python manage.py seed_employees` from `backend/`) and run
`runserver` before using insights or the employee directory in the browser.

The Vite dev server proxies `/api` and `/health` to `http://127.0.0.1:8000` when
you run the Django backend separately.

### Backend health and UI status

The backend exposes `GET /health/` (readiness check with a database ping). The
frontend sidebar shows a status indicator:

- **Starting server…** (amber) — polling `/health/`; common on first load after a
  Render free-tier cold start (may take up to a minute).
- **API online** (green) — backend is ready for requests.

When deploying to Render, set the service **Health Check Path** to `/health/`.

### Quality gates

Run from the repo root.

```bash
ruff check .
ruff format --check .
pre-commit run --all-files
```

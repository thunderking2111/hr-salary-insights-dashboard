# HR Salary Insights Dashboard

A minimal yet production-quality salary management tool for an organization of
~10,000 employees. Built for an HR Manager persona to manage the workforce and
derive salary insights.

> Status: **MVP complete** — backend APIs, seeding, health check, and React UI
> (employees CRUD + salary insights) are in place with strict TDD and CI.

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

## Deployment (Render + Vercel)

Deploy from a **`production`** branch that tracks `master`. Application deploy
config lives on `master`; secrets and URLs are set in each platform's dashboard.

### 1. Render (backend)

| Setting | Value |
|---------|--------|
| Root Directory | `backend` |
| Runtime | Python 3.12 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | See [`render.yaml`](render.yaml) or below |
| Health Check Path | `/health/` |

Start command (SQLite is ephemeral — migrate and seed on each cold start):

```bash
python manage.py migrate --noinput && \
python manage.py shell -c "from django.core.management import call_command; from employees.models import Employee; call_command('seed_employees', count=10000, seed=42) if Employee.objects.count() == 0 else None" && \
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

Environment variables (set in Render dashboard):

| Variable | Example |
|----------|---------|
| `DJANGO_SECRET_KEY` | Generate a long random string |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `your-app.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |

Alternatively, use the committed [`render.yaml`](render.yaml) Blueprint and fill
in `DJANGO_ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` after the first deploy.

### 2. Vercel (frontend)

| Setting | Value |
|---------|--------|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 20 |

Environment variable (Production):

```bash
VITE_API_BASE=https://your-app.onrender.com
```

No trailing slash. See [`frontend/.env.example`](frontend/.env.example).

[`frontend/vercel.json`](frontend/vercel.json) rewrites all routes to
`index.html` so React Router paths work on refresh.

### 3. Deploy order

1. Push `production` branch and deploy **Render** backend → note the URL.
2. Set **`VITE_API_BASE`** on Vercel to that URL → deploy **frontend**.
3. Set **`CORS_ALLOWED_ORIGINS`** on Render to your Vercel URL → redeploy backend.
4. Smoke test: sidebar shows **API online** → employees list → insights chart.

**Note:** Render free tier spins down after 15 minutes idle; first request may
take up to a minute. The sidebar status indicator shows **Starting server…**
during cold starts.

### Quality gates

Run from the repo root.

```bash
ruff check .
ruff format --check .
pre-commit run --all-files
```

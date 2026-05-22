# Architecture

## Overview

```text
┌─────────────────┐     HTTPS/JSON       ┌──────────────────────────┐
│  React SPA      │ ◄──────────────────► │  Django + DRF (backend)  │
│  (HR UI)        │                      │  employees + insights    │
└─────────────────┘                      └────────────┬─────────────┘
                                                      │
                                                      ▼
                                           ┌──────────────────────┐
                                           │  SQLite (db.sqlite3) │
                                           └──────────────────────┘
```

The HR Manager uses a browser-based UI for CRUD and dashboards. The API owns validation, aggregations, and persistence. SQLite satisfies the assessment’s relational-database requirement without extra infrastructure for local dev and deployment.

## Technology stack

| Layer | Choice | Role |
|-------|--------|------|
| API | Django 6 + Django REST Framework | REST resources, validation, ORM |
| Database | SQLite | Single-file DB; suitable for 10k-row dataset and demo deploy |
| Config | django-environ | `DATABASE_URL`, `SECRET_KEY`, `DEBUG` from `.env` |
| UI | React (Vite) | Component-based HR screens per assessment |
| UI kit | TBD (e.g. MUI or shadcn/ui) | Tables, forms, layout |
| Tests | pytest + pytest-django | Fast, deterministic unit/API tests (TDD) |
| Quality | Ruff + pre-commit | Lint/format on commit |

## Repository layout (target)

```text
hr-salary-insights-dashboard/
├── backend/                 # Django project root
│   ├── config/              # settings, urls, wsgi
│   ├── employees/           # models, serializers, views, services
│   ├── insights/            # aggregation endpoints (or nested under employees)
│   ├── tests/
│   └── manage.py
├── frontend/                # React app
│   └── src/
│       ├── pages/           # Employees, Insights
│       ├── components/
│       └── api/             # API client
├── scripts/
│   └── seed_employees.py    # 10k rows; uses first_names.txt / last_names.txt
├── data/
│   ├── first_names.txt
│   └── last_names.txt
├── docs/
├── requirements.txt
└── README.md
```

Structure may evolve slightly (e.g. single `employees` app with an `insights` submodule) but keeps API and UI separable for review.

## Domain model

### Employee

| Field | Type | Notes |
|-------|------|--------|
| `id` | PK | Surrogate key |
| `first_name` | string | UI composes full name; seed script combines name files |
| `last_name` | string | |
| `job_title` | string | Indexed for filters/aggregates |
| `country` | string | Indexed |
| `salary` | decimal | Positive; stored with sensible precision |
| `email` | string, optional | Unique when present |
| `department` | string, optional | |
| `currency` | string | Default `USD` |
| `created_at` / `updated_at` | datetime | Audit for HR edits |

Full name is exposed in API/UI as `first_name` + `last_name` (no redundant stored full name unless needed for search).

## API design (planned)

Base path: `/api/v1/`

### Employees

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/employees/` | Paginated list; query: `country`, `job_title`, `search` |
| `POST` | `/employees/` | Create |
| `GET` | `/employees/{id}/` | Detail |
| `PUT` / `PATCH` | `/employees/{id}/` | Update |
| `DELETE` | `/employees/{id}/` | Delete |

### Insights

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/insights/by-country/` | `min`, `max`, `avg`, `median`, `count` per country |
| `GET` | `/insights/by-country/{country}/` | Same metrics for one country |
| `GET` | `/insights/by-title/` | `avg` (and `count`) per job title; query: `country` (required or strongly encouraged) |

Aggregations run in the database (`Min`, `Max`, `Avg`, `Count`, etc.) — not in Python over full table scans for 10k rows.

### Cross-cutting

- **Pagination**: cursor or page-number on employee list (default page size ~25–50).
- **CORS**: enabled for local React origin in development.
- **Errors**: consistent JSON error bodies from DRF.

## Frontend views (planned)

| View | Behavior |
|------|----------|
| **Employees** | Sortable/filterable table; add/edit modal or drawer; delete with confirmation |
| **Insights** | Country selector; cards/table for min/max/avg (and median/count); job title + country for average-by-title |

## Seeding

- Management command or `scripts/seed_employees.py` invoked via `python manage.py seed_employees`.
- Reads `data/first_names.txt` and `data/last_names.txt`; random combinations with varied titles, countries, salaries.
- Uses **`bulk_create`** in batches (e.g. 500–1000) inside `transaction.atomic` for speed on repeated runs.

## Testing strategy

- **Unit**: model validation, insight calculation helpers.
- **API**: DRF `APIClient` — CRUD flows and insight endpoints with small fixtures.
- **No** full-browser E2E in MVP unless time permits; video demo covers UI manually.

Tests remain fast (SQLite in-memory or file per pytest-django session).

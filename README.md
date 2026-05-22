# HR Salary Insights Dashboard

A minimal, usable salary management tool for an organization with **10,000 employees**. Built for **HR Managers** to maintain employee records and explore salary insights by country and role.

## Product & scope

### Goal

Build a minimal yet usable salary management tool for an organization with **10,000 employees**.

### Persona

**HR Manager** of the organization.

### Requirements

**Managing employees (UI)**

- Add, view, update, and delete employees
- Each employee has a **full name**, **job title**, **country**, and **salary**, plus any other meaningful fields chosen during implementation

**Salary insights (UI)**

- Minimum, maximum, and average salary of employees in a **country**
- Average salary for a given **job title** in a **country**
- Any other meaningful metrics helpful for the HR Manager persona

### Technical expectations

- End-to-end, fully functional software (**backend** and **UI**)
- Relational database (this project uses **SQLite**)
- **React** (or Next.js) with a component library of your choice
- Seed script for **10,000 employees**; full names from `first_names.txt` and `last_names.txt` (performance matters for repeated runs)
- **Deployed** application and **video demo** of the software
- Meaningful **unit tests** (fast, deterministic); incremental **commits**; design artifacts under [`docs/`](docs/)

## Prerequisites

- Python 3.12+
- Node.js 20+ (for the React frontend, once added)
- No separate database server — **SQLite** (`db.sqlite3`, gitignored)

## Local setup

1. **Clone and enter the project**

   ```bash
   cd hr-salary-insights-dashboard
   ```

2. **Create a virtual environment and install dependencies**

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt -r requirements-dev.txt
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root (not committed). At minimum:

   ```env
   DEBUG=True
   SECRET_KEY=your-local-secret-key
   DATABASE_URL=sqlite:///db.sqlite3
   ```

4. **Install pre-commit hooks**

   ```bash
   pre-commit install
   ```

## Development

| Task | Command |
|------|---------|
| Lint / format | `ruff check .` and `ruff format .` |
| Run hooks manually | `pre-commit run --all-files` |
| Run tests | `pytest` (after the Django project and tests are added) |

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — system design, stack, and API overview
- [Technical decisions](docs/DECISIONS.md) — trade-offs, seeding, testing, and AI workflow
- [Agent instructions](AGENTS.md) — Cursor / AI workflow for this repo

# HR Salary Insights Dashboard

Minimal salary management and insights tool for HR managers — employee CRUD and salary analytics by country and job title.

## Prerequisites

- Python 3.12+
- No separate database server — the app uses **SQLite** (`db.sqlite3`, gitignored)

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

   Create a `.env` file in the project root (see `.gitignore` — it is not committed). At minimum:

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

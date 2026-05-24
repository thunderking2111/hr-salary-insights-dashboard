import random
from decimal import Decimal
from pathlib import Path

from django.conf import settings
from django.db import transaction

from employees.models import Employee

DEFAULT_BATCH_SIZE = 500
DEFAULT_COUNT = 10_000

JOB_TITLES = (
    "Software Engineer",
    "Senior Software Engineer",
    "Product Manager",
    "HR Manager",
    "Data Analyst",
    "Sales Representative",
    "Marketing Specialist",
    "Financial Analyst",
    "Operations Manager",
    "Customer Success Manager",
)

COUNTRIES = ("US", "UK", "CA", "DE", "FR", "IN", "AU", "SG", "NL", "ES")

SALARY_MIN = Decimal("30000.00")
SALARY_MAX = Decimal("250000.00")


def _default_data_dir() -> Path:
    return Path(settings.PROJECT_ROOT) / "data"


def _load_name_lines(path: Path) -> list[str]:
    names = [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    if not names:
        raise ValueError(f"No names found in {path}")
    return names


def _random_salary(rng: random.Random) -> Decimal:
    raw = rng.uniform(float(SALARY_MIN), float(SALARY_MAX))
    return Decimal(str(round(raw, 2)))


def _build_employee(rng: random.Random, first_names: list[str], last_names: list[str]) -> Employee:
    return Employee(
        first_name=rng.choice(first_names),
        last_name=rng.choice(last_names),
        job_title=rng.choice(JOB_TITLES),
        country=rng.choice(COUNTRIES),
        salary=_random_salary(rng),
    )


def seed_employees(
    *,
    count: int = DEFAULT_COUNT,
    batch_size: int = DEFAULT_BATCH_SIZE,
    data_dir: Path | None = None,
    clear: bool = True,
    rng: random.Random | None = None,
) -> int:
    data_dir = data_dir or _default_data_dir()
    first_names = _load_name_lines(data_dir / "first_names.txt")
    last_names = _load_name_lines(data_dir / "last_names.txt")
    rng = rng or random.Random()

    batch: list[Employee] = []
    created = 0

    with transaction.atomic():
        if clear:
            Employee.objects.all().delete()

        for _ in range(count):
            batch.append(_build_employee(rng, first_names, last_names))
            if len(batch) >= batch_size:
                Employee.objects.bulk_create(batch)
                created += len(batch)
                batch = []

        if batch:
            Employee.objects.bulk_create(batch)
            created += len(batch)

    return created

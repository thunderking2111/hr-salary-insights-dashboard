import random
from datetime import date, timedelta
from decimal import Decimal
from pathlib import Path

from django.db import transaction

from employees.models import Employee
from employees.services.insights_cache import invalidate_insights_cache

DATA_DIR = Path(__file__).resolve().parent / "data"
DEFAULT_BATCH_SIZE = 1000

# Weights align line-for-line with countries.txt (India remains the largest hub).
COUNTRY_WEIGHTS = (
    30,
    12,
    8,
    7,
    6,
    5,
    5,
    4,
    4,
    4,
    3,
    3,
    3,
    2,
    2,
    2,
    2,
    2,
)
DEPARTMENTS = ("Engineering", "Human Resources", "Product", "Finance", "Operations")
EMPLOYMENT_TYPES = ("full_time", "part_time", "contract")


def _load_name_list(filename: str) -> tuple[str, ...]:
    path = DATA_DIR / filename
    return tuple(
        line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()
    )


def _load_country_choices() -> tuple[tuple[str, ...], tuple[int, ...]]:
    countries = _load_name_list("countries.txt")
    weights = COUNTRY_WEIGHTS
    if len(countries) != len(weights):
        raise ValueError("countries.txt and COUNTRY_WEIGHTS must have the same length.")
    return countries, weights


def build_employee(
    *,
    index: int,
    rng: random.Random,
    first_names: tuple[str, ...],
    last_names: tuple[str, ...],
    countries: tuple[str, ...],
    country_weights: tuple[int, ...],
    job_titles: tuple[str, ...],
) -> Employee:
    first_name = rng.choice(first_names)
    last_name = rng.choice(last_names)
    join_offset_days = rng.randint(0, 365 * 12)
    return Employee(
        first_name=first_name,
        last_name=last_name,
        email=f"{first_name.lower()}.{last_name.lower()}.{index}@example.com",
        job_title=rng.choice(job_titles),
        department=rng.choice(DEPARTMENTS),
        employment_type=rng.choice(EMPLOYMENT_TYPES),
        country=rng.choices(countries, weights=country_weights, k=1)[0],
        salary=Decimal(rng.randint(300_000, 5_000_000)),
        currency="INR",
        date_of_joining=date(2012, 1, 1) + timedelta(days=join_offset_days),
    )


def seed_employees(*, count: int, seed: int, batch_size: int = DEFAULT_BATCH_SIZE) -> int:
    rng = random.Random(seed)
    first_names = _load_name_list("first_names.txt")
    last_names = _load_name_list("last_names.txt")
    countries, country_weights = _load_country_choices()
    job_titles = _load_name_list("job_titles.txt")
    batch: list[Employee] = []

    for index in range(count):
        batch.append(
            build_employee(
                index=index,
                rng=rng,
                first_names=first_names,
                last_names=last_names,
                countries=countries,
                country_weights=country_weights,
                job_titles=job_titles,
            )
        )
        if len(batch) >= batch_size:
            Employee.objects.bulk_create(batch)
            batch.clear()

    if batch:
        Employee.objects.bulk_create(batch)

    return count


def seed_employees_in_transaction(*, count: int, seed: int, clear: bool = False) -> int:
    with transaction.atomic():
        if clear:
            Employee.objects.all().delete()
        created = seed_employees(count=count, seed=seed)
    invalidate_insights_cache()
    return created

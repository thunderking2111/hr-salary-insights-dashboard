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
EMPLOYMENT_TYPE_SALARY_FACTORS = {
    "full_time": Decimal("1.00"),
    "part_time": Decimal("0.55"),
    "contract": Decimal("0.80"),
}


def _load_name_list(filename: str) -> tuple[str, ...]:
    path = DATA_DIR / filename
    return tuple(
        line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()
    )


def _load_country_salary_bands() -> dict[str, tuple[int, int]]:
    countries = _load_name_list("countries.txt")
    bands_path = DATA_DIR / "country_salary_bands.txt"
    band_lines = [
        line.strip() for line in bands_path.read_text(encoding="utf-8").splitlines() if line.strip()
    ]
    if len(countries) != len(band_lines):
        raise ValueError("countries.txt and country_salary_bands.txt must have the same length.")

    bands: dict[str, tuple[int, int]] = {}
    for country, band_line in zip(countries, band_lines, strict=True):
        minimum, maximum = (int(value.strip()) for value in band_line.split(","))
        if minimum >= maximum:
            raise ValueError(f"Invalid salary band for {country}: {minimum} >= {maximum}")
        bands[country] = (minimum, maximum)
    return bands


def _load_job_title_salary_tiers() -> dict[str, Decimal]:
    job_titles = _load_name_list("job_titles.txt")
    tier_values = tuple(
        Decimal(line.strip())
        for line in (DATA_DIR / "job_title_salary_tiers.txt")
        .read_text(encoding="utf-8")
        .splitlines()
        if line.strip()
    )
    if len(job_titles) != len(tier_values):
        raise ValueError("job_titles.txt and job_title_salary_tiers.txt must have the same length.")
    return dict(zip(job_titles, tier_values, strict=True))


def _load_country_choices() -> tuple[tuple[str, ...], tuple[int, ...]]:
    countries = _load_name_list("countries.txt")
    weights = COUNTRY_WEIGHTS
    if len(countries) != len(weights):
        raise ValueError("countries.txt and COUNTRY_WEIGHTS must have the same length.")
    return countries, weights


def generate_salary(
    *,
    rng: random.Random,
    country: str,
    job_title: str,
    employment_type: str,
    country_bands: dict[str, tuple[int, int]],
    job_tiers: dict[str, Decimal],
) -> Decimal:
    band_min, band_max = country_bands[country]
    tier = job_tiers[job_title]
    employment_factor = EMPLOYMENT_TYPE_SALARY_FACTORS[employment_type]
    base = Decimal(rng.randint(band_min, band_max))
    variance = Decimal(str(rng.uniform(0.9, 1.1)))
    salary = (base * tier * employment_factor * variance).quantize(Decimal("1"))
    floor = (Decimal(band_min) * Decimal("0.7")).quantize(Decimal("1"))
    ceiling = (Decimal(band_max) * tier * Decimal("1.15")).quantize(Decimal("1"))
    return max(floor, min(salary, ceiling))


def build_employee(
    *,
    index: int,
    rng: random.Random,
    first_names: tuple[str, ...],
    last_names: tuple[str, ...],
    countries: tuple[str, ...],
    country_weights: tuple[int, ...],
    job_titles: tuple[str, ...],
    country_bands: dict[str, tuple[int, int]],
    job_tiers: dict[str, Decimal],
) -> Employee:
    first_name = rng.choice(first_names)
    last_name = rng.choice(last_names)
    join_offset_days = rng.randint(0, 365 * 12)
    country = rng.choices(countries, weights=country_weights, k=1)[0]
    job_title = rng.choice(job_titles)
    employment_type = rng.choice(EMPLOYMENT_TYPES)
    return Employee(
        first_name=first_name,
        last_name=last_name,
        email=f"{first_name.lower()}.{last_name.lower()}.{index}@example.com",
        job_title=job_title,
        department=rng.choice(DEPARTMENTS),
        employment_type=employment_type,
        country=country,
        salary=generate_salary(
            rng=rng,
            country=country,
            job_title=job_title,
            employment_type=employment_type,
            country_bands=country_bands,
            job_tiers=job_tiers,
        ),
        currency="INR",
        date_of_joining=date(2012, 1, 1) + timedelta(days=join_offset_days),
    )


def seed_employees(*, count: int, seed: int, batch_size: int = DEFAULT_BATCH_SIZE) -> int:
    rng = random.Random(seed)
    first_names = _load_name_list("first_names.txt")
    last_names = _load_name_list("last_names.txt")
    countries, country_weights = _load_country_choices()
    job_titles = _load_name_list("job_titles.txt")
    country_bands = _load_country_salary_bands()
    job_tiers = _load_job_title_salary_tiers()
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
                country_bands=country_bands,
                job_tiers=job_tiers,
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

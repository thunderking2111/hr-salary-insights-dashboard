import time
from decimal import Decimal

import pytest
from django.core.management import call_command
from django.db.models import Count

from employees.models import Employee
from employees.services.insights import salary_stats_by_country, salary_stats_by_job_title

MIN_COUNTRIES_FOR_VIEW_ALL_PAGINATION = 9
MIN_JOB_TITLES_FOR_VIEW_ALL_DIALOG = 11
SEED_DATASET_SEED = 42
SEED_DATASET_COUNT = 10_000


@pytest.mark.django_db
def test_seed_employees_creates_requested_count():
    call_command("seed_employees", count=5, seed=42, clear=True)

    assert Employee.objects.count() == 5


@pytest.mark.django_db
def test_seed_employees_is_deterministic_for_same_seed():
    call_command("seed_employees", count=3, seed=99, clear=True)
    first_run = list(
        Employee.objects.order_by("email").values(
            "email",
            "first_name",
            "last_name",
            "job_title",
            "country",
            "salary",
        )
    )

    call_command("seed_employees", count=3, seed=99, clear=True)
    second_run = list(
        Employee.objects.order_by("email").values(
            "email",
            "first_name",
            "last_name",
            "job_title",
            "country",
            "salary",
        )
    )

    assert first_run == second_run


@pytest.mark.django_db
def test_seed_employees_10k_within_performance_budget():
    start = time.monotonic()
    call_command("seed_employees", count=10000, seed=42, clear=True)
    elapsed = time.monotonic() - start

    assert Employee.objects.count() == 10000
    assert elapsed < 5.0


@pytest.mark.django_db
def test_seeded_insights_include_enough_countries_for_view_all_pagination():
    call_command(
        "seed_employees",
        count=SEED_DATASET_COUNT,
        seed=SEED_DATASET_SEED,
        clear=True,
    )

    countries = salary_stats_by_country()

    assert len(countries) >= MIN_COUNTRIES_FOR_VIEW_ALL_PAGINATION


@pytest.mark.django_db
def test_seeded_insights_include_enough_job_titles_for_view_all_dialog():
    call_command(
        "seed_employees",
        count=SEED_DATASET_COUNT,
        seed=SEED_DATASET_SEED,
        clear=True,
    )

    india_job_titles = salary_stats_by_job_title(country="India")

    assert len(india_job_titles) >= MIN_JOB_TITLES_FOR_VIEW_ALL_DIALOG


@pytest.mark.django_db
def test_seeded_dataset_includes_all_configured_countries_and_job_titles():
    call_command(
        "seed_employees",
        count=SEED_DATASET_COUNT,
        seed=SEED_DATASET_SEED,
        clear=True,
    )

    configured_country_count = Employee.objects.values("country").distinct().count()
    configured_job_title_count = Employee.objects.values("job_title").distinct().count()

    assert configured_country_count >= MIN_COUNTRIES_FOR_VIEW_ALL_PAGINATION
    assert configured_job_title_count >= MIN_JOB_TITLES_FOR_VIEW_ALL_DIALOG
    assert (
        Employee.objects.filter(country="India")
        .values("job_title")
        .annotate(title_count=Count("pk"))
        .count()
        >= MIN_JOB_TITLES_FOR_VIEW_ALL_DIALOG
    )


@pytest.mark.django_db
def test_seeded_insights_rank_high_cost_countries_above_low_cost_markets():
    call_command(
        "seed_employees",
        count=SEED_DATASET_COUNT,
        seed=SEED_DATASET_SEED,
        clear=True,
    )

    stats = {row.country: row for row in salary_stats_by_country()}

    assert stats["United States"].avg_salary > stats["India"].avg_salary * Decimal("1.20")
    assert stats["Switzerland"].avg_salary > stats["Poland"].avg_salary * Decimal("1.20")

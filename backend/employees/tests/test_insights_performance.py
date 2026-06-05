from decimal import Decimal

import pytest
from django.core.management import call_command
from django.db import connection
from django.test.utils import CaptureQueriesContext

from employees.models import Employee
from employees.services.insights import salary_stats_by_country, salary_stats_by_job_title
from employees.tests.conftest import employee_create_kwargs

SALARY_BY_COUNTRY_URL = "/api/insights/salary-by-country/"


@pytest.mark.django_db
def test_salary_stats_by_country_reflects_new_employees_after_cache_warm():
    Employee.objects.create(**employee_create_kwargs(country="India", salary="1000000.00"))
    Employee.objects.create(
        **employee_create_kwargs(
            email="grace.hopper@example.com",
            country="India",
            salary="2000000.00",
        )
    )
    salary_stats_by_country()

    Employee.objects.create(
        **employee_create_kwargs(
            email="alan.turing@example.com",
            country="India",
            salary="10000000.00",
        )
    )

    india = next(row for row in salary_stats_by_country() if row.country == "India")

    assert india.employee_count == 3
    assert india.avg_salary == Decimal("4333333.33333333")
    assert india.median_salary == Decimal("2000000.00")


@pytest.mark.django_db
def test_employee_model_has_insights_indexes():
    index_fields = [tuple(index.fields) for index in Employee._meta.indexes]

    assert ("country",) in index_fields
    assert ("country", "job_title") in index_fields


@pytest.mark.django_db
def test_salary_stats_by_country_uses_single_database_query():
    Employee.objects.create(**employee_create_kwargs(country="India", salary="1000000.00"))
    Employee.objects.create(
        **employee_create_kwargs(
            email="grace.hopper@example.com",
            country="United States",
            salary="3000000.00",
        )
    )

    with CaptureQueriesContext(connection) as context:
        salary_stats_by_country()

    assert len(context.captured_queries) == 1


@pytest.mark.django_db
def test_salary_stats_by_job_title_uses_single_database_query():
    Employee.objects.create(
        **employee_create_kwargs(
            country="India",
            job_title="Software Engineer",
            salary="1000000.00",
        )
    )
    Employee.objects.create(
        **employee_create_kwargs(
            email="grace.hopper@example.com",
            country="India",
            job_title="Director",
            salary="3000000.00",
        )
    )

    with CaptureQueriesContext(connection) as context:
        salary_stats_by_job_title(country="India")

    assert len(context.captured_queries) == 1


@pytest.mark.django_db
def test_salary_stats_by_country_is_served_from_cache_without_queries():
    Employee.objects.create(**employee_create_kwargs(country="India", salary="1000000.00"))
    salary_stats_by_country()

    with CaptureQueriesContext(connection) as context:
        salary_stats_by_country()

    assert len(context.captured_queries) == 0


@pytest.mark.django_db
def test_salary_stats_by_country_cache_invalidates_on_employee_create():
    Employee.objects.create(**employee_create_kwargs(country="India", salary="1000000.00"))
    before = salary_stats_by_country()
    india_before = next(row for row in before if row.country == "India")
    assert india_before.employee_count == 1

    Employee.objects.create(
        **employee_create_kwargs(
            email="grace.hopper@example.com",
            country="India",
            salary="3000000.00",
        )
    )

    after = salary_stats_by_country()
    india_after = next(row for row in after if row.country == "India")
    assert india_after.employee_count == 2


@pytest.mark.django_db
def test_salary_stats_by_country_with_10k_rows_uses_single_database_query():
    call_command("seed_employees", count=10000, seed=42, clear=True)

    with CaptureQueriesContext(connection) as context:
        salary_stats_by_country()

    assert len(context.captured_queries) == 1

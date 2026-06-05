import pytest
from django.db import connection
from django.test.utils import CaptureQueriesContext

from employees.models import Employee
from employees.services.insights import salary_stats_by_country, salary_stats_by_job_title
from employees.tests.conftest import employee_create_kwargs


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

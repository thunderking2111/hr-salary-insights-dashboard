from decimal import Decimal

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from employees.models import Employee
from employees.tests.conftest import employee_create_kwargs

SALARY_BY_COUNTRY_URL = "/api/insights/salary-by-country/"
SALARY_BY_JOB_TITLE_URL = "/api/insights/salary-by-job-title/"


@pytest.mark.django_db
def test_salary_by_country_returns_min_max_and_avg_per_country():
    Employee.objects.create(**employee_create_kwargs(country="India", salary=Decimal("1000000.00")))
    Employee.objects.create(
        **employee_create_kwargs(
            email="grace.hopper@example.com",
            country="India",
            salary=Decimal("3000000.00"),
        )
    )
    Employee.objects.create(
        **employee_create_kwargs(
            email="alan.turing@example.com",
            country="United States",
            salary=Decimal("5000000.00"),
        )
    )
    client = APIClient()

    response = client.get(SALARY_BY_COUNTRY_URL)

    assert response.status_code == status.HTTP_200_OK
    by_country = {row["country"]: row for row in response.json()}
    india = by_country["India"]
    assert india["min_salary"] == "1000000.00"
    assert india["max_salary"] == "3000000.00"
    assert india["avg_salary"] == "2000000.00"
    assert india["median_salary"] == "2000000.00"
    assert india["employee_count"] == 2
    united_states = by_country["United States"]
    assert united_states["min_salary"] == "5000000.00"
    assert united_states["max_salary"] == "5000000.00"
    assert united_states["avg_salary"] == "5000000.00"
    assert united_states["median_salary"] == "5000000.00"
    assert united_states["employee_count"] == 1


@pytest.mark.django_db
def test_salary_by_job_title_in_country_returns_avg_per_job_title():
    Employee.objects.create(
        **employee_create_kwargs(
            country="India",
            job_title="Software Engineer",
            salary=Decimal("1000000.00"),
        )
    )
    Employee.objects.create(
        **employee_create_kwargs(
            email="grace.hopper@example.com",
            country="India",
            job_title="Software Engineer",
            salary=Decimal("3000000.00"),
        )
    )
    Employee.objects.create(
        **employee_create_kwargs(
            email="director@example.com",
            country="India",
            job_title="Director",
            salary=Decimal("5000000.00"),
        )
    )
    Employee.objects.create(
        **employee_create_kwargs(
            email="us.engineer@example.com",
            country="United States",
            job_title="Software Engineer",
            salary=Decimal("9000000.00"),
        )
    )
    client = APIClient()

    response = client.get(SALARY_BY_JOB_TITLE_URL, {"country": "India"})

    assert response.status_code == status.HTTP_200_OK
    by_job_title = {row["job_title"]: row for row in response.json()}
    assert by_job_title["Software Engineer"]["avg_salary"] == "2000000.00"
    assert by_job_title["Software Engineer"]["median_salary"] == "2000000.00"
    assert by_job_title["Software Engineer"]["employee_count"] == 2
    assert by_job_title["Director"]["avg_salary"] == "5000000.00"
    assert by_job_title["Director"]["median_salary"] == "5000000.00"
    assert by_job_title["Director"]["employee_count"] == 1

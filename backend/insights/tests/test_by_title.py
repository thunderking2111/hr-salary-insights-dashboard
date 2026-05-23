from decimal import Decimal

import pytest
from employees.models import Employee
from rest_framework.test import APIClient

BY_TITLE_URL = "/api/v1/insights/by-title/"


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
def test_by_title_returns_avg_and_count_per_job_title_for_country(api_client):
    Employee.objects.create(
        first_name="Ann",
        last_name="One",
        job_title="Engineer",
        country="US",
        salary=Decimal("50000.00"),
    )
    Employee.objects.create(
        first_name="Bob",
        last_name="Two",
        job_title="Engineer",
        country="US",
        salary=Decimal("90000.00"),
    )
    Employee.objects.create(
        first_name="Cal",
        last_name="Three",
        job_title="Manager",
        country="US",
        salary=Decimal("100000.00"),
    )
    Employee.objects.create(
        first_name="Dan",
        last_name="Four",
        job_title="Engineer",
        country="UK",
        salary=Decimal("60000.00"),
    )

    response = api_client.get(BY_TITLE_URL, {"country": "US"})

    assert response.status_code == 200
    assert response.json() == [
        {
            "job_title": "Engineer",
            "avg": "70000.00",
            "count": 2,
        },
        {
            "job_title": "Manager",
            "avg": "100000.00",
            "count": 1,
        },
    ]

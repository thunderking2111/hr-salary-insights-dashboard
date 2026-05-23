from decimal import Decimal

import pytest
from employees.models import Employee
from rest_framework.test import APIClient

BY_COUNTRY_URL = "/api/v1/insights/by-country/"
BY_COUNTRY_DETAIL_URL = "/api/v1/insights/by-country/{country}/"


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
def test_by_country_returns_min_max_avg_and_count_per_country(api_client):
    Employee.objects.create(
        first_name="Ann",
        last_name="US",
        job_title="Engineer",
        country="US",
        salary=Decimal("50000.00"),
    )
    Employee.objects.create(
        first_name="Bob",
        last_name="US",
        job_title="Engineer",
        country="US",
        salary=Decimal("90000.00"),
    )
    Employee.objects.create(
        first_name="Cara",
        last_name="UK",
        job_title="Engineer",
        country="UK",
        salary=Decimal("60000.00"),
    )

    response = api_client.get(BY_COUNTRY_URL)

    assert response.status_code == 200
    assert response.json() == [
        {
            "country": "UK",
            "min": "60000.00",
            "max": "60000.00",
            "avg": "60000.00",
            "count": 1,
        },
        {
            "country": "US",
            "min": "50000.00",
            "max": "90000.00",
            "avg": "70000.00",
            "count": 2,
        },
    ]


@pytest.mark.django_db
def test_by_country_detail_returns_stats_for_one_country(api_client):
    Employee.objects.create(
        first_name="Ann",
        last_name="US",
        job_title="Engineer",
        country="US",
        salary=Decimal("50000.00"),
    )
    Employee.objects.create(
        first_name="Bob",
        last_name="US",
        job_title="Engineer",
        country="US",
        salary=Decimal("90000.00"),
    )
    Employee.objects.create(
        first_name="Cara",
        last_name="UK",
        job_title="Engineer",
        country="UK",
        salary=Decimal("60000.00"),
    )

    response = api_client.get(BY_COUNTRY_DETAIL_URL.format(country="US"))

    assert response.status_code == 200
    assert response.json() == {
        "country": "US",
        "min": "50000.00",
        "max": "90000.00",
        "avg": "70000.00",
        "count": 2,
    }

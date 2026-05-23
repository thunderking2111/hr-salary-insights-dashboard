import warnings
from decimal import Decimal

import pytest
from django.core.paginator import UnorderedObjectListWarning
from rest_framework.test import APIClient

from employees.models import Employee

API_BASE = "/api/v1/employees/"


def employee_payload(**overrides):
    data = {
        "first_name": "Jane",
        "last_name": "Doe",
        "job_title": "Software Engineer",
        "country": "US",
        "salary": "85000.00",
    }
    data.update(overrides)
    return data


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def employee(db):
    return Employee.objects.create(
        first_name="Jane",
        last_name="Doe",
        job_title="Software Engineer",
        country="US",
        salary=Decimal("85000.00"),
    )


@pytest.mark.django_db
def test_create_employee_returns_201(api_client):
    response = api_client.post(API_BASE, employee_payload(), format="json")
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "Jane"
    assert data["last_name"] == "Doe"
    assert data["job_title"] == "Software Engineer"
    assert data["country"] == "US"
    assert Decimal(data["salary"]) == Decimal("85000.00")
    assert "id" in data


@pytest.mark.django_db
def test_list_employees_returns_paginated_results(api_client, employee):
    response = api_client.get(API_BASE)
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) >= 1
    assert data["results"][0]["id"] == employee.id


@pytest.mark.django_db
def test_list_employees_returns_ordered_results_without_warning(api_client):
    zoe = Employee.objects.create(
        first_name="Zoe",
        last_name="Zebra",
        job_title="Engineer",
        country="US",
        salary=Decimal("70000.00"),
    )
    amy = Employee.objects.create(
        first_name="Amy",
        last_name="Adams",
        job_title="Engineer",
        country="US",
        salary=Decimal("80000.00"),
    )
    aaron = Employee.objects.create(
        first_name="Aaron",
        last_name="Zebra",
        job_title="Engineer",
        country="US",
        salary=Decimal("75000.00"),
    )

    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always", UnorderedObjectListWarning)
        response = api_client.get(API_BASE)

    assert response.status_code == 200
    assert not any(issubclass(warning.category, UnorderedObjectListWarning) for warning in caught)
    result_ids = [row["id"] for row in response.json()["results"]]
    assert result_ids == [aaron.id, amy.id, zoe.id]


@pytest.mark.django_db
def test_retrieve_employee_returns_200(api_client, employee):
    response = api_client.get(f"{API_BASE}{employee.pk}/")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == employee.id
    assert data["first_name"] == "Jane"
    assert data["last_name"] == "Doe"


@pytest.mark.django_db
def test_update_employee_returns_200(api_client, employee):
    response = api_client.patch(
        f"{API_BASE}{employee.pk}/",
        {"job_title": "Senior Software Engineer"},
        format="json",
    )
    assert response.status_code == 200
    assert response.json()["job_title"] == "Senior Software Engineer"
    employee.refresh_from_db()
    assert employee.job_title == "Senior Software Engineer"


@pytest.mark.django_db
def test_delete_employee_returns_204(api_client, employee):
    response = api_client.delete(f"{API_BASE}{employee.pk}/")
    assert response.status_code == 204
    assert not Employee.objects.filter(pk=employee.pk).exists()
    assert api_client.get(f"{API_BASE}{employee.pk}/").status_code == 404

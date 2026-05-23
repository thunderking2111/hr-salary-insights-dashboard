from decimal import Decimal

import pytest
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

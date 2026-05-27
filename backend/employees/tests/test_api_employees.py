from datetime import date
from decimal import Decimal

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from employees.models import Employee

from .conftest import employee_create_kwargs

EMPLOYEES_URL = "/api/employees/"


@pytest.mark.django_db
def test_create_employee_returns_201_with_profile():
    client = APIClient()
    response = client.post(EMPLOYEES_URL, employee_create_kwargs(), format="json")

    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["first_name"] == "Ada"
    assert data["last_name"] == "Lovelace"
    assert data["full_name"] == "Ada Lovelace"
    assert data["email"] == "ada.lovelace@example.com"
    assert data["country"] == "India"
    assert data["currency"] == "INR"
    assert data["date_of_joining"] == "2020-01-15"
    assert Employee.objects.count() == 1
    employee = Employee.objects.first()
    assert employee.date_of_joining == date(2020, 1, 15)


@pytest.mark.django_db
def test_list_employees_returns_200_with_paginated_results():
    Employee.objects.create(**employee_create_kwargs())
    client = APIClient()

    response = client.get(EMPLOYEES_URL)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["count"] == 1
    assert len(data["results"]) == 1
    assert data["results"][0]["email"] == "ada.lovelace@example.com"
    assert data["results"][0]["full_name"] == "Ada Lovelace"


@pytest.mark.django_db
def test_retrieve_employee_returns_200_with_profile():
    employee = Employee.objects.create(**employee_create_kwargs())
    client = APIClient()

    response = client.get(f"{EMPLOYEES_URL}{employee.pk}/")

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == employee.pk
    assert data["full_name"] == "Ada Lovelace"
    assert data["email"] == "ada.lovelace@example.com"


@pytest.mark.django_db
def test_update_employee_returns_200_with_updated_profile():
    employee = Employee.objects.create(**employee_create_kwargs())
    client = APIClient()
    payload = employee_create_kwargs(
        email="ada.updated@example.com",
        job_title="Principal Engineer",
        salary=Decimal("1800000.00"),
    )

    response = client.put(f"{EMPLOYEES_URL}{employee.pk}/", payload, format="json")

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "ada.updated@example.com"
    assert data["job_title"] == "Principal Engineer"
    assert data["salary"] == "1800000.00"
    employee.refresh_from_db()
    assert employee.email == "ada.updated@example.com"
    assert employee.job_title == "Principal Engineer"


@pytest.mark.django_db
def test_partial_update_employee_returns_200_updating_only_provided_fields():
    employee = Employee.objects.create(**employee_create_kwargs())
    original_email = employee.email
    client = APIClient()

    response = client.patch(
        f"{EMPLOYEES_URL}{employee.pk}/",
        {"job_title": "Principal Engineer"},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["job_title"] == "Principal Engineer"
    assert data["email"] == original_email
    employee.refresh_from_db()
    assert employee.job_title == "Principal Engineer"
    assert employee.email == original_email

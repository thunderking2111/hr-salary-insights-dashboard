from datetime import date

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

from datetime import date

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from employees.models import Employee

from .conftest import employee_create_kwargs

CREATE_URL = "/api/employees/"


@pytest.mark.django_db
def test_create_employee_returns_201_with_profile():
    client = APIClient()
    response = client.post(CREATE_URL, employee_create_kwargs(), format="json")

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

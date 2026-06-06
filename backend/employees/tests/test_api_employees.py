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
def test_list_employees_orders_by_first_name_last_name_then_id():
    Employee.objects.create(
        **employee_create_kwargs(
            first_name="Zara",
            last_name="Alpha",
            email="zara.alpha@example.com",
        )
    )
    Employee.objects.create(
        **employee_create_kwargs(
            first_name="Ada",
            last_name="Beta",
            email="ada.beta@example.com",
        )
    )
    ada_alpha_first = Employee.objects.create(
        **employee_create_kwargs(
            first_name="Ada",
            last_name="Alpha",
            email="ada.alpha.first@example.com",
        )
    )
    Employee.objects.create(
        **employee_create_kwargs(
            first_name="Ada",
            last_name="Alpha",
            email="ada.alpha.second@example.com",
        )
    )
    Employee.objects.create(
        **employee_create_kwargs(
            first_name="Bob",
            last_name="Alpha",
            email="bob.alpha@example.com",
        )
    )
    client = APIClient()

    response = client.get(EMPLOYEES_URL)

    assert response.status_code == status.HTTP_200_OK
    results = response.json()["results"]
    assert [row["full_name"] for row in results] == [
        "Ada Alpha",
        "Ada Alpha",
        "Ada Beta",
        "Bob Alpha",
        "Zara Alpha",
    ]
    ada_alpha_ids = [row["id"] for row in results if row["full_name"] == "Ada Alpha"]
    assert ada_alpha_ids == sorted(ada_alpha_ids)
    assert ada_alpha_ids[0] == ada_alpha_first.pk


@pytest.mark.django_db
@pytest.mark.parametrize(
    ("search_term", "expected_email"),
    [
        ("Ada", "ada.lovelace@example.com"),
        ("Lovelace", "ada.lovelace@example.com"),
        ("Ada Lovelace", "ada.lovelace@example.com"),
        ("ada.lovelace", "ada.lovelace@example.com"),
        ("Grace", "grace.hopper@example.com"),
    ],
)
def test_list_employees_search_filters_by_identity_fields(search_term, expected_email):
    Employee.objects.create(**employee_create_kwargs())
    Employee.objects.create(
        **employee_create_kwargs(
            first_name="Grace",
            last_name="Hopper",
            email="grace.hopper@example.com",
            job_title="Principal Engineer",
            department="Research",
            country="Germany",
        )
    )
    client = APIClient()

    response = client.get(EMPLOYEES_URL, {"search": search_term})

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["count"] == 1
    assert len(data["results"]) == 1
    assert data["results"][0]["email"] == expected_email


@pytest.mark.django_db
@pytest.mark.parametrize(
    "search_term",
    ["Software Engineer", "Engineering", "India", "Germany"],
)
def test_list_employees_search_ignores_organisation_fields(search_term):
    Employee.objects.create(**employee_create_kwargs())
    Employee.objects.create(
        **employee_create_kwargs(
            first_name="Grace",
            last_name="Hopper",
            email="grace.hopper@example.com",
            job_title="Principal Engineer",
            department="Research",
            country="Germany",
        )
    )
    client = APIClient()

    response = client.get(EMPLOYEES_URL, {"search": search_term})

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["count"] == 0


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


@pytest.mark.django_db
def test_delete_employee_returns_204_and_removes_employee():
    employee = Employee.objects.create(**employee_create_kwargs())
    client = APIClient()

    response = client.delete(f"{EMPLOYEES_URL}{employee.pk}/")

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Employee.objects.filter(pk=employee.pk).exists()

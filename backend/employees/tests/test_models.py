from datetime import date
from decimal import Decimal

import pytest

from employees.models import Employee


@pytest.mark.django_db
def test_employee_full_name_is_derived_from_first_and_last_name():
    employee = Employee.objects.create(first_name="Ada", last_name="Lovelace")
    assert employee.full_name == "Ada Lovelace"


def test_employee_str_returns_full_name():
    employee = Employee(first_name="Ada", last_name="Lovelace")
    assert str(employee) == "Ada Lovelace"


@pytest.mark.django_db
def test_employee_stores_hr_profile_fields():
    employee = Employee.objects.create(
        first_name="Ada",
        last_name="Lovelace",
        email="ada.lovelace@example.com",
        job_title="Software Engineer",
        department="Engineering",
        employment_type="full_time",
        country="India",
        salary=Decimal("1500000.00"),
        currency="INR",
        date_of_joining=date(2020, 1, 15),
    )
    assert employee.email == "ada.lovelace@example.com"
    assert employee.job_title == "Software Engineer"
    assert employee.department == "Engineering"
    assert employee.employment_type == "full_time"
    assert employee.country == "India"
    assert employee.salary == Decimal("1500000.00")
    assert employee.currency == "INR"
    assert employee.date_of_joining == date(2020, 1, 15)
    assert employee.created_at is not None
    assert employee.updated_at is not None

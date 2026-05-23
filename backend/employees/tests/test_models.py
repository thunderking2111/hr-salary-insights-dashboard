from decimal import Decimal

import pytest

from employees.models import Employee


@pytest.mark.django_db
def test_create_employee_with_required_fields():
    employee = Employee.objects.create(
        first_name="Jane",
        last_name="Doe",
        job_title="Software Engineer",
        country="US",
        salary=Decimal("85000.00"),
    )
    assert employee.pk is not None
    assert employee.first_name == "Jane"
    assert employee.last_name == "Doe"
    assert employee.job_title == "Software Engineer"
    assert employee.country == "US"
    assert employee.salary == Decimal("85000.00")


@pytest.mark.django_db
def test_employee_str_returns_full_name():
    employee = Employee(
        first_name="Jane",
        last_name="Doe",
        job_title="Software Engineer",
        country="US",
        salary=Decimal("85000.00"),
    )
    assert str(employee) == "Jane Doe"

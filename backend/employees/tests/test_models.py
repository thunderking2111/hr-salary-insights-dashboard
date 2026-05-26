import pytest

from employees.models import Employee


@pytest.mark.django_db
def test_employee_full_name_is_derived_from_first_and_last_name():
    employee = Employee.objects.create(first_name="Ada", last_name="Lovelace")
    assert employee.full_name == "Ada Lovelace"

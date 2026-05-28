import pytest
from django.core.management import call_command

from employees.models import Employee


@pytest.mark.django_db
def test_seed_employees_creates_requested_count():
    call_command("seed_employees", count=5, seed=42, clear=True)

    assert Employee.objects.count() == 5

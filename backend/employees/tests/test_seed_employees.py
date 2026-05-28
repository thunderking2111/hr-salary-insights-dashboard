import pytest
from django.core.management import call_command

from employees.models import Employee


@pytest.mark.django_db
def test_seed_employees_creates_requested_count():
    call_command("seed_employees", count=5, seed=42, clear=True)

    assert Employee.objects.count() == 5


@pytest.mark.django_db
def test_seed_employees_is_deterministic_for_same_seed():
    call_command("seed_employees", count=3, seed=99, clear=True)
    first_run = list(
        Employee.objects.order_by("email").values(
            "email",
            "first_name",
            "last_name",
            "job_title",
            "country",
            "salary",
        )
    )

    call_command("seed_employees", count=3, seed=99, clear=True)
    second_run = list(
        Employee.objects.order_by("email").values(
            "email",
            "first_name",
            "last_name",
            "job_title",
            "country",
            "salary",
        )
    )

    assert first_run == second_run

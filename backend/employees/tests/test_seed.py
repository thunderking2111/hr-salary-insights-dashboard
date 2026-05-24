from decimal import Decimal
from pathlib import Path

import pytest

from employees.models import Employee
from employees.seed import seed_employees


def _write_names(data_dir: Path, first_names: list[str], last_names: list[str]) -> None:
    (data_dir / "first_names.txt").write_text("\n".join(first_names) + "\n", encoding="utf-8")
    (data_dir / "last_names.txt").write_text("\n".join(last_names) + "\n", encoding="utf-8")


@pytest.mark.django_db
def test_seed_creates_requested_number_of_employees(tmp_path):
    _write_names(tmp_path, ["Jane", "John"], ["Doe", "Smith"])

    created = seed_employees(count=5, data_dir=tmp_path, clear=True)

    assert created == 5
    assert Employee.objects.count() == 5


@pytest.mark.django_db
def test_seed_uses_only_names_from_data_files(tmp_path):
    _write_names(tmp_path, ["Zara"], ["Unique"])

    seed_employees(count=3, data_dir=tmp_path, clear=True)

    for employee in Employee.objects.all():
        assert employee.first_name == "Zara"
        assert employee.last_name == "Unique"


@pytest.mark.django_db
def test_seed_clears_existing_employees_when_clear_is_true(tmp_path):
    _write_names(tmp_path, ["Jane"], ["Doe"])
    Employee.objects.create(
        first_name="Old",
        last_name="Record",
        job_title="Engineer",
        country="US",
        salary=Decimal("1.00"),
    )

    seed_employees(count=2, data_dir=tmp_path, clear=True)

    assert Employee.objects.count() == 2
    assert not Employee.objects.filter(first_name="Old").exists()


@pytest.mark.django_db
def test_seed_assigns_salary_at_least_one_cent(tmp_path):
    _write_names(tmp_path, ["Jane"], ["Doe"])

    seed_employees(count=10, data_dir=tmp_path, clear=True)

    assert Employee.objects.filter(salary__lt=Decimal("0.01")).count() == 0

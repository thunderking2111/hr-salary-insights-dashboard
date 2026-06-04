from decimal import Decimal

import pytest

from employees.models import Employee
from employees.services.insights import _median_salary
from employees.tests.conftest import employee_create_kwargs


def test_median_salary_returns_middle_value_for_odd_count():
    assert _median_salary(
        [Decimal("1000000.00"), Decimal("2000000.00"), Decimal("10000000.00")]
    ) == Decimal("2000000.00")


def test_median_salary_averages_two_middle_values_for_even_count():
    assert _median_salary([Decimal("1000000.00"), Decimal("3000000.00")]) == Decimal("2000000.00")


@pytest.mark.django_db
def test_country_median_can_differ_from_average_when_salaries_are_skewed():
    Employee.objects.create(**employee_create_kwargs(country="India", salary=Decimal("1000000.00")))
    Employee.objects.create(
        **employee_create_kwargs(
            email="grace.hopper@example.com",
            country="India",
            salary=Decimal("2000000.00"),
        )
    )
    Employee.objects.create(
        **employee_create_kwargs(
            email="alan.turing@example.com",
            country="India",
            salary=Decimal("10000000.00"),
        )
    )

    from employees.services.insights import salary_stats_by_country

    india = next(row for row in salary_stats_by_country() if row.country == "India")

    assert india.avg_salary == Decimal("4333333.33333333")
    assert india.median_salary == Decimal("2000000.00")

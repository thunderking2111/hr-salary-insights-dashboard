from collections import defaultdict
from dataclasses import dataclass
from decimal import Decimal

from django.db.models import Avg, Count, Max, Min

from employees.models import Employee


@dataclass(frozen=True)
class CountrySalaryStats:
    country: str
    min_salary: Decimal
    max_salary: Decimal
    avg_salary: Decimal
    median_salary: Decimal
    employee_count: int


@dataclass(frozen=True)
class JobTitleSalaryStats:
    job_title: str
    avg_salary: Decimal
    median_salary: Decimal
    employee_count: int


def _median_salary(values: list[Decimal]) -> Decimal:
    ordered = sorted(values)
    midpoint = len(ordered) // 2
    if len(ordered) % 2 == 1:
        return ordered[midpoint]
    return (ordered[midpoint - 1] + ordered[midpoint]) / Decimal(2)


def _median_salaries_by_group(*, field: str, country: str | None = None) -> dict[str, Decimal]:
    grouped: dict[str, list[Decimal]] = defaultdict(list)
    queryset = Employee.objects.all()
    if country is not None:
        queryset = queryset.filter(country=country)
    for group_value, salary in queryset.values_list(field, "salary"):
        grouped[group_value].append(salary)
    return {key: _median_salary(salaries) for key, salaries in grouped.items()}


def salary_stats_by_country() -> list[CountrySalaryStats]:
    medians = _median_salaries_by_group(field="country")
    rows = (
        Employee.objects.values("country")
        .annotate(
            min_salary=Min("salary"),
            max_salary=Max("salary"),
            avg_salary=Avg("salary"),
            employee_count=Count("pk"),
        )
        .order_by("country")
    )
    return [
        CountrySalaryStats(
            country=row["country"],
            min_salary=row["min_salary"],
            max_salary=row["max_salary"],
            avg_salary=row["avg_salary"],
            median_salary=medians[row["country"]],
            employee_count=row["employee_count"],
        )
        for row in rows
    ]


def salary_stats_by_job_title(*, country: str) -> list[JobTitleSalaryStats]:
    medians = _median_salaries_by_group(field="job_title", country=country)
    rows = (
        Employee.objects.filter(country=country)
        .values("job_title")
        .annotate(avg_salary=Avg("salary"), employee_count=Count("pk"))
        .order_by("job_title")
    )
    return [
        JobTitleSalaryStats(
            job_title=row["job_title"],
            avg_salary=row["avg_salary"],
            median_salary=medians[row["job_title"]],
            employee_count=row["employee_count"],
        )
        for row in rows
    ]

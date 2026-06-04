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
    employee_count: int


@dataclass(frozen=True)
class JobTitleSalaryStats:
    job_title: str
    avg_salary: Decimal
    employee_count: int


def salary_stats_by_country() -> list[CountrySalaryStats]:
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
            employee_count=row["employee_count"],
        )
        for row in rows
    ]


def salary_stats_by_job_title(*, country: str) -> list[JobTitleSalaryStats]:
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
            employee_count=row["employee_count"],
        )
        for row in rows
    ]

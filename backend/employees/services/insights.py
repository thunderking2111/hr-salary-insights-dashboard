from dataclasses import dataclass
from decimal import Decimal

from django.core.cache import cache
from django.db import connection

from employees.models import Employee
from employees.services.insights_cache import INSIGHTS_CACHE_TIMEOUT, insights_cache_key

ALLOWED_GROUP_FIELDS = frozenset({"country", "job_title"})


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


def _as_decimal(value: Decimal | str | float | int) -> Decimal:
    if isinstance(value, Decimal):
        return value
    return Decimal(str(value))


def _as_avg_decimal(value: Decimal | str | float | int) -> Decimal:
    return _as_decimal(value).quantize(Decimal("0.00000001"))


def _fetch_grouped_salary_stats(*, group_field: str, country: str | None = None) -> list[dict]:
    if group_field not in ALLOWED_GROUP_FIELDS:
        raise ValueError(f"Unsupported group field: {group_field}")

    table = Employee._meta.db_table
    params: list[str] = []
    where_clause = ""
    if country is not None:
        where_clause = "WHERE country = %s"
        params.append(country)

    sql = f"""
        WITH filtered AS (
            SELECT {group_field} AS group_key, salary
            FROM {table}
            {where_clause}
        ),
        ranked AS (
            SELECT
                group_key,
                salary,
                ROW_NUMBER() OVER (PARTITION BY group_key ORDER BY salary) AS rn,
                COUNT(*) OVER (PARTITION BY group_key) AS cnt
            FROM filtered
        ),
        medians AS (
            SELECT group_key, AVG(salary) AS median_salary
            FROM ranked
            WHERE rn IN ((cnt + 1) / 2, (cnt + 2) / 2)
            GROUP BY group_key
        ),
        aggregates AS (
            SELECT
                group_key,
                MIN(salary) AS min_salary,
                MAX(salary) AS max_salary,
                AVG(salary) AS avg_salary,
                COUNT(*) AS employee_count
            FROM filtered
            GROUP BY group_key
        )
        SELECT
            a.group_key,
            a.min_salary,
            a.max_salary,
            a.avg_salary,
            m.median_salary,
            a.employee_count
        FROM aggregates AS a
        INNER JOIN medians AS m ON a.group_key = m.group_key
        ORDER BY a.group_key
    """

    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row, strict=True)) for row in cursor.fetchall()]


def salary_stats_by_country() -> list[CountrySalaryStats]:
    cache_key = insights_cache_key("salary_by_country")
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    result = [
        CountrySalaryStats(
            country=row["group_key"],
            min_salary=_as_decimal(row["min_salary"]),
            max_salary=_as_decimal(row["max_salary"]),
            avg_salary=_as_avg_decimal(row["avg_salary"]),
            median_salary=_as_decimal(row["median_salary"]),
            employee_count=row["employee_count"],
        )
        for row in _fetch_grouped_salary_stats(group_field="country")
    ]
    cache.set(cache_key, result, timeout=INSIGHTS_CACHE_TIMEOUT)
    return result


def salary_stats_by_job_title(*, country: str) -> list[JobTitleSalaryStats]:
    cache_key = insights_cache_key(f"salary_by_job_title:{country}")
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    result = [
        JobTitleSalaryStats(
            job_title=row["group_key"],
            avg_salary=_as_avg_decimal(row["avg_salary"]),
            median_salary=_as_decimal(row["median_salary"]),
            employee_count=row["employee_count"],
        )
        for row in _fetch_grouped_salary_stats(group_field="job_title", country=country)
    ]
    cache.set(cache_key, result, timeout=INSIGHTS_CACHE_TIMEOUT)
    return result

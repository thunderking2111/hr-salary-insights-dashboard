from decimal import Decimal

from django.db.models import Avg, Count, Max, Min
from employees.models import Employee
from rest_framework.decorators import api_view
from rest_framework.response import Response


def _format_money(amount: Decimal) -> str:
    return f"{amount:.2f}"


def _country_stats(country: str) -> dict | None:
    row = Employee.objects.filter(country=country).aggregate(
        min=Min("salary"),
        max=Max("salary"),
        avg=Avg("salary"),
        count=Count("pk"),
    )
    if row["count"] == 0:
        return None
    return {
        "country": country,
        "min": _format_money(row["min"]),
        "max": _format_money(row["max"]),
        "avg": _format_money(row["avg"]),
        "count": row["count"],
    }


@api_view(["GET"])
def by_country(request):
    rows = (
        Employee.objects.values("country")
        .annotate(
            min=Min("salary"),
            max=Max("salary"),
            avg=Avg("salary"),
            count=Count("pk"),
        )
        .order_by("country")
    )
    data = [
        {
            "country": row["country"],
            "min": _format_money(row["min"]),
            "max": _format_money(row["max"]),
            "avg": _format_money(row["avg"]),
            "count": row["count"],
        }
        for row in rows
    ]
    return Response(data)


@api_view(["GET"])
def by_country_detail(request, country: str):
    stats = _country_stats(country)
    if stats is None:
        return Response(status=404)
    return Response(stats)


@api_view(["GET"])
def by_title(request):
    country = request.query_params.get("country", "")
    rows = (
        Employee.objects.filter(country=country)
        .values("job_title")
        .annotate(
            avg=Avg("salary"),
            count=Count("pk"),
        )
        .order_by("job_title")
    )
    data = [
        {
            "job_title": row["job_title"],
            "avg": _format_money(row["avg"]),
            "count": row["count"],
        }
        for row in rows
    ]
    return Response(data)

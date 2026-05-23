from decimal import Decimal

from django.db.models import Avg, Count, Max, Min
from employees.models import Employee
from rest_framework.decorators import api_view
from rest_framework.response import Response


def _format_money(amount: Decimal) -> str:
    return f"{amount:.2f}"


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

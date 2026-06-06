from django.db.models import Value
from django.db.models.functions import Concat
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from employees.models import Employee
from employees.serializers import (
    CountrySalaryInsightSerializer,
    EmployeeSerializer,
    JobTitleSalaryInsightSerializer,
)
from employees.services.insights import salary_stats_by_country, salary_stats_by_job_title


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.annotate(
        full_name_search=Concat("first_name", Value(" "), "last_name"),
    ).order_by("first_name", "last_name", "id")
    serializer_class = EmployeeSerializer
    search_fields = (
        "first_name",
        "last_name",
        "full_name_search",
        "email",
    )


class SalaryByCountryInsightView(APIView):
    def get(self, _request):
        stats = salary_stats_by_country()
        serializer = CountrySalaryInsightSerializer(stats, many=True)
        return Response(serializer.data)


class SalaryByJobTitleInsightView(APIView):
    def get(self, request):
        country = request.query_params["country"]
        stats = salary_stats_by_job_title(country=country)
        serializer = JobTitleSalaryInsightSerializer(stats, many=True)
        return Response(serializer.data)

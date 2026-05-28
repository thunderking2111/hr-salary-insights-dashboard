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
    queryset = Employee.objects.order_by("id")
    serializer_class = EmployeeSerializer


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

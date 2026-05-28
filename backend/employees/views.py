from django.db.models import Avg, Max, Min
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from employees.models import Employee
from employees.serializers import (
    CountrySalaryInsightSerializer,
    EmployeeSerializer,
    JobTitleSalaryInsightSerializer,
)


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.order_by("id")
    serializer_class = EmployeeSerializer


class SalaryByCountryInsightView(APIView):
    def get(self, _request):
        rows = (
            Employee.objects.values("country")
            .annotate(
                min_salary=Min("salary"),
                max_salary=Max("salary"),
                avg_salary=Avg("salary"),
            )
            .order_by("country")
        )
        serializer = CountrySalaryInsightSerializer(rows, many=True)
        return Response(serializer.data)


class SalaryByJobTitleInsightView(APIView):
    def get(self, request):
        country = request.query_params["country"]
        rows = (
            Employee.objects.filter(country=country)
            .values("job_title")
            .annotate(avg_salary=Avg("salary"))
            .order_by("job_title")
        )
        serializer = JobTitleSalaryInsightSerializer(rows, many=True)
        return Response(serializer.data)

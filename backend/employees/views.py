from rest_framework import viewsets

from employees.models import Employee
from employees.serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.order_by("id")
    serializer_class = EmployeeSerializer

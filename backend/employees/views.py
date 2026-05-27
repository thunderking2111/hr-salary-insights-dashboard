from rest_framework import generics

from employees.models import Employee
from employees.serializers import EmployeeSerializer


class EmployeeCreateView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

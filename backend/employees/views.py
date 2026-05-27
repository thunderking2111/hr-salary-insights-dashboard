from rest_framework import generics

from employees.models import Employee
from employees.serializers import EmployeeSerializer


class EmployeeListView(generics.ListAPIView):
    queryset = Employee.objects.order_by("id")
    serializer_class = EmployeeSerializer


class EmployeeCreateView(generics.CreateAPIView):
    queryset = Employee.objects.order_by("id")
    serializer_class = EmployeeSerializer


class EmployeeListCreateView(EmployeeListView, EmployeeCreateView):
    """Binds list + create on /api/employees/ until ModelViewSet refactor."""

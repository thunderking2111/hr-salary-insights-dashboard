from rest_framework import generics

from employees.models import Employee
from employees.serializers import EmployeeSerializer


class EmployeeListView(generics.ListAPIView):
    queryset = Employee.objects.order_by("id")
    serializer_class = EmployeeSerializer


class EmployeeCreateView(generics.CreateAPIView):
    queryset = Employee.objects.order_by("id")
    serializer_class = EmployeeSerializer


class EmployeeRetrieveView(generics.RetrieveAPIView):
    queryset = Employee.objects.order_by("id")
    serializer_class = EmployeeSerializer


class EmployeeUpdateView(generics.UpdateAPIView):
    queryset = Employee.objects.order_by("id")
    serializer_class = EmployeeSerializer


class EmployeePutUpdateView(EmployeeUpdateView):
    http_method_names = ("put", "head", "options")


class EmployeeRetrieveUpdateView(EmployeeRetrieveView, EmployeePutUpdateView):
    """Binds retrieve + update on /api/employees/{id}/ until ModelViewSet refactor."""

    http_method_names = ("get", "put", "head", "options")


class EmployeeListCreateView(EmployeeListView, EmployeeCreateView):
    """Binds list + create on /api/employees/ until ModelViewSet refactor."""

from django.urls import path

from employees.views import EmployeeListCreateView

urlpatterns = [
    path("employees/", EmployeeListCreateView.as_view(), name="employee-list-create"),
]

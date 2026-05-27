from django.urls import path

from employees.views import EmployeeCreateView

urlpatterns = [
    path("employees/", EmployeeCreateView.as_view(), name="employee-create"),
]

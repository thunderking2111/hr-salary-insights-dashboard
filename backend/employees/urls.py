from django.urls import path

from employees.views import EmployeeListCreateView, EmployeeRetrieveUpdateView

urlpatterns = [
    path("employees/", EmployeeListCreateView.as_view(), name="employee-list-create"),
    path(
        "employees/<int:pk>/",
        EmployeeRetrieveUpdateView.as_view(),
        name="employee-retrieve-update",
    ),
]

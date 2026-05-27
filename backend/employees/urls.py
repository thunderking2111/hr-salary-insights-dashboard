from django.urls import path

from employees.views import EmployeeListCreateView, EmployeeRetrieveView

urlpatterns = [
    path("employees/", EmployeeListCreateView.as_view(), name="employee-list-create"),
    path("employees/<int:pk>/", EmployeeRetrieveView.as_view(), name="employee-retrieve"),
]

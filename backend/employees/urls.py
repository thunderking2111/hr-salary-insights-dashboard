from django.urls import include, path
from rest_framework.routers import DefaultRouter

from employees.views import EmployeeViewSet, SalaryByCountryInsightView

router = DefaultRouter()
router.register("employees", EmployeeViewSet, basename="employee")

urlpatterns = [
    path(
        "insights/salary-by-country/",
        SalaryByCountryInsightView.as_view(),
        name="salary-by-country-insight",
    ),
    path("", include(router.urls)),
]

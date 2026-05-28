from django.urls import include, path
from rest_framework.routers import DefaultRouter

from employees.views import (
    EmployeeViewSet,
    SalaryByCountryInsightView,
    SalaryByJobTitleInsightView,
)

router = DefaultRouter()
router.register("employees", EmployeeViewSet, basename="employee")

urlpatterns = [
    path(
        "insights/salary-by-country/",
        SalaryByCountryInsightView.as_view(),
        name="salary-by-country-insight",
    ),
    path(
        "insights/salary-by-job-title/",
        SalaryByJobTitleInsightView.as_view(),
        name="salary-by-job-title-insight",
    ),
    path("", include(router.urls)),
]

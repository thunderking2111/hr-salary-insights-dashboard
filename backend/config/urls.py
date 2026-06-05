"""Root URL configuration.

App-level routes are mounted under `/api/`. Individual endpoints are
added by the slices that introduce them, behind failing tests.
"""

from django.contrib import admin
from django.urls import include, path

from config.health import HealthView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", HealthView.as_view(), name="health"),
    path("api/", include("employees.urls")),
]

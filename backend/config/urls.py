"""Root URL configuration.

App-level routes are mounted under `/api/`. Individual endpoints are
added by the slices that introduce them, behind failing tests.
"""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("employees.urls")),
]

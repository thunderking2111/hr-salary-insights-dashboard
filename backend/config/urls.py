"""Root URL configuration.

The `/api/` mount and app-level routes are added by the slices that
introduce them, behind failing tests.
"""

from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("admin/", admin.site.urls),
]

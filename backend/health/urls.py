from django.urls import path

from health import views

urlpatterns = [
    path("health/", views.health, name="health"),
]

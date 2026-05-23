from django.urls import path

from insights import views

urlpatterns = [
    path("insights/by-country/", views.by_country, name="insights-by-country"),
]

from django.urls import path

from insights import views

urlpatterns = [
    path("insights/by-country/", views.by_country, name="insights-by-country"),
    path(
        "insights/by-country/<str:country>/",
        views.by_country_detail,
        name="insights-by-country-detail",
    ),
    path("insights/by-title/", views.by_title, name="insights-by-title"),
]

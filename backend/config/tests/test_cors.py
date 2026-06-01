from django.test import override_settings
from rest_framework.test import APIClient


@override_settings(CORS_ALLOWED_ORIGINS=["http://localhost:5173"])
def test_preflight_allows_vite_dev_origin():
    client = APIClient()
    response = client.options(
        "/api/employees/",
        HTTP_ORIGIN="http://localhost:5173",
        HTTP_ACCESS_CONTROL_REQUEST_METHOD="GET",
    )

    assert response.status_code == 200
    assert response["Access-Control-Allow-Origin"] == "http://localhost:5173"

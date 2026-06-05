import pytest
from rest_framework import status
from rest_framework.test import APIClient

HEALTH_URL = "/health/"


@pytest.mark.django_db
def test_health_returns_ok_when_database_is_reachable():
    client = APIClient()

    response = client.get(HEALTH_URL)

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "status": "ok",
        "checks": {"database": "ok"},
    }

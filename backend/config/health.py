from typing import ClassVar

from django.db import connection
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    authentication_classes: ClassVar[list] = []
    permission_classes: ClassVar[list] = [AllowAny]

    def get(self, _request):
        try:
            connection.ensure_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
        except Exception:
            return Response(
                {"status": "unavailable", "checks": {"database": "error"}},
                status=503,
            )

        return Response({"status": "ok", "checks": {"database": "ok"}})

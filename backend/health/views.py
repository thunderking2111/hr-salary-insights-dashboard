from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health(request):
    """Lightweight check that the API is running."""
    return Response({"status": "ok"})

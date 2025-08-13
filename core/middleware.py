# In core/middleware.py
from .models import ServiceStatus
from django.http import JsonResponse
from django.urls import reverse

class ServiceStatusMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Allow access to the admin panel and the service status API itself
        # This prevents us from locking ourselves out
        if request.path.startswith(reverse('admin:index')) or \
           request.path.startswith('/api/service-status/'):
            return self.get_response(request)

        # Check the first (and only) ServiceStatus object
        status = ServiceStatus.objects.first()

        # If the service is inactive, block the request
        if status and not status.is_active:
            return JsonResponse(
                {'error': 'Service is temporarily unavailable.'},
                status=503 # 503 Service Unavailable
            )

        # If the service is active, let the request proceed as normal
        response = self.get_response(request)
        return response
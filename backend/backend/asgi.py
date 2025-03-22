import os
import django
from django.core.asgi import get_asgi_application

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Ensure Django is fully set up before importing other modules
django.setup()

# Import WebSocket routes and other components after Django setup
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat.route import websocket_urlpatterns  # Import your WebSocket routes

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Handle HTTP requests
    "websocket": AuthMiddlewareStack(  # Handle WebSocket requests
        URLRouter(websocket_urlpatterns)
    ),
})



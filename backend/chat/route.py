from django.urls import path, re_path

from chat.consumers import ChatConsumer, NotificationConsumer
from . import consumers

websocket_urlpatterns = [
     re_path(r'ws/chat/(?P<candidate_id>\d+)/(?P<employer_id>\d+)/(?P<user_id>\d+)/?$', consumers.ChatConsumer.as_asgi()),

    path('ws/notifications/<int:user_id>/', NotificationConsumer.as_asgi()),
]
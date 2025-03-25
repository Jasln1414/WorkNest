from django.urls import path
from .import views
from .views import *

urlpatterns = [
    path('chat-messages/<int:candidate_id>/<int:employer_id>/', ChatMessagesAPIView.as_view(), name='chat-messages'),
    path('chats/',views.ChatsView.as_view(),name='chats'),
   
    
]
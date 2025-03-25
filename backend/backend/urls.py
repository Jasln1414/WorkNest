from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from Empjob.api.views import csrf_token_view
from user_account.api.views import get_csrf_token
from chat.api.views import *

# Define the base URL patterns
urlpatterns = [
    path('admin/', admin.site.urls),
    path('get-csrf-token/', get_csrf_token, name='test_csrf'),
    path('api/account/', include("user_account.api.urls")), 
    path('api/empjob/', include("Empjob.api.urls")),
    path('dashboard/', include("Admin.api.urls")),
    path('csrf/', csrf_token_view, name='csrf_token'),
   path('chat/', include("chat.api.urls")),  # Changed from 'chat/' to 'api/chat/'

]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# main urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from Empjob.api.views import csrf_token_view
from user_account.api.views import get_csrf_token


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/account/', include("user_account.api.urls")), 
    #path('accounts/', include('allauth.urls')),
    path('api/empjob/', include("Empjob.api.urls")),
     path('dashboard/',include("Admin.api.urls")),
     path('csrf/', csrf_token_view, name='csrf_token'),
     path('get-csrf-token/',get_csrf_token, name='get_csrf_token'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
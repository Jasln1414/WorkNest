# main urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from Empjob.api.views import csrf_token_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/account/', include("account.api.urls")), 
    path('api/empjob/', include("Empjob.api.urls")),
     path('dashboard/',include("Admin.api.urls")),
     path('csrf/', csrf_token_view, name='csrf_token'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
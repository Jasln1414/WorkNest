from django.contrib import admin
from .models import ChatRoom, ChatMessage

# Register your models here.

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'candidate', 'employer', 'created_at')
    list_filter = ('candidate', 'employer', 'created_at')
    search_fields = ('candidate__user__username', 'employer__user__username')
    date_hierarchy = 'created_at'

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'chatroom', 'message', 'sendername', 'timestamp', 'is_read', 'is_send')
    list_filter = ('chatroom', 'sendername', 'timestamp', 'is_read', 'is_send')
    search_fields = ('message', 'sendername')
    date_hierarchy = 'timestamp'
from django.contrib import admin
from .models import CandidateNotification, EmployerNotification

@admin.register(CandidateNotification)
class CandidateNotificationAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'sender', 'message', 'is_read', 'timestamp')
    list_filter = ('is_read', 'timestamp')
    search_fields = ('candidate__user__full_name', 'sender__user__full_name', 'message')
    readonly_fields = ('timestamp',)
    list_per_page = 20

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'candidate__user', 'sender__user'
        )

@admin.register(EmployerNotification)
class EmployerNotificationAdmin(admin.ModelAdmin):
    list_display = ('employer', 'sender', 'message', 'is_read', 'timestamp')
    list_filter = ('is_read', 'timestamp')
    search_fields = ('employer__user__full_name', 'sender__user__full_name', 'message')
    readonly_fields = ('timestamp',)
    list_per_page = 20

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'employer__user', 'sender__user'
        )


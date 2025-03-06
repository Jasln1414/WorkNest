from django.contrib import admin
from .models import User, Candidate, Education, Employer

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'user_type', 'is_active', 'is_staff')
    search_fields = ('full_name', 'email')
    list_filter = ('user_type', 'is_active', 'is_staff')

@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ('get_user_full_name', 'phone', 'dob', 'place')
    search_fields = ('user__full_name', 'phone', 'place')

    def get_user_full_name(self, obj):
        return obj.user.full_name
    get_user_full_name.short_description = "Full Name"

@admin.register(Employer)
class EmployerAdmin(admin.ModelAdmin):
    list_display = ('get_user_full_name', 'phone', 'headquarters', 'industry')
    search_fields = ('user__full_name', 'headquarters', 'industry')

    def get_user_full_name(self, obj):
        return obj.user.full_name
    get_user_full_name.short_description = "Full Name"


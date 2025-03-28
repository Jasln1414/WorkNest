from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'employer', 'amount', 'status')
    list_filter = ('status',)

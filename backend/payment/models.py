from django.db import models
from user_account.models import Employer,User
from Empjob.models import Jobs

class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE, related_name="payments")
    job = models.ForeignKey(Jobs, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.FloatField()
    method = models.CharField(max_length=50)  
    transaction_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.status}"
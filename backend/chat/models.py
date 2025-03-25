from django.db import models
from user_account.models import Candidate,Employer
from Empjob.models import ApplyedJobs
# Create your models here.

class ChatRoom(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='sender_message')
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE, related_name='received_messages')
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    chatroom = models.ForeignKey(ChatRoom,on_delete=models.CASCADE)
    message = models.TextField(default="", null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    sendername = models.TextField(max_length=100, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    is_send = models.BooleanField(default=False)

from django.db import models
from user_account.models import Candidate, Employer
from django.contrib.auth import get_user_model

User = get_user_model()

class CandidateNotification(models.Model):
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    sender_pic = models.CharField(max_length=255, null=True, blank=True)
    sender_name = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Notification for {self.candidate.user.email}: {self.message}"

class EmployerNotification(models.Model):
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    sender_pic = models.CharField(max_length=255, null=True, blank=True)
    sender_name = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Notification for {self.employer.user.email}: {self.message}"
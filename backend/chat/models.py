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

    def __str__(self):
        return f'{self.candidate} to {self.employer}: {self.message}'

class CandidateNotification(models.Model):
    user = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    # def __str__(self):
    #     return f'Notification for {self.user.username} - {self.message[:20]}...'
    
from django.db import models
from account.models import Employer,Candidate
from django.utils import timezone
# Create your models here.

class Jobs(models.Model):
    title=models.CharField(max_length=60,blank=True, null=True)
    location=models.CharField(max_length=100, blank=True,null=True)
    lpa=models.CharField(max_length=20,blank=True,null=True)
    jobtype=models.CharField(max_length=30,blank=True,null=True)
    jobmode=models.CharField(max_length=30,blank=True,null=True)
    experience = models.CharField(max_length=50)
    applyBefore=models.DateField(blank=True,null=True)
    posteDate=models.DateTimeField(auto_now_add=True)
    about=models.TextField(blank=True,null=True)
    responsibility=models.TextField(blank=True,null=True)
    active=models.BooleanField(default=True)
    industry=models.CharField(blank=True,null=True)
    employer=models.ForeignKey(Employer,on_delete=models.CASCADE, related_name="employer_jobs")

    def __str__(self):
        return self.title or f"Job {self.id}"
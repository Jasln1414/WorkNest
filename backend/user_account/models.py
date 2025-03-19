from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.postgres.fields import ArrayField
# Create your models here.

class MyAccountManager(BaseUserManager):
    def create_user(self, full_name, email, password=None):
        if not email:
            raise ValueError("User must have an email address")
        user = self.model(
            email=self.normalize_email(email),
            full_name=full_name
        )
        user.set_password(password)
        user.save(using=self.db)
        return user
    
    def create_superuser(self, full_name, email, password):
        user = self.create_user(
            email=self.normalize_email(email),
            full_name=full_name,
            password=password
        )
        user.is_active = True
        user.is_superuser = True
        user.is_email_verified = True
        user.is_staff = True
        user.save(using=self.db)
        return user

class User(AbstractBaseUser):
    choice = (
        ("candidate", "candidate"),
        ("employer", "employer"),
        ("admin", "admin")
    )
    full_name = models.CharField(max_length=50)
    email = models.CharField(max_length=50, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)  # Add profile_picture field
    user_type = models.CharField(max_length=10, choices=choice, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now_add=True)
    is_superuser = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    otp = models.CharField(max_length=6, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = MyAccountManager()

    def __str__(self):
        return self.full_name if self.full_name else "Unnamed User"
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser
    
    def has_module_perms(self, add_label):
        return True

class Candidate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Candidate_profile")
    completed = models.BooleanField(default=False)
    phone = models.BigIntegerField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    profile_pic = models.ImageField(upload_to='profile_pic', blank=True, null=True)
    Gender = models.CharField(max_length=10, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)
    resume = models.FileField(upload_to='resumes', blank=True, null=True)
    linkedin = models.CharField(max_length=150, blank=True, null=True)
    github = models.CharField(max_length=150, blank=True, null=True)
    place = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.user.full_name if self.user and self.user.full_name else "Unnamed Candidate"

class Education(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="education")
    education = models.CharField(max_length=100, blank=True, null=True)
    college = models.CharField(max_length=100, blank=True, null=True)
    specilization = models.CharField(max_length=100, blank=True, null=True)
    completed = models.DateField(blank=True, null=True)
    mark = models.FloatField(blank=True, null=True)

class Employer(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    phone = models.BigIntegerField(null=True, blank=True)
    profile_pic = models.ImageField(upload_to='company_pic', blank=True, null=True)
    headquarters = models.CharField(max_length=100, null=True, blank=True)
    address = models.TextField(max_length=200, blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    website_link = models.TextField(blank=True, null=True)
    industry = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False) 
    is_approved_by_admin = models.BooleanField(default=False) 
   

    def __str__(self):
        return self.user.full_name if self.user and self.user.full_name else "Unnamed Employer"
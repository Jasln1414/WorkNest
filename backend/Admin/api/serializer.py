from rest_framework import serializers
from account.models import *
from Empjob.models import *

class CandidateSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    class Meta:
        model = Candidate
        fields = ["id","phone","profile_pic","user_name","email","status"]
    
    def get_user_name(self, obj):
        return obj.user.full_name if obj.user.full_name else ""

    def get_email(self, obj):
        return obj.user.email if obj.user.email else ""
    
    def get_status(self,obj):
        return obj.user.is_active   


class EmployerSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Employer
        fields = ["id", "phone", "profile_pic", "user_name", "email", "status"]

    def get_user_name(self, obj):
        return obj.user.full_name if obj.user else ""

    def get_email(self, obj):
        return obj.user.email if obj.user else ""

    def get_status(self, obj):
        return obj.user.is_active if obj.user else False


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['education', 'college', 'specilization', 'completed', 'mark']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'email', 'user_type', 'date_joined', 'last_login', 'is_superuser', 'is_email_verified', 'is_staff', 'is_active']

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = ['title', 'location', 'lpa', 'jobtype', 'jobmode', 'experience', 'applyBefore', 'posteDate', 'about', 'responsibility', 'active','employer','industry'] #'industry', 



class CandidateDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    education = serializers.SerializerMethodField()
    

    class Meta:
        model = Candidate
        fields = ['id', 'phone', 'dob', 'profile_pic', 'Gender', 'skills', 'resume', 'linkedin', 'github', 'place', 'user', 'education']
    
    def get_education(self, obj):
        education = Education.objects.filter(user=obj.user)
        return EducationSerializer(education, many=True).data
    
class JobsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = '__all__'

class EmployerDetailsSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    jobs = serializers.SerializerMethodField()

    class Meta:
        model = Employer
        fields = '__all__'
    
    def get_jobs(self, obj):
        jobs = Jobs.objects.filter(employer=obj)
        serializer = JobsSerializer(jobs, many=True)
        return serializer.data
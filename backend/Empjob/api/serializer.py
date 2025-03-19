from rest_framework import serializers
from user_account.models import *
from Empjob.models import *


from rest_framework import serializers
from Empjob.models import Jobs

from django.utils import timezone

class PostJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        exclude = ('active', 'industry', 'employer')  # Exclude fields you don't want users to set

    def create(self, validated_data):
        validated_data['posteDate'] = timezone.now()  # Set posteDate to current time
        instance = self.Meta.model(**validated_data)
        if instance is not None:
            instance.save()
            return instance
    

class EmployerSerializer(serializers.ModelSerializer):
    user_full_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email')
    user_id = serializers.CharField(source='user.id')
    
    class Meta:
        model = Employer
        fields = ['profile_pic','user_id','user_email','phone','id','industry','user_full_name','headquarters','address','about','website_link']



class JobSerializer(serializers.ModelSerializer):
    employer = EmployerSerializer()    
    class Meta:
        model = Jobs
        fields = "__all__"
    

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class CandidateSerializer(serializers.ModelSerializer):
    education = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    email=serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Candidate
        fields = '__all__'

    def get_education(self, obj):
        educations = Education.objects.filter(user=obj.user)
        return EducationSerializer(educations, many=True).data













class SavedJobSerializer(serializers.ModelSerializer):
    job=JobSerializer()
    class Meta:
        model = SavedJobs
        fields = ['candidate','job']


class ApplicationSerializer(serializers.ModelSerializer):
    employer_name = serializers.SerializerMethodField()
    employer_id = serializers.SerializerMethodField()
    applications = serializers.SerializerMethodField()
   
    class Meta:
        model = Jobs
        fields = '__all__'

    def get_employer_name(self, obj):
        return obj.employer.user.full_name
    
    def get_employer_id(self,obj):
        return obj.employer.id

    def get_applications(self, obj):
        applications = ApplyedJobs.objects.filter(job=obj)
        serializer = ApplyedForJobsSerializer(applications, many=True)
        return serializer.data
    
    


class ApplyedForJobsSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer()
   

    class Meta:
        model = ApplyedJobs
        fields = '__all__'

   
class ApplyedJobSerializer(serializers.ModelSerializer):
    job=JobSerializer()
    candidate_name = serializers.SerializerMethodField()
    class Meta:
        model = ApplyedJobs
        fields = ['id', 'job', 'status','candidate','applyed_on','candidate_name']
    def get_candidate_name(self,obj):
        candidate = Candidate.objects.get(id=obj.candidate_id)  
        return candidate.user.full_name
    

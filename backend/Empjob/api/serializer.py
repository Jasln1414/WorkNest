from rest_framework import serializers
from account.models import *
from Empjob.models import *


from rest_framework import serializers
from Empjob.models import Jobs

class PostJobSerializer(serializers.ModelSerializer):
    class Meta:
        model= Jobs
        exclude =('posteDate','active','industry','employer')
    
    def create(self,validated_data):
        instance=self.Meta.model(**validated_data)
        if instance is not None:
            instance.save()
            return instance
        
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
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


   
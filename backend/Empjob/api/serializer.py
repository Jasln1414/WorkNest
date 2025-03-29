from rest_framework import serializers
from user_account.models import *
from Empjob.models import *
from django.utils import timezone

from rest_framework import serializers
from Empjob.models import Jobs, Question,Answer



class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'question_type']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'candidate', 'question', 'answer_text']


class PostJobSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)
    
    class Meta:
        model = Jobs
        fields = ['title', 'location', 'lpa', 'jobtype', 'jobmode', 'experience',
                 'applyBefore', 'about', 'responsibility', 'industry', 'questions']
    
    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        employer = self.context['employer']
        job = Jobs.objects.create(employer=employer, **validated_data)
        
        # Create associated questions
        for question_data in questions_data:
            Question.objects.create(job=job, **question_data)
            
        return job

class EmployerSerializer(serializers.ModelSerializer):
    user_full_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.CharField(source='user.email')
    user_id = serializers.CharField(source='user.id')
    
    class Meta:
        model = Employer
        fields = ['profile_pic', 'user_id', 'user_email', 'phone', 'id', 'industry', 
                 'user_full_name', 'headquarters', 'address', 'about', 'website_link']

class JobSerializer(serializers.ModelSerializer):
    employer = EmployerSerializer()
    questions = serializers.SerializerMethodField()
    
    class Meta:
        model = Jobs
        fields = "__all__"
    
    def get_questions(self, obj):
        questions = Question.objects.filter(job=obj)
        return QuestionSerializer(questions, many=True).data

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class CandidateSerializer(serializers.ModelSerializer):
    education = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Candidate
        fields = '__all__'

    def get_education(self, obj):
        educations = Education.objects.filter(user=obj.user)
        return EducationSerializer(educations, many=True).data

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'

class ApplyedForJobsSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer()
    answers = serializers.SerializerMethodField()

    class Meta:
        model = ApplyedJobs
        fields = '__all__'

    def get_answers(self, obj):
        answers = Answer.objects.filter(candidate=obj.candidate, question__job=obj.job)
        return AnswerSerializer(answers, many=True).data

class ApplicationSerializer(serializers.ModelSerializer):
    employer_name = serializers.SerializerMethodField()
    employer_id = serializers.SerializerMethodField()
    applications = serializers.SerializerMethodField()
    questions = serializers.SerializerMethodField()
    
    class Meta:
        model = Jobs
        fields = '__all__'

    def get_employer_name(self, obj):
        return obj.employer.user.full_name
    
    def get_employer_id(self, obj):
        return obj.employer.id

    def get_applications(self, obj):
        applications = ApplyedJobs.objects.filter(job=obj)
        serializer = ApplyedForJobsSerializer(applications, many=True)
        return serializer.data
    
    def get_questions(self, obj):
        questions = Question.objects.filter(job=obj)
        return QuestionSerializer(questions, many=True).data

class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer()
    
    class Meta:
        model = SavedJobs
        fields = '__all__'

class ApplyedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer()
    candidate_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ApplyedJobs
        fields = ['id', 'job', 'status', 'candidate', 'applyed_on', 'candidate_name']
    
    def get_candidate_name(self, obj):
        candidate = Candidate.objects.get(id=obj.candidate_id)  
        return candidate.user.full_name
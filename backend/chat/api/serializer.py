from rest_framework import serializers
from chat.models import ChatMessage,ChatRoom,CandidateNotification,EmployerNotification
from user_account.models import *



class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'

class ChatRoomSerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    candidate_pic = serializers.SerializerMethodField()
    employer_name = serializers.SerializerMethodField()
    employer_pic = serializers.SerializerMethodField()
    class Meta:
        model = ChatRoom
        fields = ['candidate','employer','created_at','candidate_name','candidate_pic','employer_name','employer_pic']
        
    def get_candidate_name(self, obj):
        return obj.candidate.user.full_name

    def get_candidate_pic(self, obj):
        return obj.candidate.profile_pic.url if obj.candidate.profile_pic else None

    def get_employer_name(self, obj):
        return obj.employer.user.full_name

    def get_employer_pic(self, obj):
        return obj.employer.profile_pic.url if obj.employer.profile_pic else None


from rest_framework import serializers
from chat.models import CandidateNotification, EmployerNotification

class CandidateNotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.name', read_only=True)
    sender_pic = serializers.SerializerMethodField()

    class Meta:
        model = CandidateNotification
        fields = ['id', 'message', 'is_read', 'timestamp', 'sender', 'sender_name', 'sender_pic']

    def get_sender_pic(self, obj):
        if obj.sender_pic:
            return obj.sender_pic
        return None

class EmployerNotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.name', read_only=True)
    sender_pic = serializers.SerializerMethodField()

    class Meta:
        model = EmployerNotification
        fields = ['id', 'message', 'is_read', 'timestamp', 'sender', 'sender_name', 'sender_pic']

    def get_sender_pic(self, obj):
        if obj.sender_pic:
            return obj.sender_pic
        return None
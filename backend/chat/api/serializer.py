from rest_framework import serializers
from chat.models import ChatMessage,ChatRoom
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
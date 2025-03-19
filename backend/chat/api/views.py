from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from chat.models import ChatMessage,ChatRoom
from user_account.models import *
from .serializer import ChatMessageSerializer,ChatRoomSerializer
from chat.models import CandidateNotification
from rest_framework.permissions import AllowAny



class ChatMessagesAPIView(APIView):
    permission_classes=[]
    def get(self,request, candidate_id, employer_id):
        print("helloooooooooooooooooooooooooooooooooooooooo",candidate_id,employer_id)
        try:
            chatmessages = ChatMessage.objects.filter(candidate=candidate_id,employer=employer_id)
            print(chatmessages)
        except ChatMessage.DoesNotExist:
            return Response({'error':"messeges not found"},status=status.HTTP_404_NOT_FOUND)

        serializer= ChatMessageSerializer(chatmessages, many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)
    
class ChatsView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user = request.user
        try:
            candidate = Candidate.objects.get(user=user)
            chatroom = ChatRoom.objects.filter(candidate=candidate)
        except Candidate.DoesNotExist:
            try:
                employer = Employer.objects.get(user=user)
                chatroom = ChatRoom.objects.filter(employer=employer)
            except Employer.DoesNotExist:
                return Response({'error': 'User is neither a candidate nor an employer'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ChatRoomSerializer(chatroom, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


from channels.generic.websocket import AsyncJsonWebsocketConsumer # type: ignore
from channels.db import database_sync_to_async # type: ignore

from user_account.models import Candidate,Employer
import json


from chat.models import ChatMessage,ChatRoom,CandidateNotification
from django.contrib.auth import get_user_model

LANGUAGE_SESSION_KEY = '_language'


class ChatConsumer(AsyncJsonWebsocketConsumer):
    active_users = set()
    print("hiiiiiiiiiiiiiiiii")
    async def connect(self):
        print("testing connection and redis")
        self.candidate_id = self.scope['url_route']['kwargs']['candidate_id']
        self.employer_id = self.scope['url_route']['kwargs']['employer_id']
        self.user_id = self.scope['url_route']['kwargs']['user_id']

        print(f"WebSocket connection for candidate: {self.candidate_id}, employer: {self.employer_id}")
        print("current user id.............",self.user_id)

        self.candidate = await self.get_candidate_instance(self.candidate_id)
        self.employer = await self.get_employer_instance(self.employer_id)
        print("jjjjjjjjjjjjjjjjjjjjjjjjjjjjj",self.candidate,self.employer)

        await self.channel_layer.group_add(
            f'chat_{self.candidate_id}_{self.employer_id}',
            self.channel_name
        )
        ChatConsumer.active_users.add(self.user_id)
        print("..............",self.user_id)
        await self.accept()

        # Fetch existing messages and send them to the connected client
        existing_messages = await self.get_existing_messages()
        for message in existing_messages:
            await self.send(text_data=json.dumps({
                'message': message['message'],
                'sendername':message['sendername'],
                'is_read': message['is_read']
            }))

    @database_sync_to_async
    def get_existing_messages(self):
        chatroom, created = ChatRoom.objects.get_or_create(candidate=self.candidate, employer=self.employer)
        messages = ChatMessage.objects.filter(chatroom=chatroom).order_by('timestamp')
        return [{'message': message.message , 'sendername':message.sendername , 'is_read': message.is_read} for message in messages]


    @database_sync_to_async
    def get_candidate_instance(self, candidate_id):
        try:
            candidate = Candidate.objects.get(id=candidate_id)
            candidate.user  
            return candidate
        except Candidate.DoesNotExist:
            return None

    @database_sync_to_async
    def get_employer_instance(self, employer_id):
        try:
            employer = Employer.objects.get(id=employer_id)
            employer.user  
            return employer
        except Employer.DoesNotExist:
            return None
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            f'chat_{self.candidate_id}_{self.employer_id}',
            self.channel_name
        )
    
    async def receive(self,text_data):
        data = json.loads(text_data)
        message = data['message']
        print("message..........",message)
        sendername = data.get('sendername', 'Anonymous')

        recipient_id = self.candidate_id if self.user_id == self.employer_id else self.employer_id
        is_read = recipient_id in ChatConsumer.active_users

        await self.save_message(sendername,message, is_read)
        await self.channel_layer.group_send(
            f'chat_{self.candidate_id}_{self.employer_id}',
            {
                'type':'chat.message',
                'data':{
                    'message': message,
                    'sendername': sendername,
                    'is_read': is_read
                }
            }
        )

    async def chat_message(self, event):
        message = event['data']['message']
        sendername = event['data']['sendername']
        is_read = event['data']['is_read']
        print("helllllllllllllllllooooooooooooooooooooooo")
        await self.send(text_data=json.dumps({
            'message': message,
            'sendername': sendername,
            'is_read': is_read
        }))

        await self.notify_new_message()
    
    async def notify_new_message(self):
        unread_count = await self.get_unread_messages_count(self.candidate_id, self.employer_id)
        await self.channel_layer.group_send(
            f'notification_{self.candidate_id}',
            {
                'type': 'notify.message',
                'unread_count': unread_count,
            }
        )
        await self.channel_layer.group_send(
            f'notification_{self.employer_id}',
            {
                'type': 'notify.message',
                'unread_count': unread_count,
            }
        )

    @database_sync_to_async
    def get_unread_messages_count(self, candidate_id, employer_id):
        chatroom, created = ChatRoom.objects.get_or_create(candidate_id=candidate_id, employer_id=employer_id)
        return ChatMessage.objects.filter(chatroom=chatroom, is_read=False).count()
    

    @classmethod
    async def send_chat_message(cls, candidate_id,employer_id,message):
        await cls.send_group(f'chat_{candidate_id}_{employer_id}', {
            'type': 'chat.message',
            'message': message,
        })
    
    async def save_message(self,sendername,message,is_read):
        try:
            candidate = await self.get_candidate_instance(self.candidate_id)
            employer = await self.get_employer_instance(self.employer_id)
            await self.save_message_to_db(candidate, employer, sendername, message,is_read)
        except:
            print("message could not save....")
    
    
    @database_sync_to_async
    def save_message_to_db(self,candidate,employer,sendername,message,is_read):
        try:
            print("inside save function.....",message,sendername)
            chatroom,created = ChatRoom.objects.get_or_create(candidate = candidate,employer = employer)

            ChatMessage.objects.create(
                chatroom = chatroom,
                message = message,
                sendername = sendername,
                 is_read=is_read
            )
            print("message saved to database")
        except:
            print("something went wrong.....")
    
    
class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'notifications_{self.user_id}'  # Unique group name for the userzz

        # Join room group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        notifications = await self.get_notifications()
        for notification in notifications:
            await self.send(text_data=json.dumps({
                'message': notification.message,
                'created_at': notification.created_at.isoformat(),
                'is_read': notification.is_read
            }))

    @database_sync_to_async
    def get_notifications(self):
        return list(CandidateNotification.objects.filter(user_id=self.user_id).order_by('-created_at'))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_notification',
                'message': message
            }
        )

    async def send_notification(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
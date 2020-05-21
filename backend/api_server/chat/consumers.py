from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync

from rest_framework.exceptions import ValidationError
class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.is_connect = False
        try:
            self.room_number = self.scope['url_route']['kwargs']['room_number']
            self.username = str(self.scope['validated']['user'])
        except KeyError:
            self.close()
            return
        self.room_group_name = 'chat_%s' % self.room_number

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        # Accept websocket sub protocol
        self.accept(self.scope['validated']['token'])
        self.is_connect = True

    def disconnect(self, close_code):
        if self.is_connect:
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )
            
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )


    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))
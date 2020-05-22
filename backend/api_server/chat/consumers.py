from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.is_connect = False

        try:
            self.room_number = self.scope['url_route']['kwargs']['room_number']
            self.username = str(self.scope['validated']['user'])
        except KeyError:
            # connection deny
            self.close()
            return

        # join room group
        self.room_group_name = 'chat_%s' % self.room_number
        await self.channel_layer.group_add(self.room_group_name,
                                            self.channel_name)

        # Accept websocket sub protocol
        await self.accept(self.scope['validated']['token'])
        self.is_connect = True

    async def disconnect(self, close_code):
        if self.is_connect:
            await self.channel_layer.group_discard(self.room_group_name,
                                                    self.channel_name)
                        
    async def receive_json(self, text_data):
        message = text_data['message']
        group_event = {'type': 'new_message', 'message': message, 'from': self.username}

        # Send data to group
        await self.channel_layer.group_send(self.room_group_name, group_event)
        

    async def new_message(self, event):
        # Send message to consumer
        send_data = {'message': event['message'], 'from': event['from']}

        await self.send(text_data=json.dumps(send_data))
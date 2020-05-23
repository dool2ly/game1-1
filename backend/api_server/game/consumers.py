import json
import copy

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .serializers import AvatarSerializer
from .models import Avatar



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
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept websocket sub protocol
        self.is_connect = True
        await self.accept(self.scope['validated']['token'])
        

    async def disconnect(self, close_code):
        if self.is_connect:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
                        
    async def receive_json(self, text_data):
        try:
            message = text_data['message']
        except KeyError:
            return

        if message:
            group_event = {'type': 'new_message', 'message': message, 'from': self.username}

            # Send data to group
            await self.channel_layer.group_send(self.room_group_name, group_event)
        

    async def new_message(self, event):
        # Send message to consumer from group
        send_data = {'message': event['message'], 'from': event['from']}

        await self.send_json(send_data)


class GameConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.is_connect = False

        try:
            user = self.scope['validated']['user']
            self.avatar_queryset = user.avatar_set.get()
            self.username = str(user)
            self.avatar_name = str(self.avatar_queryset)

        except KeyError:
            # connection deny
            self.close()
            return

        # join group
        self.group_name = 'game_main'
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        # Accept websocket sub protocol
        self.is_connect = True
        self.avatar_queryset.active = True
        self.avatar_queryset.save()
        await self.accept(self.scope['validated']['token'])

        # Send avatar initial location
        for i in  Avatar.objects.filter(active=True):
            await self.send_avatar_to_group(i.name, i.location)

    async def disconnect(self, close_code):
        self.avatar_queryset.active = False
        self.avatar_queryset.save()
        pass

    async def receive_json(self, text_data):
        '''
        Receive the command from consumer
        '''
        try:
            await self.command_handler(text_data['command'], text_data['data'])
        except KeyError:
            pass

    async def send_avatar_to_group(self, name=None, location=None):
        '''
        Send avatar location to group 
        '''
        if not name:
            name = self.avatar_name
        if not location:
            location = self.avatar_queryset.location

        group_event = {
            'type': 'send_avatar',
            'avatar': name,
            'location': location
        }

        await self.channel_layer.group_send(self.group_name, group_event)

    async def send_avatar(self, event):
        '''
        Send avatar, location received from group to consumer
        '''
        data = {
            'action': 'set_avatar',
            'data': {
                'avatar': event['avatar'],
                'location': event['location']
            }
        }

        await self.send_json(data)
        
    async def command_handler(self, command, data):
        if command == 'move':
            new_location = self.get_new_location(data['direction'])

            if self.is_possible_location(new_location):
                self.avatar_queryset.location = new_location
                self.avatar_queryset.save()
                await self.send_avatar_to_group()
            else:
                return
        
        elif command == 'test':
            print("ho")
            self.test_2()
    
    def test_2(self):
        pass
        



    
    def get_new_location(self, direction):
        new_location = copy.deepcopy(self.avatar_queryset.location)
        
        if direction == 'left':
            new_location[0] -= 1
        elif direction == 'right':
            new_location[0] += 1
        elif direction == 'up':
            new_location[1] -= 1
        elif direction == 'down':
            new_location[1] += 1

        return new_location
        
    def is_possible_location(self, new_location):
        return 0 <= new_location[0] < 15 and 0 <= new_location[1] < 7
        
    

import time

from django.core.exceptions import ObjectDoesNotExist
from channels.generic.websocket import AsyncJsonWebsocketConsumer, SyncConsumer

from .models import Avatar
from .game_engine.core import GameEngine

CLIENT_ANIMATION_SPEED = 0.450  # sec


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
        # Send message to channel from group
        send_data = {'message': event['message'], 'from': event['from']}

        await self.send_json(send_data)


class PlayerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.is_connect = False
        self.time_stamp = 0

        try:
            user = self.scope['validated']['user']
            self.username = str(user)
            
            avatar_queryset = user.avatar_set.get()
            self.avatar_name = avatar_queryset.name
            self.current_map = avatar_queryset.current_map

        except (KeyError, ObjectDoesNotExist):
            # connection deny
            await self.close()
            return
        
        # User already online
        # if avatar_queryset.active:
        #     await self.close()
        #     return

        # join group
        self.group_name = 'map_{}'.format(self.current_map)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        
        # Accept websocket sub protocol
        await self.accept(subprotocol=self.scope['validated']['token'])
        self.is_connect = True
        
        await self.send_to_game_engine(
            'new_avatar',
            {
                "name": self.avatar_name,
                "channel": self.channel_name
            }
        )

    async def disconnect(self, close_code):
        if self.is_connect:
            await self.send_to_game_engine(
                "unset_avatar",
                {
                    "name": self.avatar_name,
                    "map": self.current_map
                }
            )
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive_json(self, text_data):
        '''
        Receive the command from channel
        '''
        try:
            # make sure client animation speed
            if self.time_stamp + CLIENT_ANIMATION_SPEED < time.time():
                self.time_stamp = time.time()

                await self.command_handler(text_data['command'], text_data['data'])

        except KeyError:
            pass

    async def send_to_game_engine(self, action, data):
        """
        Forward user action to GameConsumer
        """
        await self.channel_layer.send(
            "game_engine",
            {
                "type": "new_event",
                "action": action,
                "data": data,
            }
        )

    async def dispatch_channel(self, event):
        """
        Send data received from group to channel
        """
        payload = {
            'target': event['target'],
            'data': event['data']
        }

        await self.send_json(payload)
        
    async def command_handler(self, command, data):
        action_type = ""
        action_data = {"name": self.avatar_name, "map": self.current_map}
        
        if command == "move":
            action_type = "move_avatar"
            action_data["direction"] = data['direction']

        elif command == 'attack':
            action_type = "attack_avatar"
        else:
            return

        await self.send_to_game_engine(action_type, action_data)
  

    
class GameConsumer(SyncConsumer):
    def __init__(self, *args, **kwargs):
        """
        Create on demeand when the first player joins.
        """
        super().__init__(*args, **kwargs)
        self.engine = GameEngine()
        self.engine.start()
    
    def new_event(self, event):
        self.engine.put_event(event['action'], event['data'])

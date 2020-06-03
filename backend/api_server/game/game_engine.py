import threading
import time
import queue
import copy

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class Avatar:
    def __init__(self, name, map, location):
        self.name = name
        self.map = map
        self.location = location
    
    def __repr__(self):
        return "<class 'Avatar', {}>".format(self.name)


class GameEngine(threading.Thread):
    def __init__(self):
        super().__init__()
        self.__queue = queue.Queue()
        self.__avatars = []
        self.__channel_layer = get_channel_layer()
    
    def put_event(self, action, data):
        item = {'action': action, 'data': data}
        self.__queue.put(item)

    def send_avatar_to_group(self, state, avatar):
        group_name = "map_{}".format(avatar.map)
        group_event = {
            "type": "dispatch_channel",
            "target": "avatar",
            "data": {
                "state": state,
                "name": avatar.name,
                "location": avatar.location
            }
        }

        async_to_sync(self.__channel_layer.group_send)(group_name, group_event)

    def broadcast_avatars(self, map):
        """
        Send all avatars on the same map 
        """
        for avatar in list(filter(lambda x: x.map == map, self.__avatars)):
            self.send_avatar_to_group('set', avatar)

    def get_avatar(self, name) -> list:
        return list(filter(lambda x: x.name == name, self.__avatars))

    def new_avatar(self, data) -> None:
        """
        Add new avatar
        """
        if self.get_avatar(data['name']):
            return

        avatar = Avatar(data['name'], data['map'], data['location'])
        self.__avatars.append(avatar)
        self.broadcast_avatars(avatar.map)
    
    def unset_avatar(self, data):
         for i, avatar in enumerate(self.__avatars):
             if avatar.name == data['name']:
                 target = self.__avatars.pop(i)
                 self.send_avatar_to_group('unset', target)
                 break
    
    def is_possible_location(self, location) -> bool:
        return 0 <= location[0] < 15 and 0 <= location[1] < 7

    def move_avatar(self, data) -> None:
        avatar = self.get_avatar(data['name'])

        if avatar:
            avatar = avatar[0]
        else:
            return

        direction = data['direction']
        new_location = copy.deepcopy(avatar.location)

        if direction == 'left':
            new_location[0] -= 1
        elif direction == 'right':
            new_location[0] += 1
        elif direction == 'up':
            new_location[1] -= 1
        elif direction == 'down':
            new_location[1] += 1
        
        if self.is_possible_location(new_location):
            avatar.location = new_location
            self.send_avatar_to_group('move', avatar)

    def run(self) -> None:
        while True:
            event = self.__queue.get()
            action = event['action']

            if action == 'new_avatar':
                self.new_avatar(event['data'])

            elif action == 'move_avatar':
                self.move_avatar(event['data'])
            
            elif action == 'unset_avatar':
                self.unset_avatar(event['data'])

            else:
                print('Unknown action,',event['action'], event['data'])

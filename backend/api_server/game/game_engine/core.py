import threading
import time
import queue
import copy

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from game.models import Avatar as AvatarModel
from .controllers import MapController


class Avatar(object):
    def __init__(self, name, map, location):
        self.name = name
        self.map = map
        self.location = location
    
    def __repr__(self):
        return "<object 'Avatar', {}>".format(self.name)
    
    def __str__(self):
        return "avatar"


class GameEngine(threading.Thread):
    def __init__(self):
        super().__init__()
        self._queue = queue.Queue()
        self.avatars = []
        self.channel_layer = get_channel_layer()
        self.map_controller = MapController()
    
    def put_event(self, action, data):
        item = {'action': action, 'data': data}
        self._queue.put(item)

    def send_object_to_group(self, state, obj):
        group_name = "map_{}".format(obj.map)
        group_event = {
            "type": "dispatch_channel",
            "target": str(obj),
            "data": {
                "state": state,
                "name": obj.name,
                "location": obj.location
            }
        }
        if hasattr(obj, 'id'):
            group_event['data']['id'] = obj.id

        async_to_sync(self.channel_layer.group_send)(group_name, group_event)

    def broadcast_avatars(self, map):
        """
        Send all avatars on the same map 
        """
        for avatar in list(filter(lambda x: x.map == map, self.avatars)):
            self.send_object_to_group('set', avatar)

    def get_avatar(self, name) -> list:
        return list(filter(lambda x: x.name == name, self.avatars))

    def new_avatar(self, data) -> None:
        """
        Add new avatar
        """
        if self.get_avatar(data['name']):
            return

        avatar = Avatar(data['name'], data['map'], data['location'])
        self.avatars.append(avatar)
        self.broadcast_avatars(avatar.map)
    
    def unset_avatar(self, data):
         for i, avatar in enumerate(self.avatars):
             if avatar.name == data['name']:
                 target = self.avatars.pop(i)
                 self.send_object_to_group('unset', target)

                 avatar_queryset = AvatarModel.objects.get(name=data['name'])
                 avatar_queryset.location = target.location
                 avatar_queryset.active = False
                 avatar_queryset.save()
                 break

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
        
        if self.map_controller.is_possible_location(avatar.map, new_location):
            avatar.location = new_location
            self.send_object_to_group('move', avatar)

    def handle_monster(self) -> None:
        if not self.map_controller.is_monster_update:
            return

        activated_maps = []
        for avatars in self.avatars:
            if avatars.map not in activated_maps:
                activated_maps.append(avatars.map)
        
        for map_id in activated_maps:
            monster = self.map_controller.add_random_monster(map_id)
            
            if monster:
                self.send_object_to_group('set', monster)
                

    def run(self) -> None:
        while True:
            try:
                self.handle_monster()
                event = self._queue.get(timeout=3)
            except queue.Empty:
                pass
            else:
                action = event['action']

                if action == 'new_avatar':
                    self.new_avatar(event['data'])
                elif action == 'move_avatar':
                    self.move_avatar(event['data'])
                elif action == 'unset_avatar':
                    self.unset_avatar(event['data'])
                else:
                    print('Unknown action,',event['action'], event['data'])
            
            
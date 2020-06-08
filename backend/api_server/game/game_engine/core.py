import threading
import time
import queue
import copy

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from game.models import Avatar as AvatarModel
from .controllers import MapController


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
        if hasattr(obj, 'direction'):
            group_event['data']['direction'] = obj.direction

        async_to_sync(self.channel_layer.group_send)(group_name, group_event)

    def broadcast_avatars(self, map_id):
        """
        Send all avatars on the same map 
        """
        avatars = self.map_controller.get_avatars_on_map(map_id)
        for avatar in avatars:
            self.send_object_to_group('set', avatar)

    def broadcast_monsters(self, map_id):
        """
        Send all monsters on the same map
        """
        monsters = self.map_controller.get_monsters_on_map(map_id)
        for monster in monsters:
            self.send_object_to_group('set', monster)

    def new_avatar(self, data) -> None:
        """
        Add new avatar to map
        """
        res = self.map_controller.add_avatar(
            data['name'],
            data['map'],
            data['location']
        )

        if res:
            self.broadcast_avatars(data['map'])
            self.broadcast_monsters(data['map'])
    
    def unset_avatar(self, data):
        target = self.map_controller.pop_avatar(data['name'], data['map'])
        if target:
            self.send_object_to_group('unset', target)
            avatar_queryset = AvatarModel.objects.get(name=data['name'])
            avatar_queryset.location = target.location
            avatar_queryset.active = False
            avatar_queryset.save()

    def move_avatar(self, data) -> None:
        avatar = self.map_controller.get_avatar(data['name'], data['map'])

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
        elif avatar.direction == direction:
            return

        avatar.direction = direction
        self.send_object_to_group('move', avatar)

    def handle_monster(self) -> None:
        activated_maps = self.map_controller.get_activated_maps()
        if self.map_controller.is_monster_update():
            for map_id in activated_maps:
                monster = self.map_controller.add_random_monster(map_id)
                if monster:
                    self.send_object_to_group('set', monster)
        
        for map_id in activated_maps:
            monsters = self.map_controller.get_monster_to_move(map_id)

            for monster in monsters:
                new_location = monster.random_move()

                if self.map_controller.is_possible_location(map_id, new_location):
                    monster.location = new_location
                    self.send_object_to_group('move', monster)
                    monster.update_movement()

    def run(self) -> None:
        while True:
            try:
                self.handle_monster()
                event = self._queue.get(block=False)
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
            
            
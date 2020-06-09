import threading
import time
import queue

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from . import utils
from . import controllers
from game.models import Avatar as AvatarModel
from game.serializers import AvatarSerializer


class GameEngine(threading.Thread):
    def __init__(self):
        super().__init__()
        self._queue = queue.Queue()
        self.avatars = []
        self.channel_layer = get_channel_layer()
        self.map_controller = controllers.MapController()
    
    def put_event(self, action, data):
        item = {'action': action, 'data': data}
        self._queue.put(item)

    def send_object_to_group(self, state, obj):
        group_name = "map_{}".format(obj.map_id)
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
    
    def send_event_to_group(self, map_id, event_type, name, target=None):
        group_name = "map_{}".format(map_id)
        group_event = {
            "type": "dispatch_channel",
            "target": "event",
            "data": {
                "type": event_type,
                "from": name,
                "to": None
            }
        }
        if target:
            group_event['data']['to'] = {"id": target.id, "hp": target.hp}

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

    def send_avatar_statistics(self, avatar):
        serializer = AvatarSerializer(instance=avatar.query_set)
        event_data = {
            "type": "dispatch_channel",
            "target": "stats",
            "data": serializer.data
        }
        async_to_sync(self.channel_layer.send)(avatar.channel, event_data)

    def new_avatar(self, data) -> None:
        """
        Add new avatar to map
        """
        query_set = AvatarModel.objects.get(name=data['name'])
        if query_set:
            avatar = self.map_controller.add_avatar(
                data['name'],
                data['channel'],
                query_set
            )

            if avatar:
                self.broadcast_avatars(avatar.map_id)
                self.broadcast_monsters(avatar.map_id)
                self.send_avatar_statistics(avatar)
    
    def unset_avatar(self, data):
        avatar = self.map_controller.pop_avatar(data['name'], data['map'])
        if avatar:
            self.send_object_to_group('unset', avatar)
            avatar.deactivate()
            

    def move_avatar(self, data) -> None:
        avatar = self.map_controller.get_avatar(data['name'], data['map'])
        if avatar:
            avatar = avatar[0]
        else:
            return

        direction = data['direction']
        new_location = utils.get_location_by_direction(
            avatar.location,
            direction
        )

        if self.map_controller.is_possible_location(avatar.map_id, new_location):
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
    
    def attack_avatar(self, data):
        avatar = self.map_controller.get_avatar(data['name'], data['map'])
        if avatar:
            avatar = avatar[0]
        else:
            return

        attack_location = utils.get_location_by_direction(
            avatar.location,
            avatar.direction
        )

        target_id = None
        target = self.map_controller.get_monster_by_location(
            avatar.map_id,
            attack_location
        )
        if target:
            target.hp -= 10

        self.send_event_to_group(avatar.map_id, 'attack', avatar.name, target)
            
    def run(self) -> None:
        while True:
            try:
                self.handle_monster()
                event = self._queue.get(block=False)
            except queue.Empty:
                pass
            else:
                action = event['action']

                if action == "new_avatar":
                    self.new_avatar(event['data'])
                elif action == "move_avatar":
                    self.move_avatar(event['data'])
                elif action == "unset_avatar":
                    self.unset_avatar(event['data'])
                elif action == "attack_avatar":
                    self.attack_avatar(event['data'])
                else:
                    print('Unknown action,',event['action'], event['data'])
            
            
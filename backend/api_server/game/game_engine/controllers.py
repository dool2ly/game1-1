import time
import random
from collections import namedtuple

from game.serializers import AvatarSerializer
from . import maps
from . import utils

MAP_WIDTH = 15
MAP_HEIGHT = 7
MONSTER_SPREAD_INTERVAL = 5 # sec
MAX_MONSTER = 3
DIRECTION_SOUTH = "down"
DIRECTION_NORTH = "up"
DIRECTION_WEST = "left"
DIRECTION_EAST = "right"
Map = namedtuple(
    'Map',
    [
        'id',
        'tiles',
        'avatars',
        'monsters',
        'avail_monsters',
        'max_monster'
    ]
)
EXP_TABLE = [i for i in range(100, 1000, 100)]

class Avatar(object):
    def __init__(self, name, channel, query_set):
        self.name = name
        self.direction = DIRECTION_SOUTH
        self.channel = channel
        self.query_set = query_set

        self.activate()

    def get_next_exp(self):
        for i in EXP_TABLE:
            if self.stats['exp'] < i:
                return i

    def activate(self):
        self.map_id = self.query_set.current_map
        self.location = self.query_set.location
        serializer = AvatarSerializer(self.query_set)
        self.stats = serializer.data

        self.query_set.active = True
        self.query_set.save()
    
    def deactivate(self):
        self.query_set.current_map = self.map_id
        self.query_set.location = self.location
        serializer = AvatarSerializer(self.query_set, data=self.stats)
        if serializer.is_valid():
            serializer.save()

        self.query_set.active = False
        self.query_set.save()
    
    def __repr__(self):
        return "<object 'Avatar', {}>".format(self.name)

    def __str__(self):
        return "avatar"


class MapController(object):
    def __init__(self):
        self.monster_updated = 0
        self.maps = {}
        self.load_map_info(maps.map_settings)
        self.monster_id = 0

    def load_map_info(self, maps) -> None:
        for map_id, info in maps.items():
            self.maps[map_id] = Map(
                    id = map_id,
                    tiles = info['tiles'],
                    avatars = [],
                    monsters = [],
                    avail_monsters = info['monsters'],
                    max_monster= info['max_monster']
            )
    
    def is_monster_update(self) -> bool:
        return self.monster_updated + MONSTER_SPREAD_INTERVAL < time.time()
            
    def check_boundaries(self, location) -> bool:
        return 0 <= location[0] < MAP_WIDTH and 0 <= location[1] < MAP_HEIGHT

    def check_tiles(self, map_id, location) -> bool:
        x = location[0]
        y = location[1]
        
        return self.maps[map_id].tiles[y][x] < 1

    def check_objects(self, map_id, location) -> bool:
        for avatar in self.maps[map_id].avatars:
            if avatar.location == location:
                return False

        for monster in self.maps[map_id].monsters:
            if monster.location == location:
                return False

        return True

    def is_possible_location(self, map_id, location) -> bool:
        if self.check_boundaries(location):
            if self.check_tiles(map_id, location):
                if self.check_objects(map_id, location):
                    return True

        return False

    def add_random_monster(self, map_id):
        """
        Add one random available monster to map
        """
        if len(self.maps[map_id].monsters) < self.maps[map_id].max_monster:
            random_idx = random.randrange(0, len(self.maps[map_id].avail_monsters))
            monster = self.maps[map_id].avail_monsters[random_idx]

            while True:
                location = utils.get_random_location()
                if self.is_possible_location(map_id, location):
                    break

            _instance = monster(self.monster_id, map_id, location)

            self.maps[map_id].monsters.append(_instance)
            self.monster_id += 1
            self.monster_updated = time.time()

            return _instance

    def get_avatar(self, name, map_id) -> list:
        current_map = self.maps[map_id]
        if not current_map.avatars:
            return []
        return list(filter(lambda x: x.name == name, current_map.avatars))
    
    def get_avatar_by_name(self, name) -> list:
        for map_id, map_instance in self.maps.items():
            for avatar in map_instance.avatars:
                if avatar.name == name:
                    return avatar
    
    def get_monster_by_location(self, map_id, location):
        for monster in self.maps[map_id].monsters:
            if monster.location == location:
                return monster
    
    def get_avatars_on_map(self, map_id) -> list:
        return self.maps[map_id].avatars

    def get_monsters_on_map(self, map_id) -> list:
        return self.maps[map_id].monsters

    def add_avatar(self, name, channel, query_set):
        """
        Add new avatar
        """
        if self.get_avatar_by_name(name):
            return None

        avatar = Avatar(name, channel, query_set)
        map_id = avatar.map_id
        self.maps[map_id].avatars.append(avatar)
        return avatar
    
    def get_activated_maps(self) -> list:
        """
        Return avatar existing maps
        """
        ret = []
        for map_id, map in self.maps.items():
            if map.avatars:
                ret.append(map_id)

        return ret

    def pop_avatar(self, name, map_id):
        """
        Remove avatar and return removed avatar
        """
        for i, avatar in enumerate(self.maps[map_id].avatars):
            if avatar.name == name:
                return self.maps[map_id].avatars.pop(i)

    def get_monster_to_move(self, map_id):
        """
        Return monsters that ready to monve
        """
        now = time.time()
        return list(filter(lambda x: x.movement_time < now, self.maps[map_id].monsters))
    
    def pop_monster(self, map_id, monster_id):
        """
        Remove avatar and return removed avatar
        """
        for i, monster in enumerate(self.maps[map_id].monsters):
            if monster.id == monster_id:
                return self.maps[map_id].monsters.pop(i)


    


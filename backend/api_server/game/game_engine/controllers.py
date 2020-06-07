import time
import random
from collections import namedtuple

from . import maps

MAP_WIDTH = 15
MAP_HEIGHT = 7
MONSTER_SPREAD_INTERVAL = 5 # sec
MAX_MONSTER = 3
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


class Avatar(object):
    def __init__(self, name, map, location):
        self.name = name
        self.map = map
        self.location = location
    
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
                    max_monster=MAX_MONSTER
            )
    
    def is_monster_update(self) -> bool:
        return self.monster_updated + MONSTER_SPREAD_INTERVAL < time.time()
            
    def check_boundaries(self, location) -> bool:
        return 0 <= location[0] < MAP_WIDTH and 0 <= location[1] < MAP_HEIGHT

    def check_tiles(self, map_id, location) -> bool:
        x = location[0]
        y = location[1]
        
        return self.maps[map_id].tiles[y][x] < 1

    def check_others(self, map_id, location) -> bool:
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
                if self.check_others(map_id, location):
                    return True

        return False

    def get_random_location(self):
        return [random.randint(0, MAP_WIDTH-1), random.randint(0, MAP_HEIGHT-1)]
    
    def add_random_monster(self, map_id):
        if len(self.maps[map_id].monsters) < self.maps[map_id].max_monster:
            random_idx = random.randint(0, len(self.maps[map_id].avail_monsters)-1)
            monster = self.maps[map_id].avail_monsters[random_idx]

            while True:
                location = self.get_random_location()
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
    
    def get_avatars_on_map(self, map_id) -> list:
        return self.maps[map_id].avatars

    def add_avatar(self, name, map_id, location) -> bool:
        """
        Add new avatar
        """
        if self.get_avatar(name, map_id):
            return False

        avatar = Avatar(name, map_id, location)
        self.maps[map_id].avatars.append(avatar)
        return True
    
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




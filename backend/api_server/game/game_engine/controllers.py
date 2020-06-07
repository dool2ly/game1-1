import time
import random
from collections import namedtuple

from . import maps

MAP_WIDTH = 15
MAP_HEIGHT = 7
MONSTER_SPREAD_INTERVAL = 5 # sec
MAX_MONSTER = 3

Map = namedtuple('Map', ['id', 'tiles', 'monsters', 'current_monsters', 'max_monster'])

class MapController(object):
    def __init__(self):
        self.monster_updated = 0
        self.map_list = []
        self.load_map_info(maps.map_settings)
        self.monster_id = 0

    def load_map_info(self, maps) -> None:
        for map_id, info in maps.items():
            self.map_list.append(
                Map(
                    id=map_id,
                    tiles=info['tiles'],
                    monsters=info['monsters'],
                    current_monsters=[],
                    max_monster=MAX_MONSTER,
                )
            )
    
    def is_monster_update(self) -> bool:
        if self.monster_updated + MONSTER_SPREAD_INTERVAL < time.time():
            self.monster_updated = time.time()
            return True
        return False

    def check_boundaries(self, location) -> bool:
        return 0 <= location[0] < MAP_WIDTH and 0 <= location[1] < MAP_HEIGHT

    def check_tiles(self, map_id, location) -> bool:
        current_map = self.get_map(map_id)
        x = location[0]
        y = location[1]

        return current_map.tiles[y][x] < 1

    def is_possible_location(self, map_id, location) -> bool:
        return self.check_boundaries(location) and self.check_tiles(map_id, location)

    def get_map(self, id):
        for map in self.map_list:
            if map.id == id:
                return map

    def get_random_location(self):
        return [random.randint(0, MAP_WIDTH-1), random.randint(0, MAP_HEIGHT-1)]
    
    def add_random_monster(self, map_id):
        map = self.get_map(map_id)

        if len(map.current_monsters) < map.max_monster:
            random_idx = random.randint(0, len(map.monsters)-1)
            monster = map.monsters[random_idx]

            _instance = monster(self.monster_id, map_id, self.get_random_location())

            map.current_monsters.append(_instance)
            self.monster_id += 1

            return _instance

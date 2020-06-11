import copy
import random 
from . import controllers

map_to_direction = [
    controllers.DIRECTION_WEST,
    controllers.DIRECTION_EAST,
    controllers.DIRECTION_NORTH,
    controllers.DIRECTION_SOUTH
]
def get_location_by_direction(location, direction):
    new_location = copy.deepcopy(location)

    if direction == controllers.DIRECTION_WEST:
        new_location[0] -= 1
    elif direction == controllers.DIRECTION_EAST:
        new_location[0] += 1
    elif direction == controllers.DIRECTION_NORTH:
        new_location[1] -= 1
    elif direction == controllers.DIRECTION_SOUTH:
        new_location[1] += 1
    
    return new_location

def get_random_location():
    return [
        random.randrange(0, controllers.MAP_WIDTH),
        random.randrange(0, controllers.MAP_HEIGHT)
    ]
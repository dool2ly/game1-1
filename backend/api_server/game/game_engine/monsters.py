import time
import copy
import random


class Monster(object):
    name = ''

    def __init__(self, id, map_id, location):
        self.id = id
        self.map_id = map_id
        self.location = location
        self.movement_time = 0
        self.hp = 100

        self.update_movement()

    def __repr__(self):
        return "<object 'Monster', {}>".format(self.name)

    def __str__(self):
        return "monster"
    
    def random_move(self):
        rand = random.randint(0, 3)
        new_location = copy.deepcopy(self.location)

        if rand == 0:
            new_location[0] -= 1
        elif rand == 1:
            new_location[0] += 1
        elif rand == 2:
            new_location[1] -= 1
        elif rand == 3:
            new_location[1] += 1
        
        return new_location

    def update_movement(self):
        self.movement_time = time.time() + random.uniform(1, 10)


class Deer(Monster):
    def __init__(self, id, map, location):
        super().__init__(id, map, location)
        self.name = "Deer"    


class Pig(Monster):
    def __init__(self, id, map, location):
        super().__init__(id, map, location)
        self.name = "Pig"
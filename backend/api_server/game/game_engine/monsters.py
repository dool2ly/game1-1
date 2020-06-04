class Monster(object):
    name = ''

    def __init__(self, id, map, location):
        self.id = id
        self.map = map
        self.location = location

    def __repr__(self):
        return "<object 'Monster', {}>".format(self.name)
    def __str__(self):
        return "monster"

class Deer(Monster):
    def __init__(self, id, map, location):
        super().__init__(id, map, location)
        self.name = "Deer"    

class Pig(Monster):
    def __init__(self, id, map, location):
        super().__init__(id, map, location)
        self.name = "Pig"
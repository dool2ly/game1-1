import threading
import time
import queue


class Avatar:
    def __init__(self, name, map, location):
        self.name = name
        self.map = map
        self.location = location


class GameEngine(threading.Thread):
    def __init__(self):
        super().__init__()
        # self.__queue_avatar = queue.Queue()
        self.__avatars = {} # ex {map_number: [<class 'Avatar'>, .. ]}

    def set_avatar(self, name, map, location) -> None:
        """
        Add avatar class with map number
        """
        if map in self.__avatars:
            Exists = list(filter(lambda x: x.name == name, self.__avatars[map]))

            if len(Exists) == 0:
                self.__avatars[map].append(Avatar(name, map, location))
            else:
                # If avatar is already on the map, update location
                Exists[0].location = location
        else:
            # this avatar is first on the map
            self.__avatars[map] = [Avatar(name, map, location)]
    
    def get_avatars(self, map) -> list:
        """
        Return avatars on the map
        """
        if map in self.__avatars:
            return self.__avatars[map]

        return []

    def run(self) -> None:
        while True:
            # task = self.__queue_avatar.get()
            print('get in thread', self.__avatars)
            time.sleep(3)
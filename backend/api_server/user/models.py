from django.db import models
from django.contrib.postgres.fields import ArrayField


class User(models.Model):
    username = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.username
        

class Avatar(models.Model):
    name = models.CharField(max_length=10, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    current_map = models.IntegerField(default=0)
    location = ArrayField(models.IntegerField(default=0), size=2)

    def __str__(self):
        return self.name

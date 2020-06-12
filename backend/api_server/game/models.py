from django.db import models
from django.contrib.postgres.fields import ArrayField

from api.models import User

class Avatar(models.Model):
    name = models.CharField(max_length=15, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    current_map = models.IntegerField(default=0)
    location = ArrayField(models.IntegerField(default=0), size=2)
    active = models.BooleanField(default=False)
    level = models.IntegerField(default=1)
    health = models.IntegerField(default=100)
    max_health = models.IntegerField(default=100)
    mana = models.IntegerField(default=100)
    max_mana = models.IntegerField(default=100)
    money = models.IntegerField(default=0)
    exp = models.IntegerField(default=0)

    def __str__(self):
        return self.name

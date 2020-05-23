from django.db import models
from django.contrib.postgres.fields import ArrayField

from api.models import User

class Avatar(models.Model):
    name = models.CharField(max_length=15, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    current_map = models.IntegerField(default=0)
    location = ArrayField(models.IntegerField(default=0), size=2)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

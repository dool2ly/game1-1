from django.db import models
from django.contrib.postgres.fields import ArrayField


class User(models.Model):
    user_name = models.CharField(max_length=15)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.user_name

class Avatar(models.Model):
    name = models.CharField(max_length=10)
    owner_name = models.ForeignKey(User, on_delete=models.CASCADE)
    current_map = models.IntegerField(default=0)
    location = ArrayField(models.IntegerField(default=0), size=2)

    def __str__(self):
        return self.name

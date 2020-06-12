from rest_framework import serializers

from .models import Avatar

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = ('name', 'level', 'health', 'max_health', 'mana', 'max_mana', 'money', 'exp')

from rest_framework import serializers

from .models import Avatar

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = ('name', 'current_map', 'location')

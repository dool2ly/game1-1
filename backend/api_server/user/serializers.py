import re
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import User, Avatar


def valid_plain_text(text):
    reg = re.compile("[^a-zA-Z0-9]")

    return False if reg.search(text) else True

def has_admin(text):
    reg = re.compile("admin", re.I)
    return True if reg.search(text) else False

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, max_length=15) 
    password = serializers.CharField(required=True, min_length=4)

    class Meta:
        model = User
        fields = ('username', 'password')

    def validate_username(self, value):
        if not valid_plain_text(value):
            raise ValidationError(code='not_plain')

        if has_admin(value):
            raise ValidationError(code='invalid')

        return value
    
    def validate_password(self, value):
        if not valid_plain_text(value):
            raise ValidationError(code='not_plain')

        return value
    def is_user_duplicate(self):
        return self.Meta.model.objects.filter(username=self.validated_data['username']).exists()

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fileds = ('name', 'owner_id', 'current_map', 'location')

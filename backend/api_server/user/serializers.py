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
    class Meta:
        model = User
        fields = ('user_name', 'password')
    
    def validate_user_name(self, value):
        if not valid_plain_text(value):
            raise ValidationError('ID_NOT_PLAIN_TEXT')
        if has_admin(value):
            raise ValidationError('INVALID_ID')
        return value
    
    def validate_password(self, value):
        if not valid_plain_text(value):
            raise ValidationError('PASSWORD_NOT_PLAIN_TEXT')
        return value

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fileds = ('name', 'owner_name', 'current_map', 'location')

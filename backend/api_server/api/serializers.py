import re
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer

from .models import User
from rest_framework_jwt.settings import api_settings

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_decode_handler = api_settings.JWT_DECODE_HANDLER
jwt_get_username_from_payload = api_settings.JWT_PAYLOAD_GET_USERNAME_HANDLER

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

    def is_user_exist(self):
        return self.Meta.model.objects.filter(username=self.validated_data['username']).exists()


class JWTSerializerWithUser(serializers.Serializer):
    username = serializers.CharField(required=True, max_length=15) 
    password = serializers.CharField(required=True, min_length=4)
    
    class Meta:
        model = User
        fields = ('username', 'password')

    def validate(self, attrs):
        try:
            user = self.Meta.model.objects.get(username=attrs.get('username'),
                                                password=attrs.get('password'))
        except Exception as e:
            raise ValidationError({'jwt_token': 'Get user query failed.'}, code='invalid_user')
        
        payload = jwt_payload_handler(user)

        return jwt_encode_handler(payload)


class VerifyJWTSerializerWithUser(VerifyJSONWebTokenSerializer):
    class Meta:
        model = User
        
    def _check_user(self, payload):
        username = jwt_get_username_from_payload(payload)

        if not username:
            msg = _('Invalid payload.')
            raise ValidationError(msg)

        # Make sure user exists
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            msg = _("User doesn't exist.")
            raise ValidationError(msg)

        return user
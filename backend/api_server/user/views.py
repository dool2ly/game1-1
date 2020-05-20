from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import User
from .exceptions import UserValidateError
from .serializers import UserSerializer, JWTSerializerWithUser


class ValidateUserInputs(APIView):
    success_repond = {'success': True}

    def set_user_serializer(self, username, password):
        """
        Set serializer and check validation 
        """
        user_data = {'username': username, 'password': password}
        self.user_serializer = UserSerializer(data=user_data)

        if not self.user_serializer.is_valid():
            raise UserValidateError(self.user_serializer.errors)

class UserView(ValidateUserInputs):
    def post(self, request, username):
        """
        User sign-up API
        """
        self.set_user_serializer(username, request.data['password'])

        if self.user_serializer.is_user_exist():
            raise UserValidateError(code='exist_username')

        try:
            # Create user
            self.user_serializer.save()
            
        except Exception as e:
            print("Error!!- ", (e))
            raise UserValidateError(code='server_error')

        return Response(self.success_repond)

    def get(self, request, username):
        """
        Username dupclicate check API
        """
        self.set_user_serializer(username, 'goodpassword')
        self.success_repond['exists'] = self.user_serializer.is_user_exist()

        return Response(self.success_repond)

class LoginView(ValidateUserInputs):
    def post(self, request, username):
        self.set_user_serializer(username, request.data['password'])
        token_serializer = JWTSerializerWithUser(data=self.user_serializer.validated_data)

        if not token_serializer.is_valid():
            # username, password is not match
            raise UserValidateError(code='user_auth_fail')

        self.success_repond['token'] = token_serializer.validated_data

        return Response(self.success_repond)
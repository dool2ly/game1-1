from rest_framework import status
from rest_framework.views import APIView, exception_handler
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import ErrorDetail

from .exceptions import UserValidateError
from .models import User
from .serializers import UserSerializer


class ValidateUserInputs(APIView):
    def set_serializer(self, username, password):
        """
        Set serializer and check validation 
        """
        user_data = {'username': username, 'password': password}
        self.serializer = UserSerializer(data=user_data)

        if not self.serializer.is_valid():
            raise UserValidateError(self.serializer.errors)

class UserView(ValidateUserInputs):
    success_repond = {'success': True}
    def post(self, request, username):
        """
        User sign-up API
        """
        self.set_serializer(username, request.data['password'])
        if self.serializer.is_user_duplicate():
            raise UserValidateError(code='exist_username')

        try:
            # Create user
            self.serializer.save()
            
        except Exception as e:
            print("Error!!- ", (e))
            raise UserValidateError(code='server_error')

        return Response(self.success_repond)

    def get(self, request, username):
        """
        Username dupclicate check API
        """
        self.set_serializer(username, 'goodpassword')
        self.success_repond['exists'] = self.serializer.is_user_duplicate()

        return Response(self.success_repond)

class LoginView(ValidateUserInputs):
    def post(self, request, username):
        print(login)
        raise UserValidateError(code='not_ready')
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer


class ValidateUserInputs(APIView):
    response_data = {'message': ''}
    status_code = status.HTTP_400_BAD_REQUEST

    def set_and_validate_serializer(self, user_name, password):
        self.serializer = UserSerializer(data={'user_name': user_name, 'password': password})
        return self.serializer.is_valid()

    def get_error_list_from_serializer(self):
        ret_list = []
        for k, errors in self.serializer.errors.items():
            for error in errors:
                if error.code is 'max_length':
                    error = 'MAX_LENGTH'
                ret_list.append(error)

        return ret_list
    
    def is_user_duplicate(self):
        return User.objects.filter(user_name=self.serializer.validated_data['user_name']).exists()

class UserView(ValidateUserInputs):
    # sign-up user
    def post(self, request, user_name):
        if self.set_and_validate_serializer(user_name, request.data['password']):
            if not self.is_user_duplicate():
                # Create user and set success respond
                self.serializer.save()
                self.status_code = status.HTTP_200_OK
            else:
                self.response_data['message'] = "ID is already in use."
                self.response_data['errors'] = ["ID_EXISTS"]
        else:
            self.response_data['message'] = "Invalid input."
            self.response_data['errors'] = self.get_error_list_from_serializer()

        return Response(self.response_data, self.status_code)

    # User duplicate check
    def get(self, request, user_name):
        if self.set_and_validate_serializer(user_name, 'tmp'):
            # Set success respond
            self.response_data['exists'] = self.is_user_duplicate()
            self.status_code = status.HTTP_200_OK
        else:
            self.response_data['message'] = "Invalid input."  
            self.response_data['errors'] = self.get_error_list_from_serializer()

        return Response(self.response_data, self.status_code)

class LoginView(ValidateUserInputs):
    def post(self, request, user_name):
        print("Login")
        return Response()
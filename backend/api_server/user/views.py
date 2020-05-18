from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer


def get_error_list_from_serializer(serializer):
    ret_list = []

    for k, errors in serializer.errors.items():
        for error in errors:
            ret_list.append(error)

    return ret_list


class UserView(APIView):
    """
    User POST:create user, GET:username duplicate check, DELETE:delete user
    """
    response_data = {'message': ''}
    status_code = status.HTTP_400_BAD_REQUEST

    def set_and_validate_serializer(self, user_name, password):
        self.serializer = UserSerializer(data={'user_name': user_name, 'password': password})
        return self.serializer.is_valid()

    def get_error_list_from_serializer(self):
        ret_list = []
        for k, errors in self.serializer.errors.items():
            for error in errors:
                ret_list.append(error)

        return ret_list
    
    def is_user_duplicate(self):
        return User.objects.filter(user_name=self.serializer.validated_data['user_name']).exists()

    # sign-up user
    def post(self, request, user_name):
        if self.set_and_validate_serializer(user_name, request.data['password']):
            if not self.is_user_duplicate():
                # Create user and set success respond
                self.serializer.save()
                self.status_code = status.HTTP_200_OK
            else:
                self.response_data['message'] = "ID is already in use."
        else:
            errors = self.get_error_list_from_serializer()
            self.response_data['message'] = "Invalid input. [{}]".format(', '.join(errors))  

        return Response(self.response_data, self.status_code)

    # User duplicate check
    def get(self, request, user_name):
        if self.set_and_validate_serializer(user_name, 'tmp'):
            self.response_data['exists'] = self.is_user_duplicate()
            self.status_code = status.HTTP_200_OK
        else:
            errors = self.get_error_list_from_serializer()
            self.response_data['message'] = "Invalid input. [{}]".format(', '.join(errors))  

        return Response(self.response_data, self.status_code)


from rest_framework import status
from rest_framework.views import APIView
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
    
    # User create
    def post(self, request, user_name):
        message = ""
        status_code = status.HTTP_400_BAD_REQUEST
        
        try:
            serializer = UserSerializer(data={
                'user_name': user_name,
                'password': request.data['password']})
        
            if serializer.is_valid():
                if not User.objects.filter(user_name=user_name).exists():
                    # Validate user data save to database
                    serializer.save()
                    status_code = status.HTTP_201_CREATED
                else:
                    message = "User exist."
            else:
                # Serializer validate fail
                errors = get_error_list_from_serializer(serializer)
                message = "Invalid input. [{}]".format(', '.join(errors))

        except Exception as e:
            print("[ERROR] UserView.post():", str(e))
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'message': message}, status_code)

    # User duplicate check
    def get(self, request, user_name):
        message = ""
        status_code = status.HTTP_400_BAD_REQUEST
        try:
            serializer = UserSerializer(data={'user_name': user_name, 'password': 'tmp'})
            if serializer.is_valid():
                if User.objects.filter(user_name=user_name).exists():
                    message = "exists"
                else:
                    message = "not exists"
                status_code = status.HTTP_200_OK
            else:
                # Serializer valid fail
                errors = get_error_list_from_serializer(serializer)
                message = "Invalid input. [{}]".format(', '.join(errors))

        except Exception as e:
            print("[ERROR] UserView.get():", str(e))
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': message}, status_code)

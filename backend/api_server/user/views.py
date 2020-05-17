from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer


class UserView(APIView):
    """
    User create, delete, duplicate check
    """
    
    # User create
    def post(self, request, user_name):
        message = ""
        status_code = status.HTTP_400_BAD_REQUEST
        serializer = UserSerializer(data={
            'user_name': user_name,
            'password': request.data['password']})

        try:
            if serializer.is_valid():
                if not User.objects.filter(user_name=user_name).exists():
                    serializer.save()
                    status_code = status.HTTP_200_OK
                else:
                    message = "User exist."
            else:
                message = "Invalid input."

        except Exception as e:
            print("ERROR>> UserView.post",str(e))
        
        return Response({'message': message}, status_code)

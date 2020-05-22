from channels.auth import AuthMiddlewareStack
# from rest_framework.authtoken.models import Token
# from django.contrib.auth.models import AnonymousUser
from api.serializers import VerifyJWTSerializerWithUser
from api.models import User


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        try:
            token = scope['subprotocols'][0]
            serializer = VerifyJWTSerializerWithUser(data={'token':token})            

            if serializer.is_valid():
                scope['validated'] = serializer.validated_data
                

        except Exception as e:
            scope['validated'] = None
            pass

        return self.inner(scope)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
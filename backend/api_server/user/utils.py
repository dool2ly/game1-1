from calendar import timegm
from datetime import datetime
from rest_framework import status
from rest_framework.views import exception_handler
from rest_framework_jwt.settings import api_settings

from .exceptions import UserValidateError


def custom_exception_handler(exc, context):
    """
    Catch API exceptions and customize response
    """
    response = exception_handler(exc, context)

    # check that a UserValidateError exception is raised
    if isinstance(exc, UserValidateError):
        response.data={"errors": exc.get_code_list()}

    return response

def custom_jwt_payload_handler(user):
    """
    Customized djangorestframework-jwt jwt_payload_handler
    """
    username_field = 'username'
    username = user.username

    payload = {
        'user_id': str(user.pk),
        'username': username,
        'exp': datetime.utcnow() + api_settings.JWT_EXPIRATION_DELTA
    }

    # Include original issued at time for a brand new token,
    # to allow token refresh
    if api_settings.JWT_ALLOW_REFRESH:
        payload['orig_iat'] = timegm(
            datetime.utcnow().utctimetuple()
        )

    if api_settings.JWT_AUDIENCE is not None:
        payload['aud'] = api_settings.JWT_AUDIENCE

    if api_settings.JWT_ISSUER is not None:
        payload['iss'] = api_settings.JWT_ISSUER

    return payload
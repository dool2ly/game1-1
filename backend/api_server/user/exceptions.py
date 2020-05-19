from rest_framework import status
from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError


class UserValidateError(ValidationError):
    default_detail = 'User error lists.'

    def get_code_list(self):
        ret_list = []
        codes = self.get_codes()

        if isinstance(codes, dict):
            for k, code in codes.items():
                ret_list += list(map(lambda x: x + '_' + k, code))
        else:
            ret_list = codes

        return ret_list


def custom_exception_handler(exc, context):
    """
    Catch API exceptions and customize response
    """
    response = exception_handler(exc, context)

    # check that a UserValidateError exception is raised
    if isinstance(exc, UserValidateError):
        response.data={"errors": exc.get_code_list()}

    return response
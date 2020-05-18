from django.test import TestCase

from .serializers import UserSerializer

class UserViewInput(TestCase):
    invalid_user_name = ['', '0admin', 'Admin', 'adMin', 'admin01', 'admin02@', '!asdf', 'a!sdf', 'asdf2!!@#', '!@#']
    invalid_password = ['', '123!@#123', '!12345', '12312!']

    def test_invalid_user_name_inputs(self):
        for data in self.invalid_user_name:
            serializer = UserSerializer(data={'user_name': data, 'password': 'password'})
            self.assertIs(serializer.is_valid(), False)

    def test_invalid_password_inputs(self):
        for data in self.invalid_password:
            serializer = UserSerializer(data={'user_name': 'test', 'password': data})
            self.assertIs(serializer.is_valid(), False)
from django.test import TestCase

from .serializers import UserSerializer

class UserViewInput(TestCase):
    invalid_inputs = ['0admin', 'admin01', 'admin02@', '!asdf', 'a!sdf', 'asdf2!!@#', '!@#']

    def test_invalid_inputs(self):
        for data in self.invalid_inputs:
            serializer = UserSerializer(data={'user_name': data, 'password': data})
            self.assertIs(serializer.is_valid(), False)
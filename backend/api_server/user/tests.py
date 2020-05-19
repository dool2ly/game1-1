from django.test import TestCase
from django.urls import reverse

from .serializers import UserSerializer
from .models import User

class UserViewInput(TestCase):
    test_username = 'gooduser'
    test_password = 'goodpass'
    def test_valid_user_signin(self):
        url = reverse('user:user', args=(self.test_username,))
        response = self.client.post(url, {'password': self.test_password})

        self.assertEqual(response.data['success'], True)

        user = User.objects.get(username=self.test_username)

        self.assertEqual(user.username, self.test_username)
        self.assertEqual(user.password, self.test_password)

    def test_duplicated_user_signin(self):
        user = User(username=self.test_username, password=self.test_password)
        user.save()
        url = reverse('user:user', args=(self.test_username,))
        response = self.client.post(url, {'password': self.test_password})

        self.assertIn('errors', response.data)
        self.assertIn('exist_username', response.data['errors'])

    def test_blank_username_signin(self):
        response = self.client.post('user/', {'password':self.test_password})

        self.assertEqual(response.status_code, 404)
    
    def test_contain_admin_username_signin(self):
        usernames = ['admin', 'adMin01', '123admin', 'theAdmin', 'testadmintest']
        for name in usernames:
            url = reverse('user:user', args=(name,))
            response = self.client.post(url, {'password':self.test_password})

            self.assertIn('errors', response.data)
            self.assertIn('invalid_username', response.data['errors'])

    def test_not_plain_username_signin(self):
        usernames = ['test!user', '@user_test', 'test_user', 'usertest!!']
        for name in usernames:
            url = reverse('user:user', args=(name,))
            response = self.client.post(url, {'password':self.test_password})
            
            self.assertIn('errors', response.data)
            self.assertIn('not_plain_username', response.data['errors'])
    
    def test_max_length_username_signin(self):
        url = reverse('user:user', args=('1234567890123456',))
        response = self.client.post(url, {'password':self.test_password})
        
        self.assertIn('errors', response.data)
        self.assertIn('max_length_username', response.data['errors'])
    
    def test_blank_password_signin(self):
        url = reverse('user:user', args=(self.test_username,))
        response = self.client.post(url, {'password':''})

        self.assertIn('errors', response.data)
        self.assertIn('blank_password', response.data['errors'])

    def test_not_plain_password_signin(self):
        passwords = ['test!password', '@user_password', 'test_password', 'passwordtest!!']
        for password in passwords:
            url = reverse('user:user', args=(self.test_username,))
            response = self.client.post(url, {'password':password})
            
            self.assertIn('errors', response.data)
            self.assertIn('not_plain_password', response.data['errors'])
    
    def test_min_length_pasword_signin(self):
        url = reverse('user:user', args=(self.test_username,))
        response = self.client.post(url, {'password':'123'})
        
        self.assertIn('errors', response.data)
        self.assertIn('min_length_password', response.data['errors'])

    def test_duplicate_check(self):
        url = reverse('user:user', args=(self.test_username,))
        response = self.client.get(url)

        self.assertIn('exists', response.data)
        self.assertEquals(response.data['exists'], False)

    def test_duplicated_check(self):
        user = User(username=self.test_username, password=self.test_password)
        user.save()
        url = reverse('user:user', args=(self.test_username,))
        response = self.client.get(url)
        
        self.assertIn('exists', response.data)
        self.assertEquals(response.data['exists'], True)
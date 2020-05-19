from django.urls import path

from . import views


app_name = 'user'
urlpatterns = [
    path('<str:username>', views.UserView.as_view(), name='user'),
    path('<str:username>/login', views.LoginView.as_view(), name='login')
]
from django.urls import path

from . import views


app_name = 'user'
urlpatterns = [
    path('user/<str:username>', views.UserView.as_view(), name='user'),
    path('user/<str:username>/login', views.LoginView.as_view(), name='login')
]
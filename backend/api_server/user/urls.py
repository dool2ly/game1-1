from django.urls import path

from . import views

app_name = 'user'
urlpatterns = [
    path('<str:user_name>', views.UserView.as_view(), name='signup'),
    path('<str:user_name>/login', views.LoginView.as_view(), name='login')
]
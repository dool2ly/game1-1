from django.urls import path

from django.conf.urls import url

from . import views


app_name = 'chat'
urlpatterns = [
    # path('<str:username>', views.UserView.as_view(), name='user'),
    # path('<str:username>/login', views.LoginView.as_view(), name='login')
    url(r'^$', views.index, name='index'),
    url(r'^(?P<room_name>[^/]+)/$', views.room, name='room'),
    
]
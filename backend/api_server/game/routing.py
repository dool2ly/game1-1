from django.urls import path

from . import consumers


websocket_urlpatterns = [
    path('ws/chat/<int:room_number>', consumers.ChatConsumer, name='chat'),
    path('ws/game', consumers.GameConsumer, name='game')
]
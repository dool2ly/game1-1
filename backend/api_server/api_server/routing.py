# from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter

import game.routing
from game.custom_middleware import TokenAuthMiddlewareStack
from game.consumers import GameConsumer

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': TokenAuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns
        )
    ),
    'channel': ChannelNameRouter({
        'game_engine': GameConsumer
    })
})
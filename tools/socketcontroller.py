from abc import ABC, abstractmethod
from .consumers_new import build_error

def register_handler(prefix, handler):
    controller.handlers[prefix] = handler

def register_handlers():
    # register your handlers here
    register_handler("LIVE: connect", ConnectHandler(CONTROLLER))


class ConnectHandler(Handler):
    def handle(self, consumer, data):
        user = consumer.scope["user"]
        if not user.username in self.controller.online_list:
            consumer.broadcast_message("LIVE: join", user.username)
            self.controller.online_list.append(user.username)
        self.controller.connected_users.append(user.username)
        consumer.send_message("LIVE: sync", {
            "current_state": self.controller.state,
            "current_performance": self.controller.current_performance,
            "users": self.online_list
        })
        

class Handler(ABC):
    def __init__(self, controller):
        self.controller = controller
    @abstractmethod
    def handle(self, consumer, data):
        pass

class SocketController:
    def __init__(self):
        self.handlers = {}
        self.state = "LIVE: stop"
        self.performances = []
        self.current_performance = -1
        self.connected_users = []
        self.online_list = []

CONTROLLER = SocketController()
CONTROLLER.register_handlers()
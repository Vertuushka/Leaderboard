from . models import Show, Performance
from . sockethandlersABS import *

def build_error(str):
    return f"[Error]: {str}"

def register_handler(prefix, handler):
    CONTROLLER.handlers[prefix] = handler

def register_handlers():
    # register your handlers here
    register_handler("LIVE: connect", ConnectHandler(CONTROLLER))
    register_handler("LIVE: disconnect", DisconnectHandler(CONTROLLER))
    register_handler("LIVE: start", StartHandler(CONTROLLER))
    register_handler("LIVE: next", NextHandler(CONTROLLER))
    register_handler("LIVE: prev", NextHandler(CONTROLLER))


class ScoreHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        pass

class PreviousHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        if self.controller.current_performance > -1:
            self.controller.current_performance -= 1
            consumer.broadcast_message("LIVE: performance", self.controller.current_performance)

class NextHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        if self.controller.current_performance < len(self.controller.performances) -1:
            self.controller.current_performance += 1
            consumer.broadcast_message("LIVE: performance", self.controller.current_performance)

class StartHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        self.controller.state = "LIVE: start"
        try:
            show = Show.objects.get(id=int(data))
            show_performances = Performance.objects.filter(show=show)
            if not show_performances:
                raise Performance.DoesNotExist()
            self.controller.performances = list(show_performances.values())
        except (Show.DoesNotExist, Performance.DoesNotExist ) as e:
            consumer.send_error(e)
            return
        context = {
            "show": show,
            "performances": list(show_performances.values())
        }
        consumer.broadcast_message("LIVE: start", context)

class DisconnectHandler(Handler):
    def handle(self, consumer, data):
        user = consumer.scope["user"]
        self.controller.connected_users.remove(user.username)
        if not user.username in self.controller.connected_users:
            self.controller.online_list.remove(user.username)
            consumer.broadcast_message("LIVE: leave", user.username)

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

class SocketController:
    def __init__(self):
        self.handlers = {}
        self.state = "LIVE: stop"
        self.performances = []
        self.current_performance = -1
        self.connected_users = []
        self.online_list = []

CONTROLLER = SocketController()
register_handlers()
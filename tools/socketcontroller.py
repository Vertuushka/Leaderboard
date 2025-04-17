from . models import Show, Performance
from channels.db import database_sync_to_async
from . sockethandlersABS import *
from ranking.models import Rank

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
    register_handler("LIVE: score_update", ScoreHandler(CONTROLLER))
    register_handler("LIVE: switch_mode_stop", SwitchModeHandler(CONTROLLER))
    register_handler("LIVE: switch_mode_timer", SwitchModeHandler(CONTROLLER))
    register_handler("LIVE: switch_mode_score", SwitchModeHandler(CONTROLLER))
    register_handler("LIVE: switch_mode_play", SwitchModeHandler(CONTROLLER))
    register_handler("USER: rank", UserScoreHandler(CONTROLLER))


class UserScoreHandler(Handler):
    @database_sync_to_async
    def handle(self, consumer, data):
        try:
            user = consumer.scope["user"]
            performance_id = int(data["performance"])
            new_rank = int(data["rank"])

            performance = Performance.objects.get(id=performance_id)
            Rank.objects.filter(user=user, performance=performance).delete()
            Rank.objects.filter(user=user, rank=new_rank).delete()
            Rank.objects.create(user=user, performance=performance, rank=new_rank)
            context = {
                "user": user.username,
                "performance": performance_id,
                "rank": new_rank
            }
            consumer.broadcast_message("USER: share_score", context)
        except Exception as e:
            consumer.send_error(build_error(e))

class SwitchModeHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        self.controller.state = f"LIVE: mode_{data}"
        consumer.broadcast_message("LIVE: mode", f"LIVE_MODE: {data}")

class ScoreHandler(ProtectedHandler):
    @database_sync_to_async
    def handle_protected(self, consumer, data):
        show = self.controller.show
        if not show:
            consumer.send_error(build_error("no show selected"))
            return
        try:
            performances = Performance.objects.filter(show=show)
            if not performances:
                raise Performance.DoesNotExist()
            for performance in performances:
                performance.points = data[performance.id]
                performance.save()
            performances = Performance.objects.filter(show=show)
            consumer.broadcast_message("LIVE: score", list(performances.values()))
        except Exception as e:
            consumer.send_error(build_error(e))
            return


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
            self.controller.show = show
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
            "users": self.controller.online_list
        })

class SocketController:
    def __init__(self):
        self.handlers = {}
        self.state = "LIVE_MODE: stop"
        self.show = None
        self.performances = []
        self.current_performance = -1
        self.connected_users = []
        self.online_list = []

CONTROLLER = SocketController()
register_handlers()
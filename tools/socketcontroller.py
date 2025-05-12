from . models import Show, Performance
from main.models import GlobalSettings
from channels.db import database_sync_to_async
from . sockethandlersABS import *
from .models import Vote
from django.forms.models import model_to_dict
import json
from asgiref.sync import async_to_sync

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
    register_handler("LIVE: prev", PreviousHandler(CONTROLLER))
    register_handler("LIVE: score_update", ScoreHandler(CONTROLLER))
    register_handler("LIVE: switch_mode_stop", SwitchModeHandler(CONTROLLER))
    register_handler("LIVE: switch_mode_timer", SwitchModeHandler(CONTROLLER))
    register_handler("LIVE: switch_mode_score", SwitchModeHandler(CONTROLLER))
    register_handler("LIVE: switch_mode_play", SwitchModeHandler(CONTROLLER))
    register_handler("USER: rank", UserScoreHandler(CONTROLLER))
    register_handler("LIVE: stop", StopHandler(CONTROLLER))

class StopHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        self.controller.state = "LIVE_MODE: stop"
        self.controller.live = False
        consumer.broadcast_message("LIVE: stop", {})

@database_sync_to_async
def update_rank(user, performance_id, grade, criteria):
    performance = Performance.objects.filter(show=CONTROLLER.show)[performance_id]
    obj = Vote.objects.filter(user=user, performance=performance, criteria=criteria).first()
    if obj:
        obj.grade = grade
        obj.save()
        return
    else: 
        Vote.objects.create(user=user, performance=performance, grade=grade, criteria=criteria)

class UserScoreHandler(Handler):
    def handle(self, consumer, data):
        try:
            user = consumer.scope["user"]
            performance_id = data["performance"]
            grade = data["vote"]
            criteria = data["criteria"]
            async_to_sync(update_rank)(user, performance_id, grade, criteria)
            
            context = {
                "user": user.username,
                "performance": performance_id,
                "criteria": criteria,
                "grade": grade
            }
            consumer.broadcast_message("USER: share_score", context)
        except Exception as e:
            consumer.send_error(build_error(e))

class SwitchModeHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        self.controller.state = f"LIVE: mode_{data}"
        consumer.broadcast_message("LIVE: mode", f"LIVE_MODE: {data}")

class ScoreHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        show = self.controller.show
        if not show:
            return
        try:
            _id = int(data["performance"])
            performance = Performance.objects.get(id=_id)
            if (show.name != "GF"):
                performance.passed = True if data["score"] == "on" else False
                performance.save()  
            else:
                criteria = int(data["criteria"])
                if criteria == 2:
                    performance.jury = int(data["score"])
                    performance.save()
                if criteria == 3:
                    performance.votes = int(data["score"])
                    performance.points = performance.jury + int(data["score"])
                    performance.save()
            msg = {
                "performance": performance.id,
                "passed": performance.passed or False,
                "jury": performance.jury,
                "votes": performance.votes,
                "points": performance.points
            }
            self.controller.current_performance = performance.order - 1
            consumer.broadcast_message("LIVE: performance", self.controller.current_performance)
            consumer.broadcast_message("LIVE: score", msg)
        except Exception as e:
            consumer.send_error(build_error(e))
            return

class NextHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        if self.controller.current_performance < len(self.controller.performances) -1:
            self.controller.current_performance += 1
            consumer.broadcast_message("LIVE: performance", self.controller.current_performance)

class PreviousHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        if self.controller.current_performance > 0:
            self.controller.current_performance -= 1
            consumer.broadcast_message("LIVE: performance", self.controller.current_performance)

class StartHandler(ProtectedHandler):
    def handle_protected(self, consumer, data):
        self.controller.state = "LIVE: start"
        self.controller.live = True
        context = {}
        try:
            show = GlobalSettings.objects.get(id=1).state
            context["show"] = model_to_dict(show)
            self.controller.show = show
            performances = list(Performance.objects.filter(show=show))
            count = len(performances)
            self.controller.performances = performances
            self.controller.current_performance = 0
            _performances = Performance.objects.filter(show=show).order_by('id')
            performances_data = []
            for performance in _performances:
                performances_data.append({
                    "id": performance.id,
                    "passed": performance.passed,
                    "name": performance.participant.name,
                    "song": performance.participant.song,
                    "country": performance.participant.country,
                    "image": performance.participant.img,
                })
            context["performances"] = json.dumps(performances_data)
            context["performancesCount"] = count
            all_votes = Vote.objects.filter(performance__show=self.controller.show)
            if all_votes:
                context["all_votes"] = list(all_votes.values(
                    "performance_id",
                    "criteria",
                    "grade",
                    "user__username",
                ))
        except Exception as e:
            consumer.send_error(e)
            return
        ConnectHandler(CONTROLLER).handle(consumer, data)
        consumer.broadcast_message("LIVE: start", context)

class DisconnectHandler(Handler):
    def handle(self, consumer, data):
        user = consumer.scope["user"]
        if user.username in self.controller.connected_users:
            self.controller.connected_users.remove(user.username)
        if not user.username in self.controller.connected_users and user.username in self.controller.online_list:
            self.controller.online_list.remove(user.username)
            consumer.broadcast_message("LIVE: leave", user.username)

class ConnectHandler(Handler):
    def handle(self, consumer, data):
        user = consumer.scope["user"]
        msg = {
            "user": user.username,
            "current_state": self.controller.state,
            "current_performance": self.controller.current_performance,
            "users": self.controller.online_list,
        }
        if self.controller.show:
            msg["show"] = model_to_dict(self.controller.show)
        try:
            votes = Vote.objects.filter(user=user, performance__show=self.controller.show)
            if votes:
                msg["votes"] = list(votes.values())
        except Exception as e:
            consumer.send_error(build_error(e))
        try: 
            all_votes = Vote.objects.filter(performance__show=self.controller.show).exclude(user=user).select_related("user")
            if all_votes:
                msg["all_votes"] = list(all_votes.values(
                    "performance_id",
                    "criteria",
                    "grade",
                    "user__username",
                ))
        except Exception as e:
            consumer.send_error(build_error(e))
        # if self.controller.live == True:
        consumer.send_message("LIVE: sync", msg)
            
        if not user.username in self.controller.online_list and not user.is_staff:
            consumer.broadcast_message("LIVE: join", user.username)
            self.controller.online_list.append(user.username)
        if not user.is_staff:
            self.controller.connected_users.append(user.username)
        

class SocketController:
    _instance = None
    def __init__(self):
        if SocketController._instance is not None:
            return
        else:
            self.handlers = {}
            self.state = "LIVE_MODE: stop"
            self.live = False
            self.show = None
            self.performances = []
            self.current_performance = 0
            self.connected_users = []
            self.online_list = []
            self._instance = self
    
    def get_instance():
        if SocketController._instance is None:
            SocketController._instance = SocketController()
        return SocketController._instance
    
CONTROLLER = SocketController.get_instance()
register_handlers()

import json
from datetime import datetime
from zoneinfo import ZoneInfo
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from . import models

EU_TZ = ZoneInfo('Europe/Stockholm')

EVENTS = {
    "LIVE: start": {"handler": "handle_start", "args": ["show"], "protected": True},
    "LIVE: next": {"handler": "handle_next", "protected": True},
    "LIVE: prev": {"handler": "handle_prev", "protected": True},
    "LIVE: score_update": {"handler": "handle_score_update", "protected": True},
    "LIVE: switch_mode_stop": {"handler": "handle_switch_mode", "args": ["mode"], "defaults": {"mode": "stop"}, "protected": True},
    "LIVE: switch_mode_timer": {"handler": "handle_switch_mode", "args": ["mode"], "defaults": {"mode": "timer"}, "protected": True},
    "LIVE: switch_mode_score": {"handler": "handle_switch_mode", "args": ["mode"], "defaults": {"mode": "score"}, "protected": True},
    "LIVE: switch_mode_play": {"handler": "handle_switch_mode", "args": ["mode"], "defaults": {"mode": "play"}, "protected": True},

    "USER: vote": {"handler": "handle_vote", "args": ["performance_id", "grade"]},
}

CONNECTED_USERS = []
CONNECTIONS = []

class MessageConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.state = 'LIVE: stop'
        self.performances = []
        self.current_performance = -1


    def send_message(self, prefix, message=""):
        self.send(text_data=json.dumps({
            "prefix": prefix,
            "message": message
        }))

    def send_broadcast(self, data):
        self.send(text_data=json.dumps(data))

    def broadcast_message(self, prefix, message=""):
        async_to_sync(self.channel_layer.group_send)(
        self.room_group_name, {
            "type": "send_broadcast",
            "prefix": prefix,
            "message": message
        })


    def dispatch_action(self, prefix, data):
        config = EVENTS.get(prefix)
        if not config:
            self.send_message('LIVE: error', f'[Error]: unknown event {prefix}')
            return

        if config.get("protected", False) and not self.scope['user'].is_staff:
            self.send_message('LIVE: error', '[Error]: only staff users allowed')
            return

        handler_name = config["handler"]
        handler = getattr(self, handler_name, None)
        if not handler:
            self.send_message('LIVE: error', f'[Error]: handler not found for {prefix}')
            return

        args = []
        for arg in config.get("args", []):
            if arg in data:
                args.append(data[arg])
            elif "defaults" in config and arg in config["defaults"]:
                args.append(config["defaults"][arg])
            else:
                self.send_message('LIVE: error', f'[Error]: missing argument: {arg}')
                return

        handler(*args)
    

    def sync_state_with_user(self):
        self.send_message("LIVE: sync", {
            "current_state": self.state,
            "current_performance": self.current_performance,
            "users": CONNECTED_USERS,
        })
        

    def connect(self):
        user = self.scope['user']

        if not user.is_authenticated:
            self.accept()
            self.send_message('LIVE: error', '[Error]: only authorized users allowed')
            self.close()
            return
        
        self.room_group_name = 'live'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        self.sync_state_with_user()
        if not user.username in CONNECTED_USERS:
            self.broadcast_message('LIVE: join', user.username)
            CONNECTED_USERS.append(user.username)
        CONNECTIONS.append(user.username)


    def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            self.send_message('LIVE: error', '[Error]: invalid JSON')
            return

        prefix = data.get('prefix')
        self.dispatch_action(prefix, data)


    def disconnect(self, close_code):
        user = self.scope['user']
        self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        CONNECTIONS.remove(user.username)
        if not user in CONNECTIONS:
            CONNECTED_USERS.remove(user.username)
            self.broadcast_message('LIVE: leave', user.username)

    def handle_start(self, show_name):
        try:
            show = models.Show.objects.get(name=show_name)
            performances = models.Performance.objects.filter(show=show).order_by('Order')
            self.performances = list(performances.values())
            self.current_performance = -1
            self.broadcast_message("LIVE: start")
        except models.Show.DoesNotExist:
            self.send_message("LIVE: error", "[Error]: show not found")
        except models.Performance.DoesNotExist:
            self.send_message("LIVE: error", "[Error]: performance not found")


    def handle_next(self):
        if self.current_performance < len(self.performances) - 1:
            self.current_performance += 1
            self.broadcast_message('LIVE: next', self.current_performance)


    def handle_prev(self):
        if self.current_performance > -1:
            self.current_performance -= 1
            self.broadcast_message('LIVE: prev', self.current_performance)


    def handle_score_update(self):
        pass


    def handle_switch_mode(self, mode):
        self.state = f'LIVE: {mode}'
        self.broadcast_message(f'LIVE: switch_mode_{mode}')


    
    def handle_vote(self, performance_id, grade):
        user = self.scope['user']
        save = self.save_vote(performance_id, grade)
        if save:
            self.broadcast_message('LIVE: vote', {"user":user.username, "performance":performance_id, "grade":grade})
        

    @database_sync_to_async
    def save_vote(self, performance_id, grade):
        user = self.scope['user']
        try:
            performance = models.Performance.objects.get(id=int(performance_id))
            vote = models.Vote.objects.get(performance=performance, user=user)
            Performance.objects.delete(vote)
            vote = models.Vote.objects.create(performance=performance, user=user, grade=int(grade))
            return True
        except models.Vote.DoesNotExist:
            vote = models.Vote.objects.create(performance=performance, user=user, grade=int(grade))
            return True
        except models.Performance.DoesNotExist:
            self.send_message("LIVE: error", "[Error]: performance not found")
            return False


    

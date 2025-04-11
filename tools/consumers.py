import json
from datetime import datetime
from zoneinfo import ZoneInfo
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from . import models

EU_TZ = ZoneInfo('Europe/Stockholm')

class MessageConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.STATE = 'LIVE: stop'
        self.performances = []
        self.current_performance = -1
        self.handlers = {
            'LIVE: start': self.live_switch_mode_timer,
            'LIVE: stop': self.live_stop,
            'LIVE: next': self.live_next,
            'LIVE: prev': self.live_prev,
            'LIVE: switch_mode_score': self.live_switch_mode_score,
            'LIVE: switch_mode_play': self.live_switch_mode_play,
            'LIVE: switch_mode_timer': self.live_switch_mode_timer,
            'LIVE: score_update': self.live_score_update,
        }
        
    def connect(self):
        user = self.scope['user']
        if not user.is_authenticated:
            self.close()
            return

        self.room_group_name = 'live'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

        handler = self.handlers.get(self.STATE)
        if handler:
            handler()

    def receive(self, text_data):
        if not self.scope['user'].is_staff:
            return
        else:
            data = json.loads(text_data)
            action = data.get('prefix')

            handler = self.handlers.get(action)
            if handler:
                self.STATE = action
                if prefix == "LIVE: start":
                    _show = data.get('show')
                    handler(_show)
                else:
                    handler()

    def disconnect(self, close_code):
        self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        pass

    def send_message(self, prefix, message):
        self.send(text_data=json.dumps({
            "prefix": prefix,
            "message": message
            }))

    def live_switch_mode_timer(self):
        now = datetime.now(EU_TZ)
        target = tz.localize(datetime(2025, 5, 13, 21, 00)) 
        delta = target - now
        self.send_message('LIVE: switch_mode_timer', delta)

    def live_stop(self):
        self.send_message('LIVE: stop', '')

    def live_start(self):
        try:
            show = models.Show.objects.get(name=_show)
            performances = models.Performance.objects.filter(show=show).order_by('Order')
            self.performances = performances.values()
        except models.Show.DoesNotExist:
            send_message('LIVE: error', '[Error]: show not found')
        except models.Performance.DoesNotExist:
            send_message('LIVE: error', f'[Error]: performance data for show {show} is not loaded')
        else:
            self.send_message('LIVE: start')
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from . import models
from .socketcontroller import CONTROLLER as controller

def build_error(str):
    return f"[Error]: {str}"

class Dispatcher:
    def __init__(self, consumer, handlers):
        self.consumer = consumer
        self.handlers = handlers

    def dispatch(self, data):
        prefix = data.get("prefix")
        handler = self.handlers.get(prefix)
        if handler:
            handler.handle(self.consumer, data.message)
        else:
            self.consumer.send_error(f"No handler found for prefix {prefix}")

class MessageConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dispatcher = Dispatcher(self, controller.handlers)

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
    
    def send_error(self, error):
        self.send_message("LIVE: error", build_error(error))

    def connect(self):
        user = self.scope["user"]
        if not user.is_authenticated:
            self.accept()
            self.send_error("only authenticated users allowed")
            self.close()
            return
        self.room_group_name = "live"
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
        data = {"prefix":"LIVE: connect", "message":""}
        self.dispatcher.dispatch(data)

    def receive(self, _data):
        try:
            data = json.loads(_data)
        except json.JSONDecodeError:
            self.send_error("invalid JSON")
            return
        self.dispatcher.dispatch(data)

    def disconnect(self, close_code):
        self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        data = {"prefix":"LIVE: disconnect", "message":""}
        self.dispatcher.dispatch(data)
            
        
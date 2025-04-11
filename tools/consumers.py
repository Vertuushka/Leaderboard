import json
from channels.generic.websocket import WebsocketConsumer

class MessageConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(json.dumps({'message': 'Hello, world!'}))

    def receive(self, text_data):
        pass

    def disconnect(self, close_code):
        pass
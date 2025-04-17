from abc import ABC, abstractmethod
class Handler(ABC):
    def __init__(self, controller):
        self.controller = controller
    @abstractmethod
    def handle(self, consumer, data):
        pass

class ProtectedHandler(ABC):
    def __init__(self, controller):
        self.controller = controller
    
    def handle(self, consumer, data):
        user = consumer.scope["user"]
        if not user.is_staff:
            consumer.send_error("access denied")
        else: 
            self.handle_protected(consumer, data)

    @abstractmethod
    def handle_protected(self, consumer, data):
        pass
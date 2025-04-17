class StartHandler{
    handle(message){
        console.log("Starting show " + message.show + ". Performances: " + message.performances);
    }
}

class PerformanceHandler{
    handle(message){
        console.log("Switching to performance " + message)
    }
}

class SwitchModeHandler {
    handle(message){
        console.log("Switching mode to " + message);
    }
}

class LeaveHandler {
    handle(message) {
        const username = message;
        console.log(username + " left");
    }
}

class JoinHandler {
    handle(message) {
        const username = message;
        console.log(username + " joined");
    }
}

class SyncHandler {
    handle(message){
        const state = message.current_state;
        const performance = message.current_performance;
        const users = message.users;
        console.log(state)
        console.log(performance)
        console.log(users)
    }
}

class ErrorHandler {
    handle(message) {
        console.error(message);
    }
}

export {
    StartHandler,  
    PerformanceHandler, 
    SwitchModeHandler, 
    LeaveHandler,
    JoinHandler,
    SyncHandler,
    ErrorHandler
}
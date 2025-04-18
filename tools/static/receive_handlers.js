import * as controller from './live.js';

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
        const formattedText = `, ${username}`;
        controller.ELEMENTS.online_list.removeText(formattedText);
    }
}

class JoinHandler {
    handle(message) {
        const username = message;
        const formattedText = `, ${username}`;
        controller.ELEMENTS.online_list.addText(formattedText);
    }
}

class SyncHandler {
    handle(message){
        const state = message.current_state;
        const performance = message.current_performance;
        const users = message.users;
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const formattedText = `, ${user}`;
            controller.ELEMENTS.online_list.addText(formattedText); 
        }
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
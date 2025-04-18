import * as controller from './live.js';

export class StartHandler{
    handle(message){
        console.log("Starting show " + message.show + ". Performances: " + message.performances);
    }
}

export class PerformanceHandler{
    handle(message){
        console.log("Switching to performance " + message)
    }
}

export class SwitchModeHandler {
    handle(message){
        console.log("Switching mode to " + message);
    }
}

export class LeaveHandler {
    handle(message) {
        const username = message;
        const formattedText = `, ${username}`;
        controller.ONLINE_LIST.removeUser(username);
        controller.ELEMENTS.online_list.loadFromArray(controller.ONLINE_LIST.users);
    }
}

export class JoinHandler {
    handle(message) {
        const username = message;
        if (username !== controller.LIVE.getUser()) {
            controller.ONLINE_LIST.addUser(username);
            controller.ELEMENTS.online_list.loadFromArray(controller.ONLINE_LIST.users);
        }
    }
}

export class SyncHandler {
    handle(message){
        const state = message.current_state;
        const performance = message.current_performance;
        const users = message.users;
        controller.LIVE.setUser(message.user);
        controller.ONLINE_LIST.users = users;
        controller.ONLINE_LIST.removeUser(controller.LIVE.getUser());
        controller.ELEMENTS.online_list.loadFromArray(controller.ONLINE_LIST.users);
        
        console.log(state)
        console.log(performance)
        console.log(users)
    }
}

export class ErrorHandler {
    handle(message) {
        console.error(message);
    }
}

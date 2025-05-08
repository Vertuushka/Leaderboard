import * as controller from './live.js';
import * as participants from './tools_shared.js'
import { UIUtils } from './UIController.js';
import {data} from './tools_shared.js'

export class StartHandler{
    handle(message){
        controller.LIVE.reset();
        participants.updatePerformances(message.performances); 
        controller.LIVE.setState("LIVE_MODE: start");
        controller.LIVE.setPerformancesCount(message.performancesCount);
        UIUtils.setShowName(message.show.name);
    }
}

export class PerformanceHandler{
    handle(message){
        controller.LIVE.setPerformance(message);
        controller.LIVE.setClientPerformance(message);
        UIUtils.updatePerformanceData();
        // console.log("Switching to performance " + JSON.stringify(participants.data[controller.LIVE.getPerformance()]));
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
        UIUtils.removeOnlineUser(username);
        controller.ONLINE_LIST.removeUser(username);
    }
}

export class JoinHandler {
    handle(message) {
        const username = message;
        if (username !== controller.LIVE.getUser()) {
            controller.ONLINE_LIST.addUser(username);
            UIUtils.addOnlineUser(username);
        }
    }
}

export class SyncHandler {
    handle(message){
        const state = message.current_state;
        controller.LIVE.setState(state);
        const performance = message.current_performance;
        const users = message.users;
        if (users !== undefined) {
            controller.LIVE.setUser(message.user);
            controller.ONLINE_LIST.setUsers(users);
            controller.ONLINE_LIST.removeUser(controller.LIVE.getUser());
            for(let i=0; i<users.length; i++) {
                UIUtils.addOnlineUser(users[i]);
            }
        }
        if (message.show) { UIUtils.setShowName(message.show.name); }
        if (message.votes !== undefined) {
            for (let i=0; i<message.votes.length; i++) {
                const id = message.votes[i].performance_id;
                const index = data.findIndex(performance => performance.id === id);
                if (index !== -1) {
                    if (controller.grades[index] === undefined)
                        controller.grades[index] = {};
                    controller.grades[index][message.votes[i].criteria] = message.votes[i].grade;
                }
            }
        }
        if (performance !== undefined) {
            controller.LIVE.setPerformance(performance);
            controller.LIVE.setClientPerformance(performance);
            UIUtils.updatePerformanceData();
        }
    }
}

export class UserShareScoreHandler {
    handle(message) {
        const username = message.user;
        const performance = message.performance
        const criteria = message.criteria;
        const grade = message.grade;
        console.log(username, performance, criteria, grade)
        // controller.grades[username][performance][criteria] = grade;
        UIUtils.updateGradeInfo(username, performance, criteria, grade);
    }
}

export class ErrorHandler {
    handle(message) {
        console.error(message);
    }
}

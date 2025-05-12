import * as controller from './live.js';
import * as participants from './tools_shared.js';
import { UIUtils } from './UIController.js';
import {data} from './tools_shared.js';

export class StartHandler{
    handle(message){
        controller.LIVE.reset();
        participants.updatePerformances(message.performances); 
        controller.LIVE.setState("LIVE_MODE: start");
        controller.LIVE.setPerformancesCount(message.performancesCount);
        UIUtils.setShowName(message.show.name);
        UIUtils.showLiveButton();
        controller.LIVE.setShowName(message.show.name);
        const users = controller.ONLINE_LIST.getUsers();
        for( let u in users ) {
            UIUtils.addOnlineUser(users[u]);
        }
        if (controller.ELEMENTS.countdown!== undefined) {
            controller.ELEMENTS.countdown.hide();
            controller.ELEMENTS.voting.show();
        }
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
        if (message === "LIVE_MODE: score")
        {
            UIUtils.showScoreBoard();
        }
        // console.log("Switching mode to " + message);
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
        let users = message.users;
        const performance = message.current_performance;
        if (state === "LIVE: start") {
            UIUtils.showLiveButton();
            if (controller.ELEMENTS.countdown!== undefined) {
                controller.ELEMENTS.countdown.hide();
                controller.ELEMENTS.voting.show();
            }
        }
        if (state === "LIVE: stop") {
            UIUtils.hideLiveButton();
            if (controller.ELEMENTS.countdown!== undefined) {
                controller.ELEMENTS.voting.hide();
            }
        }
        controller.LIVE.setState(state);
        if (message.show !== undefined) 
            controller.LIVE.setShowName(message.show.name);
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
        if (message.all_votes !== undefined) {
            for (let i=0; i<message.all_votes.length; i++) {
                const id = message.all_votes[i].performance_id;
                const index = data.findIndex(performance => performance.id === id);
                if (index!== -1)
                    controller.grades.addOnlineGradeData(message.all_votes[i].user__username, index, message.all_votes[i].criteria, message.all_votes[i].grade)
            }
        }
        if (message.user !== undefined) 
            controller.LIVE.setUser(message.user);
        if (users !== undefined) {
            users = users.filter(u => u !== controller.LIVE.getUser());
            controller.ONLINE_LIST.setUsers(users);
            controller.ONLINE_LIST.removeUser(controller.LIVE.getUser());
            for(let i=0; i<users.length; i++) {
                UIUtils.addOnlineUser(users[i]);
            }
        }
        if (performance !== undefined) {
            controller.LIVE.setPerformance(performance);
            controller.LIVE.setClientPerformance(performance);
            UIUtils.updatePerformanceData();
        }
        if (controller.ELEMENTS.C_Live !== undefined) {
            controller.ELEMENTS.C_Live.element.classList.add("live");
        }
        if (controller.LIVE.isLive() === true) {
            UIUtils.showLiveButton();
        }
    }
}

export class StopHandler {
    handle(message) {
        controller.LIVE.reset();
        UIUtils.hideLiveButton();
        UIUtils.clearOnlineBar();
    }
}

export class UserShareScoreHandler {
    handle(message) {
        const username = message.user;
        const performance = message.performance;
        const criteria = message.criteria;
        const grade = message.grade;
        controller.grades.addOnlineGradeData(username, performance, criteria, grade);
        UIUtils.updateGradeInfo(username, performance, criteria, grade);
    }
}

export class ScoreHandler {
    handle(message) {
        console.log(message);
        UIUtils.C_Confetti(message.performance);
    }
}

export class ErrorHandler {
    handle(message) {
        console.error(message);
    }
}

import * as controller from './live.js';
import * as participants from './tools_shared.js'

const SHOW_NAMES = {
    "SF1": "Semi Final 1",
    "SF2": "Semi Final 2",
    "GF": "Grand Final",
}

class UIUtils {
    static setShowName(showName) {
        controller.ELEMENTS.current_show_label.setText(SHOW_NAMES[showName]);
    }

    static updateOnlineList() {
        if (controller.LIVE.isLive() === true)
        controller.ELEMENTS.online_list.loadFromArray(controller.ONLINE_LIST.getUsers());
    }

    static updatePerformanceData() {
        if (controller.ELEMENTS.performance_id !== undefined) 
            controller.ELEMENTS.performance_id.setText(participants.data[controller.LIVE.getPerformance()].id);
        controller.ELEMENTS.song_name.setText(participants.data[controller.LIVE.getPerformance()].song);
        controller.ELEMENTS.country_name.setText(participants.data[controller.LIVE.getPerformance()].country);
        controller.ELEMENTS.artist_name.setText(participants.data[controller.LIVE.getPerformance()].name);
    }
}

export class StartHandler{
    handle(message){
        participants.updatePerformances(message.performances); 
        controller.LIVE.setState("LIVE_MODE: start");
        UIUtils.setShowName(message.show.name);
    }
}

export class PerformanceHandler{
    handle(message){
        controller.LIVE.setPerformance(message);
        UIUtils.updatePerformanceData();
        console.log("Switching to performance " + JSON.stringify(participants.data[controller.LIVE.getPerformance()]));
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
        controller.ONLINE_LIST.removeUser(username);
        UIUtils.updateOnlineList();
    }
}

export class JoinHandler {
    handle(message) {
        const username = message;
        if (username !== controller.LIVE.getUser()) {
            controller.ONLINE_LIST.addUser(username);
            UIUtils.updateOnlineList();
        }
    }
}

export class SyncHandler {
    handle(message){
        const state = message.current_state;
        controller.LIVE.setState(state);
        const performance = message.current_performance;
        if (performance !== undefined) {
            controller.LIVE.setPerformance(performance);
            UIUtils.updatePerformanceData();
        }
        const users = message.users;
        if (users !== undefined) {
            controller.LIVE.setUser(message.user);
            controller.ONLINE_LIST.users = users;
            controller.ONLINE_LIST.removeUser(controller.LIVE.getUser());
            UIUtils.updateOnlineList();
        }
        if (message.show) { UIUtils.setShowName(message.show.name); }
    }
}

export class ErrorHandler {
    handle(message) {
        console.error(message);
    }
}



const ENDPOINT = `ws://${window.location.host}/ws/socket-server/`;
const HANDLERS = {};

function registerHandler(prefix, handler) {
    HANDLERS[prefix] = handler;
}

function registerAllHandlers() {
    // register your handlers here
    registerHandler("LIVE: error", new ErrorHandler());
    registerHandler("LIVE: sync", new SyncHandler());
    registerHandler("LIVE: join", new JoinHandler());
    registerHandler("LIVE: leave", new LeaveHandler());
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

class Dispatcher {
    constructor(handlers) {
        this.handlers = handlers;
    }

    dispatch(data) {
        const handler = this.handlers[data.prefix];
        if (handler) {
            handler.handle(data.message);
        } else {
            console.warn("No handler found for prefix: " + data.prefix);
        }
    }
}

class LiveSocket {
    constructor(url, dispatcher) { 
        this.dispatcher = dispatcher;
        this.socket = new WebSocket(url);

        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            this.dispatcher.dispatch(data);
        }
    }

    send(data) {
        this.socket.send(JSON.stringify(data));
    }
}

function init() {
    registerAllHandlers();
    const DISPATCHER = new Dispatcher(HANDLERS);
    const SOCKET = new LiveSocket(ENDPOINT, DISPATCHER);
}

document.addEventListener("DOMContentLoaded", init)
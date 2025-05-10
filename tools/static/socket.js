import * as receiver from './receive_handlers.js';

const ENDPOINT = `ws://${window.location.host}/ws/socket-server/`;
const HANDLERS = {};

function registerHandler(prefix, handler) {
    HANDLERS[prefix] = handler;
}

function registerAllHandlers() {
    // register your handlers here
    registerHandler("LIVE: error", new receiver.ErrorHandler());
    registerHandler("LIVE: sync", new receiver.SyncHandler());
    registerHandler("LIVE: join", new receiver.JoinHandler());
    registerHandler("LIVE: leave", new receiver.LeaveHandler());
    registerHandler("LIVE: mode", new receiver.SwitchModeHandler());
    registerHandler("LIVE: performance", new receiver.PerformanceHandler());
    registerHandler("LIVE: start", new receiver.StartHandler());
    registerHandler("USER: share_score", new receiver.UserShareScoreHandler());
    registerHandler("LIVE: stop", new receiver.StopHandler());
}

class Dispatcher {
    constructor(handlers) { this.handlers = handlers; }

    dispatch(data) {
        const handler = this.handlers[data.prefix];
        if (handler) { handler.handle(data.message); } 
        else { console.warn("No handler found for prefix: " + data.prefix);}
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
    send(data) { this.socket.send(JSON.stringify(data)); }
}


registerAllHandlers();
const DISPATCHER = new Dispatcher(HANDLERS);
export const SOCKET = new LiveSocket(ENDPOINT, DISPATCHER);
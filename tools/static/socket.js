const ENDPOINT = `ws://${window.location.host}/ws/socket-server/`;
const HANDLERS = {};

function registerHandler(prefix, handler) {
    HANDLERS[prefix] = handler;
}

function registerAllHandlers() {
    // register your handlers here
    registerHandler("LIVE: error", new ErrorHandler())
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
import { SOCKET } from "./socket.js";

export class StartHandler {
    handle(){ SOCKET.send({ "prefix": "LIVE: start", "message": "1" }); }
}

export class NextHandler {
    handle(){ SOCKET.send({ "prefix": "LIVE: next", "message": "1" }); }
}

export class PreviousHandler {
    handle(){ SOCKET.send({ "prefix": "LIVE: prev", "message": "1" }); }
}
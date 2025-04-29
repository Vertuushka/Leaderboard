import { SOCKET } from "./socket.js";

export class StartHandler {
    data = { "prefix": "LIVE: start" }
    handle(){ SOCKET.send({ "prefix": "LIVE: start", "message": "1" }); }
}
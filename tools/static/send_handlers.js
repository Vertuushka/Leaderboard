import { SOCKET } from "./socket.js";
import * as live from "./live.js"

export class StartHandler {
    handle(){ SOCKET.send({ "prefix": "LIVE: start", "message": "1" }); }
}

export class NextHandler {
    handle(){ SOCKET.send({ "prefix": "LIVE: next", "message": "1" }); }
}

export class PreviousHandler {
    handle(){ SOCKET.send({ "prefix": "LIVE: prev", "message": "1" }); }
}


export class VoteHandler {
    handle(){
        const data = {
            "prefix": "USER: rank",
            "message": {
                "performance": live.LIVE.getPerformance(),
                "criteria": parseInt(this.parentElement.dataset.criteria),
                "vote": parseInt(this.textContent.trim())
            }
        }
        SOCKET.send(data);
    }
}
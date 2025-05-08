import { UIUtils } from "./UIController.js";
import { LIVE } from "./live.js";


export class C_HandlePrevious {
    handle() {
        const currentPerf = LIVE.getClientPerformance();
        if (currentPerf > 0) {
            LIVE.setClientPerformance(currentPerf - 1);
            UIUtils.updatePerformanceData("client");
        }
    }
}

export class C_HandleNext {
    handle() {
        const currentPerf = LIVE.getClientPerformance();
        if (currentPerf < LIVE.getPerformancesCount() - 1) {
            LIVE.setClientPerformance(currentPerf + 1);
            UIUtils.updatePerformanceData("client");
        }
    }
}

export class C_HandleLive {
    handle() {
        if (LIVE.isLive()) {
            LIVE.setClientPerformance(LIVE.getPerformance());
            UIUtils.updatePerformanceData();
        }
    }
}
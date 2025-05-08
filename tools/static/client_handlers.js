import { UIUtils } from "./UIController.js";
import { LIVE, ELEMENTS } from "./live.js";


export class C_HandlePrevious {
    handle() {
        const currentPerf = LIVE.getClientPerformance();
        if (currentPerf > 0) {
            LIVE.setClientPerformance(currentPerf - 1);
            UIUtils.updatePerformanceData("client");
            if (LIVE.getPerformance() === LIVE.getClientPerformance())
                ELEMENTS.C_Live.element.classList.add("live");
            else
                ELEMENTS.C_Live.element.classList.remove("live");
        }
    }
}

export class C_HandleNext {
    handle() {
        const currentPerf = LIVE.getClientPerformance();
        if (currentPerf < LIVE.getPerformancesCount() - 1) {
            LIVE.setClientPerformance(currentPerf + 1);
            UIUtils.updatePerformanceData("client");
            if (LIVE.getPerformance() === LIVE.getClientPerformance())
                ELEMENTS.C_Live.element.classList.add("live");
            else
                ELEMENTS.C_Live.element.classList.remove("live");
        }
    }
}

export class C_HandleLive {
    handle() {
        if (LIVE.isLive()) {
            LIVE.setClientPerformance(LIVE.getPerformance());
            UIUtils.updatePerformanceData();
            this.classList.add("live");
        }
    }
}
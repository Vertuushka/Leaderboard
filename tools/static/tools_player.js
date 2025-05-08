import * as tools from "./live.js";
import { setGradeButtonsCount } from "./shared_constants.js";
import { VoteHandler } from "./send_handlers.js";
import * as C_Handlers from "./client_handlers.js";

function RegisterElements() {
    const voteBtns = [...document.querySelectorAll(".voteBtn")];
    setGradeButtonsCount(voteBtns.length);
    let groups = [];
    for (let i = 0; i < voteBtns.length; i += 10) {
        groups.push(voteBtns.slice(i, i + 10));
    }
    voteBtns.forEach((btn, i) => {
        btn.addEventListener("click", () => {
            const block = groups.find(groups => groups.includes(btn))
            block.forEach(btn => {
                btn.classList.remove("active");
                if (tools.grades[tools.LIVE.getClientPerformance()] !== undefined && tools.grades[tools.LIVE.getClientPerformance()].includes(btn)) {
                    const index = tools.grades[tools.LIVE.getClientPerformance()].indexOf(btn);
                    if (index > -1)
                        tools.grades[tools.LIVE.getClientPerformance()].splice(index, 1);
                }
            })
            btn.classList.add("active");
            if (tools.grades[tools.LIVE.getClientPerformance()] === undefined)
                tools.grades[tools.LIVE.getClientPerformance()] = [];
            tools.grades[tools.LIVE.getClientPerformance()].push(btn);
        })
        tools.RegisterElement(btn, tools.ButtonElement, new VoteHandler(), `voteBtn${i}`);
    })
    tools.RegisterElement("C_Previous", tools.ButtonElement, new C_Handlers.C_HandlePrevious());
    tools.RegisterElement("C_Next", tools.ButtonElement, new C_Handlers.C_HandleNext());
    tools.RegisterElement("C_Live", tools.ButtonElement, new C_Handlers.C_HandleLive());
}

function init() {
    RegisterElements();
}

document.addEventListener("DOMContentLoaded", init);
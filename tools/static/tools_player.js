import * as tools from "./live.js";
import { setGradeButtonsCount } from "./shared_constants.js";
import { VoteHandler } from "./send_handlers.js";
import * as C_Handlers from "./client_handlers.js";
import { UIUtils } from "./UIController.js";
import { timer, SHOW_NAMES_REVERSED } from "./shared_constants.js";

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
            })
            btn.classList.add("active");
            
        })
        tools.RegisterElement(btn, tools.ButtonElement, new VoteHandler(), `voteBtn${i}`);
    })
    tools.RegisterElement("C_Previous", tools.ButtonElement, new C_Handlers.C_HandlePrevious());
    tools.RegisterElement("C_Next", tools.ButtonElement, new C_Handlers.C_HandleNext());
    tools.RegisterElement("C_Live", tools.ButtonElement, new C_Handlers.C_HandleLive());
    tools.RegisterElement("countdown", tools.DummyElement);
    tools.RegisterElement("voting", tools.DummyElement);
    tools.RegisterElement("hours", tools.TextElement);
    tools.RegisterElement("minutes", tools.TextElement);
    tools.RegisterElement("seconds", tools.TextElement);

    try {
        tools.RegisterElement("SFVoteContainer", tools.DummyElement);
        tools.RegisterElement("SFVoteHeader", tools.TextElement);
        tools.RegisterElement("SFVoteText", tools.TextElement);
    } catch(e) {
        
    }
}

function init() {
    RegisterElements();
    const showLabel = document.querySelector("#current_show_label");
    const show_code = SHOW_NAMES_REVERSED[showLabel.textContent.trim()];
    tools.ELEMENTS.countdown.show();
    setInterval(() => UIUtils.ShowTimer(timer[show_code]), 1000);
    if (show_code === "GF") {
        tools.RegisterElement("voteCriteria1", tools.DummyElement);
        tools.RegisterElement("voteCriteria2", tools.DummyElement);
        tools.RegisterElement("voteCriteria3", tools.DummyElement);
    }
}

document.addEventListener("DOMContentLoaded", init);
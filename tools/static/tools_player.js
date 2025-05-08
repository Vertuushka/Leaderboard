import * as tools from "./live.js";
import { ELEMENTS } from "./live.js";
import { VoteHandler } from "./send_handlers.js";
import * as C_Handlers from "./client_handlers.js";

function RegisterElements() {
    const voteBtns = [...document.querySelectorAll(".voteBtn")];
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
}

function init() {
    RegisterElements();
}

document.addEventListener("DOMContentLoaded", init);
import * as tools from "./live.js";
import { ELEMENTS } from "./live.js";
import { VoteHandler } from "./send_handlers.js";

function RegisterElements() {
    const voteBtns = document.querySelectorAll(".voteBtn");
    voteBtns.forEach((btn, i) => {
        tools.RegisterElement(btn, tools.ButtonElement, new VoteHandler(), `voteBtn${i}`);
    })
}

function init() {
    RegisterElements();
    console.log(ELEMENTS.voteBtn1)
}

document.addEventListener("DOMContentLoaded", init);
import * as tools from "./live.js";

function RegisterElements() {
    tools.RegisterElement("online_list", "online_list", tools.TextElement);
    tools.RegisterElement("live_start", "live_start", tools.ButtonElement);
}

function init() {
    RegisterElements();
}

document.addEventListener("DOMContentLoaded", init);
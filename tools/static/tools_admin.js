import * as tools from "./live.js";
import * as sender from "./send_handlers.js";

function RegisterElements() {
    tools.RegisterElement("online_list", tools.TextElement);
    tools.RegisterElement("live_start", tools.ButtonElement, new sender.StartHandler);
}

function init() {
    RegisterElements();
}

document.addEventListener("DOMContentLoaded", init);
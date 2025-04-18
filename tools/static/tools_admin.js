import * as tools from "./tools.js";

function RegisterElements() {
    tools.RegisterElement("online_list", "online_list", tools.TextElement);
    tools.RegisterElement("live_start", "live_start", tools.ButtonElement);
}

function init() {
    RegisterElements();
    tools.ELEMENTS.online_list.setText("admin");
}

document.addEventListener("DOMContentLoaded", init);
import * as tools from "./live.js";
import * as sender from "./send_handlers.js";

function RegisterElements() {
    tools.RegisterElement("performance_id", tools.TextElement);

    tools.RegisterElement("live_start", tools.ButtonElement, new sender.StartHandler);
    tools.RegisterElement("live_next", tools.ButtonElement, new sender.NextHandler);
    tools.RegisterElement("live_prev", tools.ButtonElement, new sender.PreviousHandler);
    tools.RegisterElement("admin_controller_label", tools.TextElement);
}

function init() {
    RegisterElements();
}

document.addEventListener("DOMContentLoaded", init);
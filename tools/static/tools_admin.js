import * as tools from "./live.js";
import * as sender from "./send_handlers.js";

function RegisterElements() {
    tools.RegisterElement("performance_id", tools.TextElement);

    tools.RegisterElement("live_start", tools.ButtonElement, new sender.StartHandler);
    tools.RegisterElement("live_next", tools.ButtonElement, new sender.NextHandler);
    tools.RegisterElement("live_prev", tools.ButtonElement, new sender.PreviousHandler);
    tools.RegisterElement("admin_controller_label", tools.TextElement);
    tools.RegisterElement("B_ScoreBoard", tools.ButtonElement, new sender.ScoreBoardModeHandler);
    tools.RegisterElement("scoreBoardMode", tools.DummyElement);
    tools.RegisterElement("live_stop", tools.ButtonElement, new sender.StopHandler);
    tools.RegisterElement("B_ResultRedirect", tools.ButtonElement, new sender.SendResultRedirect);
}

function init() {
    RegisterElements();
    const passingInputs = document.querySelectorAll(".voteResultInput");
    passingInputs.forEach((input, i) => {
        tools.RegisterElement(input, tools.VoteInputElement, new sender.VoteResultHandler, `result_${i}`);
    })
}

document.addEventListener("DOMContentLoaded", init);
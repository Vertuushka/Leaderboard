import * as tools from "./live.js";
import { ELEMENTS } from "./live.js";
import * as constants from "./shared_constants.js";
import { UIUtils } from "./UIController.js";
const data_el = "performances_data";
export let data;

function RegisterElements() {
    tools.RegisterElement("online_list", tools.TextElement);
    tools.RegisterElement("current_show_label", tools.TextElement);
    tools.RegisterElement("song_name", tools.TextElement);
    tools.RegisterElement("country_name", tools.TextElement);
    tools.RegisterElement("artist_name", tools.TextElement);
    tools.RegisterElement("participantImg", tools.BackgroundElement);
    tools.RegisterElement("heartImg", tools.ImageElement);
    tools.RegisterElement("online_list", tools.DummyElement);
}

function updatePerformanceInfo() {
    ELEMENTS.song_name.setText(data[0].song);
    ELEMENTS.country_name.setText(data[0].country);
    ELEMENTS.artist_name.setText(data[0].name);
    ELEMENTS.participantImg.setImg(constants.bg_url + data[0].country + ".jpg");
    ELEMENTS.heartImg.setImg(constants.hearts_url + data[0].country + ".svg");
}

export function updatePerformances(arg) {
    data = JSON.parse(arg.trim());
    updatePerformanceInfo();
}

function init() {
    RegisterElements();
    const el = document.querySelector(`#${data_el}`);
    data = JSON.parse(el.textContent.trim());
    el.remove();
    
    updatePerformanceInfo();
}

document.addEventListener("DOMContentLoaded", init);
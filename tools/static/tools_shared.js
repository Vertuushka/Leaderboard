import * as tools from "./live.js";

const data_el = "performances_data";
export let data;

function RegisterElements() {
    tools.RegisterElement("online_list", tools.TextElement);
    tools.RegisterElement("current_show_label", tools.TextElement);
    tools.RegisterElement("song_name", tools.TextElement);
    tools.RegisterElement("country_name", tools.TextElement);
    tools.RegisterElement("artist_name", tools.TextElement);
}


function init() {
    RegisterElements();
    const el = document.querySelector(`#${data_el}`);
    data = JSON.parse(el.textContent.trim());
    el.remove();
}

document.addEventListener("DOMContentLoaded", init);
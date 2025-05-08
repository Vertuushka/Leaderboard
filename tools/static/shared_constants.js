export const bg_url = "/static/img/";
export const hearts_url = "/static/img/hearts/";
export const SHOW_NAMES = {
    "SF1": "Semi Final 1",
    "SF2": "Semi Final 2",
    "GF": "Grand Final",
}

let onlineListDummy;
export function setOnlineListDummy(el) { onlineListDummy = el;}
export function getOnlineListDummy() { return onlineListDummy; }

let gradeButtonsCount;
export function setGradeButtonsCount(count) { gradeButtonsCount = count; }
export function getGradeButtonsCount() { return gradeButtonsCount; }
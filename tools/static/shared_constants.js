export const bg_url = "/static/img/";
export const hearts_url = "/static/img/hearts/";
export const SHOW_NAMES = {
    "SF1": "Semi Final 1",
    "SF2": "Semi Final 2",
    "GF": "Grand Final",
}

export const grade_semi_final = 2;
export const grade_grand_final = 30;

export const criteria_passed = 1;
export const criteria_music = 2;
export const criteria_stage = 3;
export const criteria_visual = 4;

export const grand_final_criteria = [criteria_music, criteria_stage, criteria_visual]

export const SFVoteHeader = "Will they qualify?";
export const SFVoteText = "Will the song make it to the Grand Final?";
export const SFVoteHeaderQualified = "Automatic Finalist";
export const SFVoteTextQualified = "This song is already qualified to the Grand Final.";

let onlineListDummy;
export function setOnlineListDummy(el) { onlineListDummy = el;}
export function getOnlineListDummy() { return onlineListDummy; }

let gradeButtonsCount;
export function setGradeButtonsCount(count) { gradeButtonsCount = count; }
export function getGradeButtonsCount() { return gradeButtonsCount; }
export const bg_url = "/static/img/";
export const hearts_url = "/static/img/hearts/";
export const SHOW_NAMES = {
    "SF1": "Semi Final 1",
    "SF2": "Semi Final 2",
    "GF": "Grand Final",
}

export const SHOW_NAMES_REVERSED = {
    "Semi Final 1": "SF1",
    "Semi Final 2": "SF2",
    "Grand Final": "GF",
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

export const svgCheck = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#34C759"><path d="m382-339.38 345.54-345.54q8.92-8.93 20.88-9.12 11.96-.19 21.27 9.12 9.31 9.31 9.31 21.38 0 12.08-9.31 21.39l-362.38 363q-10.85 10.84-25.31 10.84-14.46 0-25.31-10.84l-167-167q-8.92-8.93-8.8-21.2.11-12.26 9.42-21.57t21.38-9.31q12.08 0 21.39 9.31L382-339.38Z"/></svg>`;
export const svgCrossMark = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FF3B30"><path d="M480-437.85 277.08-234.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L437.85-480 234.92-682.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69L480-522.15l202.92-202.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08 0 12.38-8.69 21.08L522.15-480l202.93 202.92q8.3 8.31 8.5 20.89.19 12.57-8.5 21.27-8.7 8.69-21.08 8.69-12.38 0-21.08-8.69L480-437.85Z"/></svg>`;

const SF1_Time = new Date("2025-05-13T19:00:00Z").getTime();
const SF2_Time = new Date("May 15 2025 19:00:00Z").getTime();
const GF_Time = new Date("May 17 2025 19:00:00Z").getTime();

export const timer = {
    "SF1": SF1_Time,
    "SF2": SF2_Time,
    "GF": GF_Time,
}
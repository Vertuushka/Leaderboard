import * as constants from './shared_constants.js'
import * as controller from './live.js';
import * as participants from './tools_shared.js'
import * as tools from "./live.js";

function createOnlineListElement(username) {
    const el = document.createElement("div");
    el.classList.add("wrapper", "gapMedium", "playerVote", "onlineListChild");
    el.id = `online_list_user_${username}`;
    /* CHANGE THIS TO GRAND FINAL CHECK */
    el.innerHTML = `
        <p class="username">${username}</p>
        ${controller.LIVE.getShowName() === "GF" ? `
            <p class="grade-criteria-2">0</p>
            <p class="grade-criteria-3">0</p>
            <p class="grade-criteria-4">0</p>` : `
            <p class="grade-criteria-1"></p>                              
            `}        
        `;
    return el;
}

export class UIUtils {
    static setShowName(showName) {
        controller.ELEMENTS.current_show_label.setText(constants.SHOW_NAMES[showName]);
    }

    static updatePerformanceData(source="live") {
        /* performance data - song, name, country, images */
        let key;
        if (source == "live") { key = controller.LIVE.getPerformance(); }
        if (source == "client") { key = controller.LIVE.getClientPerformance(); }
        if (controller.ELEMENTS.performance_id !== undefined) 
            controller.ELEMENTS.performance_id.setText(participants.data[key].id);
        controller.ELEMENTS.song_name.setText(participants.data[key].song);
        controller.ELEMENTS.country_name.setText(participants.data[key].country);
        controller.ELEMENTS.artist_name.setText(participants.data[key].name);
        controller.ELEMENTS.participantImg.setImg(constants.bg_url + participants.data[key].country + ".webp");
        controller.ELEMENTS.heartImg.setImg(constants.hearts_url + participants.data[key].country + ".svg");
        if (controller.LIVE.getShowName() !== "GF") {
            if (controller.ELEMENTS.SFVoteContainer!== undefined && participants.data[key].passed === true) {
                controller.ELEMENTS.SFVoteContainer.element.classList.add("hidden");
                controller.ELEMENTS.SFVoteHeader.setText(constants.SFVoteHeaderQualified);
                controller.ELEMENTS.SFVoteText.setText(constants.SFVoteTextQualified);
            }
            if (controller.ELEMENTS.SFVoteContainer!== undefined && participants.data[key].passed === false) {
                controller.ELEMENTS.SFVoteContainer.element.classList.remove("hidden");
                controller.ELEMENTS.SFVoteHeader.setText(constants.SFVoteHeader);
                controller.ELEMENTS.SFVoteText.setText(constants.SFVoteText);
            }
        }

        /* grades data */
        for (let i = 0; i < constants.getGradeButtonsCount(); i++) {
            if (controller.ELEMENTS[`voteBtn${i}`]!== undefined) {
                controller.ELEMENTS[`voteBtn${i}`].element.classList.remove("active");
            }
        }
        
        const performance = controller.LIVE.getClientPerformance();
        if (controller.ELEMENTS["voteBtn1"] !== undefined) {

            if (controller.grades[performance]!== undefined) {
                if (controller.LIVE.getShowName() === "GF") {
                    for (let i in constants.grand_final_criteria) {
                        let criteria = constants.grand_final_criteria[i];
                        if (controller.grades[performance][criteria]!== undefined) {
                            let grade = controller.grades[performance][criteria];
                            if (controller.grades[performance][criteria] === 10)
                                grade = 9;
                            if (controller.grades[performance][criteria] === 12)
                                grade = 10;
                            controller.ELEMENTS[`voteBtn${grade + 10 * (criteria - 2) - 1}`].element.classList.add("active");
                        }
                    }
                } else {
                    let grade = controller.grades[performance][constants.criteria_passed]
                    controller.ELEMENTS[`voteBtn${grade}`].element.classList.add("active");
                }
            } 
        }
        const users = controller.ONLINE_LIST.getUsers();
        for (let i in users) {
            const username = users[i];
            controller.grades.updateOnlineGradeData(username);
        }

    }

    static addOnlineUser(username) {
        if (controller.LIVE.isLive() === false)
            return; 
        const el = createOnlineListElement(username);
        controller.ELEMENTS.online_list.get().appendChild(el);
        tools.RegisterElement(el.id, tools.UserElement);
        if (controller.ELEMENTS.online_list.isEmpty() === false && controller.ELEMENTS.online_list.element.querySelector("#online_list_dummy")) {
            controller.ELEMENTS.online_list.element.querySelector("#online_list_dummy").remove();
        }
        controller.grades.updateOnlineGradeData(username);
    }

    static removeOnlineUser(username) {
        const el = document.getElementById(`online_list_user_${username}`);
        el.remove();
        if (controller.ELEMENTS.online_list.isEmpty() === true) {
            controller.ELEMENTS.online_list.element.appendChild(constants.getOnlineListDummy());
        }
    }

    static updateGradeInfo(username, performance, criteria, grade) {
        const key = `online_list_user_${username}`
        if (controller.LIVE.getClientPerformance() == performance) {
            if (controller.ELEMENTS[key] !== undefined) {
                controller.ELEMENTS[key].updateGrade(criteria, grade);
            }
        }
    }

    static showScoreBoard() {
        if (controller.ELEMENTS.scoreBoardMode !== undefined) {
            controller.ELEMENTS.scoreBoardMode.element.classList.remove("hidden");
        }
    }

    static showLiveButton() {
        if (controller.ELEMENTS.C_Live !== undefined) {
            controller.ELEMENTS.C_Live.element.classList.remove("hidden");
        }
    }
    static hideLiveButton() {
        if (controller.ELEMENTS.C_Live!== undefined) {
            controller.ELEMENTS.C_Live.element.classList.add("hidden");
        }
    }

    static clearOnlineBar() {
        controller.ELEMENTS.online_list.element.innerHTML = "";
        controller.ELEMENTS.online_list.element.appendChild(constants.getOnlineListDummy());
    }

    static C_Confetti(performanceId) {
        let i = participants.data.findIndex(obj => obj.id === performanceId);
        controller.LIVE.setClientPerformance(i);
        UIUtils.updatePerformanceData("client");
        confetti({
            particleCount: 450,
            spread: 180,
        });
    }

    static ShowTimer(time) {
        if(controller.ELEMENTS.countdown!== undefined) {
            const currentDate = new Date().getTime();
            const distance = time - currentDate;
            const hours = Math.floor(distance / 1000 / 60 / 60);
            const minutes = Math.floor(distance / 1000 / 60) % 60;
            const seconds = Math.floor(distance / 1000) % 60;
            
            controller.ELEMENTS.hours.setText(hours);
            controller.ELEMENTS.minutes.setText(minutes);
            controller.ELEMENTS.seconds.setText(seconds);
        }
    }
    static ScrollToCriteria(caller) {
        if(controller.ELEMENTS.voting !== undefined) {
            if (caller === controller.ELEMENTS.voteCriteria1.element) {
                controller.ELEMENTS.voteCriteria2.element.scrollIntoView({behavior: "smooth", block: "center"})
            }
            if (caller === controller.ELEMENTS.voteCriteria2.element) {
                controller.ELEMENTS.voteCriteria3.element.scrollIntoView({behavior: "smooth", block: "center"})
            }
            if (caller === controller.ELEMENTS.voteCriteria3.element) {
                controller.ELEMENTS.voteCriteria1.element.scrollIntoView({behavior: "smooth", block: "center"})
            }
        }
    }
}
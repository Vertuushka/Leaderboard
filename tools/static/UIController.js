import * as constants from './shared_constants.js'
import * as controller from './live.js';
import * as participants from './tools_shared.js'
import * as tools from "./live.js";

function createOnlineListElement(username) {
    const el = document.createElement("div");
    el.classList.add("wrapper", "gapMedium", "playerVote");
    el.id = `online_list_user_${username}`;
    el.innerHTML = `
        <p class="username">${username}</p>
        <p class="grade-criteria-1"></p>
        <p class="grade-criteria-2"></p>
        <p class="grade-criteria-3"></p>
        <p class="grade-criteria-4"></p>
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
        controller.ELEMENTS.participantImg.setImg(constants.bg_url + participants.data[key].country + ".jpg");
        controller.ELEMENTS.heartImg.setImg(constants.hearts_url + participants.data[key].country + ".svg");
        
        /* grades data */
        for (let i = 0; i < constants.getGradeButtonsCount(); i++) {
            if (controller.ELEMENTS[`voteBtn${i}`]!== undefined) {
                controller.ELEMENTS[`voteBtn${i}`].element.classList.remove("active");
            }
        }

        if (controller.grades[key]!== undefined) {
            for (let i = 0; i < constants.getGradeButtonsCount(); i++) {
                if (controller.grades[key]!== undefined) {
                    controller.grades[key].forEach(btn => {
                        btn.classList.add("active");
                    });
                }
            }
        }

    }

    static addOnlineUser(username) {
        const el = createOnlineListElement(username);
        controller.ELEMENTS.online_list.get().appendChild(el);
        tools.RegisterElement(el.id, tools.UserElement);
        console.log(controller.ELEMENTS.online_list.isEmpty());
        if (controller.ELEMENTS.online_list.isEmpty() === false) {
            controller.ELEMENTS.online_list.element.querySelector("#online_list_dummy").remove();
        }
    }

    static removeOnlineUser(username) {
        console.log(username);
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
}
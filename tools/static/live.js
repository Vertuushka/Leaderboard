import { UIUtils } from "./UIController.js";
import { grand_final_criteria, getGradeButtonsCount, criteria_passed, svgCheck, svgCrossMark } from "./shared_constants.js"

export const ELEMENTS = {};

export function RegisterElement(id, type, handler=null, relativeName=null) {
    let element;
    if (typeof(id) === "object") {
        element = id;
    }
    else{
        element = document.getElementById(id);
    }
    const obj = new type(element, handler);
    if (typeof(id) === "object")
        ELEMENTS[relativeName] = obj;
    else
        ELEMENTS[id] = obj;
}

export class VoteInputElement {
    constructor(element, handler) {
        this.element = element;
        this.performance = this.element.dataset.performance;
        this.criteria = this.element.dataset.criteria;
        this.element.addEventListener("change", handler.handle.bind(this));
    }
}

export class DummyElement {
    constructor(element) { this.element = element; }
    get() { return this.element; }
    isEmpty() { if (this.element.children.length === 0) return true; return false; }
}

export class UserElement {
    constructor(element) {
        this.element = element;
        this.nameElement = this.element.querySelector(".username");
        this.name = this.nameElement.textContent.trim();

        this.criteria = 0;
        this.gc1Element = this.element.querySelector(".grade-criteria-1");
        if (this.gc1Element !== null){
            this.gc1 = this.gc1Element.textContent.trim();
            this.criteria++;
        }
        this.gc2Element = this.element.querySelector(".grade-criteria-2");
        if (this.gc2Element!== null) {
            this.gc2 = this.gc2Element.textContent.trim();
            this.criteria++;
        }
        this.gc3Element = this.element.querySelector(".grade-criteria-3");
        if (this.gc3Element!== null) {
            this.gc3 = this.gc3Element.textContent.trim();
            this.criteria++;
        }
        this.gc4Element = this.element.querySelector(".grade-criteria-4");
        if (this.gc4Element!== null) {
            this.gc4 = this.gc4Element.textContent.trim();
            this.criteria++;
        }
    }

    updateGrade(criteria, grade) {
        if (this[`gc${criteria}Element`] !== null) {
            if (criteria === criteria_passed) {
                this[`gc${criteria}Element`].parentElement.classList.remove("qualified"); 
                this[`gc${criteria}Element`].parentElement.classList.remove("unqualified"); 
                if (grade === 0) 
                    this[`gc${criteria}Element`].parentElement.classList.add("qualified");
                else if (grade === 1) 
                    this[`gc${criteria}Element`].parentElement.classList.add("unqualified");
            } else {
                this[`gc${criteria}Element`].textContent = grade;
                this[`gc${criteria}Element`].style.color = `var(--${grade})`;
            }
        }
    }

}

export class ImageElement {
    constructor(element) {
        this.element = element;
        this.src = this.element.src;
        this.element.classList.add('fadeTransition');
    }
    setImg(src) { 
        this.element.classList.add('fadeOut');

        setTimeout(() => {
            this.element.src = src;
            this.element.classList.remove('fadeOut');
        }, 300);
    }
}

export class BackgroundElement {
    constructor(element) {  
        this.element = element;
        this.src = this.element.style.backgroundImage;
        this.element.classList.add('fadeTransition');
    }
    setImg(src) { 
        this.element.classList.add('fadeOut');

        setTimeout(() => {
            this.element.style.backgroundImage = `url('${src}')`;
            this.element.classList.remove('fadeOut');
        }, 300);
    }
}

export class ButtonElement {
    constructor(element, handler) {
        this.element = element;
        this.text = this.element.textContent;
        this.clickHandler = null;
        this.setClickHandler(handler.handle);
    }
    setText(text) {this.element.textContent = text;}
    setClickHandler(clickHandler) {
        if (this.clickHandler === null) { this.clickHandler = clickHandler; } 
        else {
            this.element.removeEventListener("click", this.clickHandler);
            this.clickHandler = clickHandler;
        }
        this.element.addEventListener("click", this.clickHandler);
    }
}

export class TextElement {
    constructor(element) {
        this.element = element;
        this.text = this.element.textContent;
    }
    setText(text) {
        setTimeout(() => {
            this.element.textContent = text;
        }, 300);
    }
    addText(text) {this.element.textContent += text;}
    clear() {this.element.textContent = "";}
    loadFromArray(array) {
        this.clear();
        for (let i = 0; i < array.length; i++) {
            if (i > 0) { this.addText(", "); }
            const element = array[i]
            this.addText(element);
        }
    }
}

class Live{
    #user = "";
    #performance_id = 0;
    #state = "LIVE_MODE: stop";
    #client_performance = 0;
    #performancesCount = 0;
    #showName = "";
    #page = "LIVE";

    getPage() {return this.#page}
    setPage(page) {this.#page = page}

    getShowName(){return this.#showName}
    setShowName(name){this.#showName = name}

    getUser() {return this.#user;}
    setUser(user) {
        if (this.#user !== "") 
            return;
        this.#user = user;
    }

    getPerformance() {return this.#performance_id;}
    setPerformance(performance_id) {this.#performance_id = performance_id;}

    getPerformancesCount() {return this.#performancesCount;}
    setPerformancesCount(count) {this.#performancesCount = count;}

    getStatus() {return this.#state;}
    setState(state) {this.#state = state;}

    getClientPerformance() { return this.#client_performance;}
    setClientPerformance(performance_id) {this.#client_performance = performance_id;}

    isLive() {
        if (this.#state === "LIVE_MODE: stop") 
            return false;
        return true;
    }

    reset() {
        console.log("Resetting live data");
        this.#performance_id = 0;
        this.#client_performance = 0;
        this.#state = "LIVE_MODE: stop";
        this.#page = "LIVE";
        this.#showName = "";
    }
}

class Live_Grades{
    grades = {};
    onlineGrades = {};
    updateOnlineGradeData(username) {
        const performance = LIVE.getClientPerformance();
        if(this.onlineGrades[username] !== undefined && this.onlineGrades[username][performance] !== undefined) {
            if (LIVE.getShowName() === "GF") {
                for (let i in grand_final_criteria) {
                    UIUtils.updateGradeInfo(username, performance, grand_final_criteria[i], this.onlineGrades[username][performance][grand_final_criteria[i]])
                }
                return;
            } else {
                UIUtils.updateGradeInfo(username, performance, criteria_passed, this.onlineGrades[username][performance][criteria_passed])
            }
        } else {
            if (LIVE.getShowName() === "GF") {
                for (let i in grand_final_criteria) {
                    UIUtils.updateGradeInfo(username, performance, grand_final_criteria[i], "");
                }
            } else {
                UIUtils.updateGradeInfo(username, performance, criteria_passed, "");
            }
        }
    }
    addOnlineGradeData(username, performance, criteria, grade) {
        if (this.onlineGrades[username] === undefined)
            this.onlineGrades[username] = {};
        if (this.onlineGrades[username][performance] === undefined)
            this.onlineGrades[username][performance] = {};
        this.onlineGrades[username][performance][criteria] = grade;
    }
}

class OnlineList {
    #users = [];
    addUser(user) { this.#users.push(user); }
    setUsers(users) { this.#users = users; }
    removeUser(user) { this.#users = this.#users.filter(u => u !== user); }
    getUsers() { return this.#users; }
    getIndex(username) { return this.#users.indexOf(username); }
    isOnline(username) { return this.#users.includes(username); }
}

export const LIVE = new Live();
export const ONLINE_LIST = new OnlineList(LIVE);
export let grades = new Live_Grades();
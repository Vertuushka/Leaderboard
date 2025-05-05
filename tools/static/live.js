export const ELEMENTS = {};

export function RegisterElement(id, type, handler=null) {
    const element = document.getElementById(id);
    const obj = new type(element, handler);
    ELEMENTS[id] = obj;
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
        if (this.clickHandler === null) {
            this.clickHandler = clickHandler;
        } else {
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
    setText(text) {this.element.textContent = text;}
    addText(text) {this.element.textContent += text;}
    clear() {this.element.textContent = "";}
    loadFromArray(array) {
        this.clear();
        for (let i = 0; i < array.length; i++) {
            if (i > 0) {
                this.addText(", ");
            }
            const element = array[i]
            this.addText(element);
        }
    }
}

class Live{
    #user = "";
    #performance_id = 0;
    getUser() {return this.#user;}

    setUser(user) {
        if (this.#user !== "") {
            console.error("User already set.")
            return;
        }
        this.#user = user;
    }

    getPerformance() {return this.#performance_id;}
    setPerformance(performance_id) {this.#performance_id = performance_id;}
}

class OnlineList {
    #users = [];
    addUser(user) { 
        this.#users.push(user); 
    }
    removeUser(user) { this.#users = this.#users.filter(u => u !== user); }
}

export const ONLINE_LIST = new OnlineList();
export const LIVE = new Live();
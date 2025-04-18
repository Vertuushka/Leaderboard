export const ELEMENTS = {};

export function RegisterElements(){

}

export function RegisterElement(name, id, type) {
    const element = document.getElementById(id);
    const obj = new type(element);
    ELEMENTS[name] = obj;
}

export class ButtonElement {
    constructor(element) {
        this.element = element;
        this.text = this.element.innerText;
        this.clickHandler = null;
    }
    setText(text) {this.element.innerText = text;}
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
        this.text = this.element.innerText;
    }
    setText(text) {this.element.innerText = text;}
    addText(text) {this.element.innerText += text;}
    removeText(text) {this.element.innerText = this.element.innerText.replace(text, "");}
    clear() {this.element.innerText = "";}
}
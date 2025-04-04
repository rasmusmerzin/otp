import "./InputElement.css";
import { visibility, visibilityOff } from "../icons";

@tag("app-input")
export class InputElement extends HTMLElement {
  private labelElement: HTMLElement;
  private inputElement: HTMLInputElement;
  private errorElement: HTMLElement;
  private eyeElement: HTMLElement;

  get label(): string {
    return this.labelElement.innerText;
  }
  set label(value: string) {
    this.labelElement.innerText = value;
  }
  get disabled(): boolean {
    return this.inputElement.disabled;
  }
  set disabled(value: boolean) {
    this.inputElement.disabled = value;
    if (value) this.classList.add("disabled");
    else this.classList.remove("disabled");
  }
  get value(): string {
    return this.inputElement.value;
  }
  set value(value: string) {
    this.inputElement.value = value;
    if (value) this.classList.remove("empty");
    else this.classList.add("empty");
  }
  get placeholder(): string {
    return this.inputElement.placeholder;
  }
  set placeholder(value: string) {
    this.inputElement.placeholder = value;
    if (value) this.classList.add("placeholder");
    else this.classList.remove("placeholder");
  }
  #oninput?: (event: Event) => void;
  set oninput(value: (event: Event) => void) {
    this.#oninput = value;
  }
  #onenter?: (event: KeyboardEvent) => void;
  set onenter(value: (event: KeyboardEvent) => void) {
    this.#onenter = value;
  }
  #onescape?: (event: KeyboardEvent) => void;
  set onescape(value: (event: KeyboardEvent) => void) {
    this.#onescape = value;
  }
  get error(): string {
    return this.errorElement.innerText;
  }
  set error(value: string) {
    this.errorElement.innerText = value;
    if (value) this.classList.add("error");
    else this.classList.remove("error");
  }
  #transformer?: (value: string) => string;
  get transformer(): ((value: string) => string) | void {
    return this.#transformer;
  }
  set transformer(value: ((value: string) => string) | void) {
    this.#transformer = value || undefined;
  }

  #type = "";
  get type(): string {
    return this.#type;
  }
  set type(value: string) {
    if (this.#type === value) return;
    this.#type = value;
    this.inputElement.type = value;
    if (value === "password") {
      this.classList.add("password");
      this.append(this.eyeElement);
    } else {
      this.classList.remove("password");
      this.eyeElement.remove();
    }
  }

  constructor() {
    super();
    this.classList.add("empty");
    this.replaceChildren(
      (this.labelElement = createElement("label")),
      (this.inputElement = createElement("input", {
        spellcheck: false,
        oninput: this.onInput.bind(this),
        onfocus: this.onFocus.bind(this),
        onblur: this.onBlur.bind(this),
        onkeydown: this.onKeydown.bind(this),
      })),
      (this.errorElement = createElement("div", { className: "error" }))
    );
    this.eyeElement = createElement("button", {
      tabindex: "-1",
      className: "eye",
      innerHTML: visibility(20),
      onclick: this.onEyeClick.bind(this),
    });
  }

  focus() {
    this.inputElement.focus();
  }
  blur() {
    this.inputElement.blur();
  }

  private onKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (this.#onenter) this.#onenter(event);
    } else if (event.key === "Escape") {
      this.blur();
      if (this.#onescape) this.#onescape(event);
    }
  }
  private onInput(event: Event) {
    if (this.#transformer) {
      const { selectionStart, selectionEnd, value } = this.inputElement;
      const newValue = this.#transformer(value);
      this.inputElement.value = newValue;
      const shift = newValue.length - value.length;
      this.inputElement.setSelectionRange(
        (selectionStart || 0) + shift,
        (selectionEnd || 0) + shift
      );
    }
    if (this.#oninput) this.#oninput(event);
    if (this.inputElement.value) this.classList.remove("empty");
    else this.classList.add("empty");
  }
  private onFocus() {
    this.classList.add("focus");
  }
  private onBlur() {
    this.classList.remove("focus");
  }
  private onEyeClick() {
    if (this.type !== "password") return;
    this.inputElement.type =
      this.inputElement.type === "password" ? "text" : "password";
    this.eyeElement.innerHTML =
      this.inputElement.type === "password"
        ? visibility(20)
        : visibilityOff(20);
  }
}

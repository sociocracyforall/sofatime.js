import html from "./template.html?raw";
/**
 * State shared between all sofatime components, updating any of these
 * properties should cause all components to re-render.
 *
 * Global state is initialized and the custom componented registered at the bottom
 * of this file.
 */

interface GlobalState {
  timezone: string;
  // @TODO  Was this just the same as locale?
  lang: string;
  use24HourDisplay: boolean;
  locale: string;
  dateStyle?: "short" | "medium" | "long" | "full";
  theme?: string;
}

class SofatimeGlobalState {
  private listeners: Function[] = [];
  private state: GlobalState;

  constructor(state: GlobalState) {
    this.state = state;
  }

  guessUsersLocale() {
    this.setState({
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.languages[0],
    });
  }

  setState(state: Partial<GlobalState>) {
    Object.assign(this.state, state);
    this.listeners.map((fn) => fn(this.state));
  }

  getState(): GlobalState {
    return this.state;
  }

  addEventListener(listener: Function) {
    this.listeners.push(listener);
  }

  removeEventListener(listener: Function) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }
}

/**
 * Custom web component for individual sofatime elements.
 */
class Sofatime extends HTMLElement {
  shadow?: ShadowRoot;
  constructor() {
    super();
  }
  /**
   * Called when watched data attribute is changed, including on initial load
   * before connectedCallback runs.
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.shadow) {
      this.render(globalState.getState());
    }
  }
  /** What dataset attributes are watched for attributeChangedCallback */
  static get observedAttributes() {
    return [
      "data-start",
      "data-end",
      "data-display-24h-toggle",
    ];
  }

  /**
   * Invoked when the custom element is first connected to the document's DOM.
   * shadow cannot be attached before this is run.
   */
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = html;
    this.render(globalState.getState());
    globalState.addEventListener(this.render);
  }

  /**
   * Arrow notation so that `this` is retained when passed to addEventListener
   */
  render = (state: GlobalState) => {
    if (!this.shadow) throw "ERR: Shadow never attached to component";
    const { display24toggle } = this.dataset;

    const start = new Date(this.dataset.start ?? "Invalid Date");
    const end = new Date(this.dataset.end ?? "Invalid Date");

    this.displayTime("startLocaleString", Sofatime.getLocaleString(start, state));
    this.displayTime("startLocaleTimeString", Sofatime.getLocaleTimeString(start, state));
    this.displayTime("startLocaleDateString", Sofatime.getLocaleDateString(start, state));

    this.displayTime("endLocaleString", Sofatime.getLocaleString(end, state));
    this.displayTime("endLocaleTimeString", Sofatime.getLocaleTimeString(end, state));
    this.displayTime("endLocaleDateString", Sofatime.getLocaleDateString(end, state));

    /** */

    return;
  };

  /** */
  displayTime(id: string, value: string) {
    const el = this.shadow?.getElementById(id);
    if (el) {
      if (value == "Invalid Date") {
        el.innerHTML = '';
      } else {
        el.innerHTML = value;
      }
    }
    /*
    const container = this.shadow?.getElementById(containerId);
    const time = this.shadow?.getElementById(containerId + "Time");
    if (container && time) {
      time.innerHTML = value;
      if (!value) container.style.display = "none";
      else container.style.display = "block";
    }
   */
  }

  static getLocaleString(date: Date, options: GlobalState): string {
    if (date.toString() === "Invalid Date") return "Invalid Date";
    return date.toLocaleString(options.locale, {
      timeZone: options.timezone,
      dateStyle: options.dateStyle,
    });
  }

  static getLocaleDateString(date: Date, options: GlobalState): string {
    if (date.toString() === "Invalid Date") return "Invalid Date";
    return date.toLocaleDateString(options.locale, {
      timeZone: options.timezone,
      dateStyle: options.dateStyle,
    });
  }

  static getLocaleTimeString(date: Date, options: GlobalState): string {
    if (date.toString() === "Invalid Date") return "Invalid Date";
    return date.toLocaleTimeString(options.locale, {
      timeZone: options.timezone,
    });
  }

  disconnectedCallback() {
    globalState.removeEventListener(this.render);
  }
}
const globalState = new SofatimeGlobalState({
  timezone: "UTC",
  lang: "",
  use24HourDisplay: false,
  locale: "en-GB",
  dateStyle: "medium",
});
globalState.guessUsersLocale();
customElements.define("sofa-time", Sofatime);
window.sofatime = globalState;

/*
const event = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
["en-GB", "en-US", "ko-KR", "es-MX"].forEach((locale) =>
  ["full", "long", "medium", "short"].forEach((dateStyle) => {
    console.log(locale, dateStyle);
    console.log(event.toLocaleString(locale, { timeZone: "UTC", dateStyle: dateStyle }));
    console.log("");
  })
);
*/

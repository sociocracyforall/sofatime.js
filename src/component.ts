import html from "./template.html?raw";

/**
 * State shared between all sofatime components, updating any of these
 * properties should cause all components to re-render.
 */
interface GlobalState {
  timezone: string;
  lang: string;
  use24HourDisplay: boolean;
}
class SofatimeGlobalState {
  private listeners: Function[] = [];
  private state: GlobalState;

  constructor(state: GlobalState) {
    this.state = state;
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
      //this.shadow.innerHTML = Sofatime.generateHTML(this.dataset);
      this.render(globalState.getState());
    }
  }
  /** What dataset attributes are watched for attributeChangedCallback */
  static get observedAttributes() {
    return [
      "data-sofatime",
      "data-format",
      "data-display-24h-toggle",
      "data-display-select",
      "data-display-time",
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
    const el = this.shadow.getElementById("global");
    if (el) {
      el.innerHTML = `
      <div>
        Global<br/>
        ${JSON.stringify(state, null, 2).replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;")}
      </div>
      `;
    }

    const local = this.shadow.getElementById("local");
    if (local) {
      local.innerHTML = JSON.stringify(this.dataset, null, 2).replace(/ /g, "&nbsp;").replace(
        /\n/g,
        "<br/>",
      );
    }
  };

  disconnectedCallback() {
    globalState.removeEventListener(this.render);
  }
}

const globalState = new SofatimeGlobalState({
  timezone: "",
  lang: "",
  use24HourDisplay: false,
});
customElements.define("sofa-time", Sofatime);
console.log(globalState);

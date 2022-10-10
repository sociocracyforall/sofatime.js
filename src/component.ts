const style = `
div {
  font-family: monospace;
  font-size: 16px;
  font-weight: bolder;
}
.container {
  margin: 10px;
  border-radius: 3px;
  display: inline-block;
  padding: 5px;
  width: auto;
  border: 2px solid #AAA;
  background-color: #CCC;
}
.globalState {
  margin-bottom: 5px;
  display: block;
  width: auto;
  background-color: #DFD;
  border: 1px solid #090;
}
.localState {
  display: block;
  background-color: #FDD;
  border: 1px solid #900;
}
`

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

  getState() : GlobalState {
    return this.state
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
      this.shadow.innerHTML = Sofatime.generateHTML(this.dataset);
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
    this.shadow.innerHTML = Sofatime.generateHTML(this.dataset);
    this.render(globalState.getState());
    globalState.addEventListener(this.render);
  }

  /**
   * Arrow notation so that `this` is retained when passed to addEventListener
   */
  render = (state : GlobalState) => {
    if(!this.shadow) throw "ERR: Shadow never attached to component"
    const el = this.shadow.getElementById("global");
    if (el) {
      el.innerHTML = `
      <div>
        Global<br/>
        ${JSON.stringify(state, null, 2).replace(/\n/g, "<br/>").replace(/\s/g, "&nbsp;")}
      </div>
      `
    }
  }

  disconnectedCallback() {
    globalState.removeEventListener(this.render);
  }

  static generateHTML(dataset: DOMStringMap): string {
    let html = `
     <style>${style}</style>
    <div class="container">
      <div id="global" class = "globalState"></div>
      <div class = "localState">
        Local<br/>
        ${JSON.stringify(dataset, null, 2).replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>")}
      </div>
     </div>
     `
    return html;
  }
}

const globalState = new SofatimeGlobalState({
  timezone: "",
  lang: "",
  use24HourDisplay: false,
});
customElements.define("sofa-time", Sofatime);
console.log(globalState)

// Define a template
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  <style>
    :host{
        user-select: none;
    }
  </style>
  <header class="hero is-small is-primary is-bold">
    <div class="hero-body">
      <div class="container">
        <h1 class="title"><slot name="my-title"></slot></h1>
        <h2 class="subtitle"><slot name="my-subtitle"></slot></h2>
      </div>
    </div>
  </header>
`;

// Class for AppHeader Component
class AppHeaderSlots2 extends HTMLElement
{
    // Constructor
    constructor()
    {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
} 

// Define the element
customElements.define('app-header-slots-2', AppHeaderSlots2);
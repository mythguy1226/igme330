// Define a template
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  <style>
    :host{
        user-select: none;
    }
  </style>
  <header class="hero is-large is-dark p-2">
    <h1 class="title">Marvel Character Searcher</h1>
    <h2 class="subtitle">Your go-to page to explore the marvel universe!</h2>
  </header>
`;

// Class for AppHeader Component
class MarvelHeader extends HTMLElement
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
customElements.define('marvel-header', MarvelHeader);
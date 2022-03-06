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
    <h1 class="title"></h1>
    <h2 class="subtitle">Game Designer/Developer</h2>
  </header>
`;

// Class for AppHeader Component
class PortfolioHeader extends HTMLElement
{
    // Constructor
    constructor()
    {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // Event Handler
    connectedCallback()
    {
      this.render();
    }

    // Method for rendering the instance
    render()
    {
      const title = this.dataset.title ? this.dataset.title : "No Title Given";
      this.shadowRoot.querySelector("h1").innerHTML = `${title}`;
    }

    // Watches attribute changes and returns them
    static get observedAttributes()
    {
      return ["data-title"];
    }

    // Method for handling attribute changes
    attributeChangedCallback(attributeName, oldVal, newVal) 
    {
      //console.log(attributeName,oldVal,newVal);
      this.render();
    }
} 

// Define the element
customElements.define('portfolio-header', PortfolioHeader);
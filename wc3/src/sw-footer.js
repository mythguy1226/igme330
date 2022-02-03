// Create a template for the footer
const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host
    {
      user-select: none;
    }

    footer
    {
    color: white;
    background-color: black;
    padding: .5rem;
    margin-top: .5rem;
    }

  </style>
  <footer>
    <p></p>
  </footer>
`;

// Footer class
class SWFooter extends HTMLElement{
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
    const title = this.dataset.title ? this.dataset.title : "No Name";
    const year = this.dataset.year ? this.dataset.year : "?";
    this.shadowRoot.querySelector("p").innerHTML = `&copy; ${year} ${title}`;
  }

  // Watches attribute changes and returns them
  static get observedAttributes()
  {
    return ["data-title", "data-year"];
  }

  // Method for handling attribute changes
  attributeChangedCallback(attributeName, oldVal, newVal) 
  {
    console.log(attributeName,oldVal,newVal);
    this.render();
  }
} 

customElements.define('sw-footer', SWFooter);
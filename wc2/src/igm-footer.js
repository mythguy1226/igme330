// Create a template
const template = document.createElement("template");
template.innerHTML = `
    <style>
    :host {
        display: block;
        background-color: #ddd;
    }
    span {
        color: #F76902;
        display: block;
        font-variant: small-caps;
        font-weight: bolder;
        font-family: sans-serif;
        user-select: none;
    }
    hr {
        border: 3px solid red;
    }
    </style>
    <span id="org"></span>
    <hr>
`;


// Class for IGMFooter component
class IGMFooter extends HTMLElement{

    // Footer Constructor
    constructor(){
      super();
      this.attachShadow({mode: "open"});

      this.shadowRoot.appendChild(template.content.cloneNode(true));

      // Default Values
      if(!this.dataset.year) this.dataset.year = 1989;
      if(!this.dataset.text) this.dataset.text = "Bill & Ted";
      if(!this.dataset.count) this.dataset.count = 0;

      // This line of code will create an property named `span` for us, so that we don't have to keep calling this.shadowRoot.querySelector("span");
      this.span = this.shadowRoot.querySelector("span");

      // remove the footer once the header is clicked
      this.shadowRoot.querySelector("hr").onclick = () => {
        this.remove();
        }
    }

    // Callback function
    connectedCallback(){
        // Increase year and count upon clicking
        this.span.onclick = () => {
            // Increment values
            let year = +this.dataset.year + 1;
            let count = +this.dataset.count + 1;
            
            // Set values
            this.dataset.year = year;
            this.dataset.count = count;
          };

        // Render the changes
        this.render();
    }

    // Updates the DOM based on variable changes
    render(){
        const year = this.getAttribute('data-year') ? this.getAttribute('data-year') : "1995";
        const text = this.getAttribute('data-text') ? this.getAttribute('data-text') : "Nobody";
        const count = this.getAttribute('data-count') ? this.getAttribute('data-count') : "0";

        this.shadowRoot.querySelector("span").innerHTML = `&copy; Copyright ${year}, ${text}, Count: ${count}`;
    }

    // Callback once attributes are changed
    attributeChangedCallback(attributeName, oldVal, newVal){
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    // Get observed attributes
    static get observedAttributes(){
        return ["data-year", "data-text", "data-count"];
      }

    // Callback function called once element is removed from the DOM
    disconnectedCallback(){
    this.span.onclick = null;
    }
  } 
	
  customElements.define('igm-footer', IGMFooter);
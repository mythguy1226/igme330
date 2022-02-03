const template = document.createElement("template");
template.innerHTML = `
    <style>
      div
      {
        height: 340px;
        width: 170px;
        border: 1px solid gray;
        padding: .5rem;
        background-color: #f4f4f4;
        overflow: scroll;
        font-size: .7rem;
        position: relative;
      }
      
      h2
      {
        font-size: 1.1rem;
        font-family: SfDistantGalaxy, sans-serif;
        letter-spacing: .67px;
        line-height: 1.2;
        margin-top: 0;
      }
      
      button
      {
        border-radius: 1px;
        padding: 2px;
        position: absolute;
        top: 1px;
        right: 1px;
        opacity: 0.2;
      }

      button:hover
      {
          opacity: 1;
      }

      img
      {
        width: 100px;
      }

    </style>
    <div>
        <h2></h2>
        <button>X</button>
        <img alt="mugshot">
        <p id="swc-height">Height: </p>
        <p id="swc-mass">Mass: </p>
        <p id="swc-species">Species: </p>
        <p>Affiliations:</p>
        <ul></ul>
    </div>
  `;

  class SWCard extends HTMLElement{
    // Constructor
    constructor()
    {
        super();

        // Attach a shadow DOM tree to the instance
        this.attachShadow({mode: "open"});

        // Clone template and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Get elements from shadow root
        this.h2 = this.shadowRoot.querySelector("h2");
        this.image = this.shadowRoot.querySelector("img");
        this.p1 = this.shadowRoot.querySelector("#swc-height");
        this.p2 = this.shadowRoot.querySelector("#swc-mass");
        this.p3 = this.shadowRoot.querySelector("#swc-species");
        this.ul = this.shadowRoot.querySelector("ul");
        this.button = this.shadowRoot.querySelector("button");
    }

    // Event handler method
    connectedCallback()
    {
        // Click Event Handler
        this.button.onclick = () => this.remove();

        // Render element
        this.render();
    }

    // Clean up method
    disconnectedCallback()
    {
        this.button.onclick = null;
    }

    // Method for handling attribute changes
    attributeChangedCallback(attributeName, oldVal, newVal)
    {
        console.log(attributeName,oldVal,newVal);
        this.render();
    }

    // Watches attribute changes and returns them
    static get observedAttributes()
    {
        return ["data-name", "data-height", "data-mass", "data-image", "data-species", "data-affiliations"];
    }


    // Method for rendering content on the screen
    render()
    {
        // Get the different attributes
        const name = this.getAttribute('data-name') ? this.getAttribute('data-name') : "<i>...character name...</i>";
        const height = this.getAttribute('data-height') ? this.getAttribute('data-height') : "0";
        const mass = this.getAttribute('data-mass') ? this.getAttribute('data-mass') : "0";
        const imageUrl = this.getAttribute('data-image') ? this.getAttribute('data-image') : "images/catimage-no-image.png";
        const species = this.getAttribute('data-species') ? this.getAttribute('data-species') : "Unknown";
        const affiliations = this.getAttribute('data-affiliations') ? this.getAttribute('data-affiliations') : "None";
        let arr = affiliations.split(",");

        // Update different stats
        this.h2.innerHTML = `${name}`;
        this.p1.innerHTML = `Height: ${height}`;
        this.p2.innerHTML = `Mass: ${mass}`;
        this.p3.innerHTML = `Species: ${species}`;

        // Iterate through the array of affiliations
        let aHtml = ``;
        for(let affiliation of arr)
        {
            aHtml += `<li>${affiliation}</li>`;
        }

        // Update list with affiliations
        this.ul.innerHTML = aHtml;

        // Update image
        this.image.src = imageUrl;
    }
}

customElements.define('sw-card', SWCard);
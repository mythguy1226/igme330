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
        letter-spacing: .67px;
        line-height: 1.2;
        margin-top: 0;
        color: #000;
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

      p
      {
        color: #000;
      }

      ul
      {
        color: #000;
      }

    </style>
    <div>
        <h2></h2>
        <button>X</button>
        <img alt="char-image">
        <p id="mc-description">Description: </p>
        <p>Comics: </p>
        <ul id="mc-comics"></ul>
        <p>Events: </p>
        <ul id="mc-events"></ul>
    </div>
  `;

  class MarvelCard extends HTMLElement{
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
        this.p1 = this.shadowRoot.querySelector("#mc-description");
        this.ul1 = this.shadowRoot.querySelector("#mc-comics");
        this.ul2 = this.shadowRoot.querySelector("#mc-events");
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
        return ["data-name", "data-description", "data-comics", "data-image", "data-events"];
    }


    // Method for rendering content on the screen
    render()
    {
        // Get the different attributes
        const name = this.getAttribute('data-name') ? this.getAttribute('data-name') : "<i>...character name...</i>";
        const description = this.getAttribute('data-description') ? this.getAttribute('data-description') : "<i>...character description...</i>";
        const imageUrl = this.getAttribute('data-image') ? this.getAttribute('data-image') : "images/catimage-no-image.png";
        const comics = this.getAttribute('data-comics') ? this.getAttribute('data-comics') : "None";
        const events = this.getAttribute('data-events') ? this.getAttribute('data-events') : "None";

        // Init data arrays
        let comicsArr = comics.split(",");
        let eventsArr = events.split(",");

        // Update different stats
        this.h2.innerHTML = `${name}`;
        this.p1.innerHTML = `Description: ${description}`;

        // Iterate through the data arrays
        let cHtml = ``;
        for(let comic of comicsArr)
        {
            cHtml += `<li>${comic}</li>`;
        }

        let eHtml = ``;
        for(let event of eventsArr)
        {
            eHtml += `<li>${event}</li>`
        }

        // Update lists with proper data
        this.ul1.innerHTML = cHtml;
        this.ul2.innerHTML = eHtml;

        // Update image
        this.image.src = imageUrl;
    }
}

customElements.define('marvel-card', MarvelCard);
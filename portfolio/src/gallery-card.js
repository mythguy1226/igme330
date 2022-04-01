const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
    <style>
      .card
      {
        margin: 2rem;
        max-width: 40rem;
      }
      .content
      {
        overflow: scroll;
        max-height: 10rem;
      }
      p
      {
        color: #000;
      }
      .button
      {
        background-color: #000;
        color: #fff;
      }
      .button:hover
      {
        background-color: #fff;
        color: #000;
      }

    </style>
    <div class="card">
      <div class="card-header">
        <button id="title" class="title is-2 button container"></button>
      </div>
      <div class="card-image">
        <figure class="image is-4by3">
          <img alt="char-image">
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p id="description" class="subtitle is-6">Description: </p>
          </div>
        </div>
        <div class="content">
            <p class="has-text-weight-bold">What I did: </p>
            <p id="contributions"></p>
            <p class="has-text-weight-bold">Technology Used: </p>
            <p id="technology-used"></p>
            <p class="has-text-weight-bold">What I learned: </p>
            <p id="learned"></p>
            <p class="has-text-weight-bold">Challenges Overcame: </p>
            <p id="challenges"></p>
        </div>
      </div>
    </div>
  `;

  class GalleryCard extends HTMLElement{
    // Constructor
    constructor()
    {
        super();

        // Attach a shadow DOM tree to the instance
        this.attachShadow({mode: "open"});

        // Clone template and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Get elements from shadow root
        this.h2 = this.shadowRoot.querySelector("#title");
        this.image = this.shadowRoot.querySelector("img");
        this.description = this.shadowRoot.querySelector("#description");
        this.p1 = this.shadowRoot.querySelector("#contributions");
        this.p2 = this.shadowRoot.querySelector("#technology-used");
        this.p3 = this.shadowRoot.querySelector("#learned");
        this.p4 = this.shadowRoot.querySelector("#challenges");
    }

    // Event handler method
    connectedCallback()
    {
        // Render element
        this.render();
    }

    // Clean up method
    disconnectedCallback()
    {

    }

    // Method for handling attribute changes
    attributeChangedCallback(attributeName, oldVal, newVal)
    {
        //console.log(attributeName,oldVal,newVal);
        this.render();
    }

    // Watches attribute changes and returns them
    static get observedAttributes()
    {
        return ["data-title", "data-description", "data-image", "data-contributions", "data-technology", "data-learned", "data-challenges"];
    }


    // Method for rendering content on the screen
    render()
    {
        // Get the different attributes
        const name = this.getAttribute('data-title') ? this.getAttribute('data-title') : "<i>No Title</i>";
        const description = this.getAttribute('data-description') ? this.getAttribute('data-description') : "<i>No Description</i>";
        const imageUrl = this.getAttribute('data-image') ? this.getAttribute('data-image') : "images/gameIcon.jpg";
        const contributions = this.getAttribute('data-contributions') ? this.getAttribute('data-contributions') : "None";
        const technology = this.getAttribute('data-technology') ? this.getAttribute('data-technology') : "None";
        const learned = this.getAttribute('data-learned') ? this.getAttribute('data-learned') : "None";
        const challenges = this.getAttribute('data-challenges') ? this.getAttribute('data-challenges') : "None";

        // Update card info
        this.h2.innerHTML = name;
        this.description.innerHTML = `<b>Description:</b> ${description}`;
        this.p1.innerHTML = `${contributions}`;
        this.p2.innerHTML = `${technology}`;
        this.p3.innerHTML = `${learned}`;
        this.p4.innerHTML = `${challenges}`;

        // Update image
        this.image.src = imageUrl;
    }
}

customElements.define('gallery-card', GalleryCard);
// Import favorites file to be used for onclick events
import * as favorites from "./favorites.js";

// Template for Marvel-Card Web Component
const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
    <style>
      .card
      {
        margin: 2rem;
        max-width: 20rem;
        /*min-width: 40rem;*/
      }
      .content
      {
        overflow: scroll;
        max-height: 10rem;
      }
      button
      {
        margin: 10px 10px;
      }
      .class
      {
        margin: 10px 10px;
      }

      p
      {
        color: #000;
      }

      ul
      {
        color: #000;
      }

      .likes
      {
        margin-top: 1rem;
        margin-left: 5rem;
      }

    </style>
    <div class="card">
      <div class="card-header">
        <button class="button is-warning favorite">Favorite</button>
        <button class="button is-danger delete-button">X</button>
      </div>
      <div class="card-image">
        <figure class="image is-4by3">
          <img alt="char-image">
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <h2 class="title is-4"></h2>
            <p id="mc-description" class="subtitle is-6">Description: </p>
          </div>
        </div>
        <div class="content">
            <p>Comics: </p>
            <ul id="mc-comics"></ul>
            <p>Events: </p>
            <ul id="mc-events"></ul>
        </div>
      </div>
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
        this.favorite = this.shadowRoot.querySelector(".favorite");
        this.delete = this.shadowRoot.querySelector(".delete-button");
    }

    // Event handler method
    connectedCallback()
    {
        // Click Event Handler
        this.delete.onclick = () => {
          favorites.deleteFavorite(this.h2.textContent);
          const clearButton = document.querySelector("#clear-favorites");
          if(clearButton != null)
          {
            this.remove();
          }
        }
        this.favorite.onclick = () => {
          // Add if not default
          if(this.dataset.name != null)
          {
            this.favorite.disabled = true;
            this.favorite.textContent = "Favorited!";
            favorites.addFavorite(this.favorite);
          }
          else // Fail gracefully and notify user that you can't save default 
          {
            this.favorite.classList.remove("is-warning");
            this.favorite.classList.add("is-danger");
            this.favorite.innerHTML = "Can't save empy slot!"
          }
        }

        // Render element
        this.render();
    }

    // Clean up method
    disconnectedCallback()
    {
        this.favorite.onclick = null;
        this.delete.onclick = null;
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
        return ["data-name", "data-description", "data-comics", "data-image", "data-events"];
    }


    // Method for rendering content on the screen
    render()
    {
        // Get the different attributes
        const name = this.getAttribute('data-name') ? this.getAttribute('data-name') : "<i>Empty Character Slot</i>";
        const description = this.getAttribute('data-description') ? this.getAttribute('data-description') : "<i>No Description</i>";
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

        // Check if in favorites already
        if(favorites.checkInFavorites(this.h2.textContent))
        {
          this.favorite.disabled = true;
          this.favorite.textContent = "Favorited!";
          favorites.addFavorite();
        }

        // Check if a community favorite
        if(this.dataset.community != null)
        {
          // Remove all unrequired buttons from the list
          let buttons = this.shadowRoot.querySelectorAll("button");
          this.shadowRoot.querySelector(".card-header").removeChild(buttons[1]); // Remove Delete Button

          // Get the likes from the dataset
          const likes = this.getAttribute('data-likes') ? this.getAttribute('data-likes') : 0;

          // Create the counter element
          let counter = document.createElement("h2");
          counter.classList.add("title");
          counter.classList.add("is-light");
          counter.classList.add("is-4");
          counter.classList.add("likes");
          counter.innerHTML = `Likes: ${likes}`;
          this.shadowRoot.querySelector(".card-header").appendChild(counter);
        }
    }
}

customElements.define('marvel-card', MarvelCard);
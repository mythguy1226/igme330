const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
    <style>
      div
      {
        background-color: #f4f4f4;
      }
      .card
      {
        margin-top: 2rem;
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
          deleteFavorite(this.h2.textContent);
          const clearButton = document.querySelector("#clear-favorites");
          if(clearButton != null)
          {
            this.remove();
          }
        }
        this.favorite.onclick = () => {
          this.favorite.disabled = true;
          this.favorite.textContent = "Favorited!";
          addFavorite();
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
    }
}

customElements.define('marvel-card', MarvelCard);

// Add a character to the favorites list
const addFavorite = () =>
{
    // Set the local storage key
    const KEY = "rdr8959-marvel-storage";
    //localStorage.setItem(KEY, null);
    // Get the current object stored as JSON and parse
    let storage = localStorage.getItem(KEY);
    storage = JSON.parse(storage);

    // Null check object
    if(storage == null)
        storage = {};

    // Get the name being saved
    const savedChar = document.querySelector("#output").innerHTML;

    // No saving the default card!
    if(savedChar == "\n <marvel-card></marvel-card>\n ")
      return;

    // Get favorites array from object then add the character
    if(storage["favorites"] != null)
    {
        let favorites = storage["favorites"];
        if(!favorites.includes(savedChar))
        {
          favorites.push(savedChar);
          storage["favorites"] = favorites;
        }
    }
    else
    {
        let favorites = [];
        favorites.push(savedChar);
        storage["favorites"] = favorites;
    }

    // Stringify the JSON to store
    storage = JSON.stringify(storage);
    localStorage.setItem(KEY, storage);
}

// Add a character to the favorites list
const deleteFavorite = (name) =>
{
    // This button's existence is the indicator for which action to take
    const clearButton = document.querySelector("#clear-favorites");

    if(clearButton != null) // This is for the favorites page to remove from list
    {
      // Set the local storage key
      const KEY = "rdr8959-marvel-storage";

      //Get the current object stored as JSON and parse
      let storage = localStorage.getItem(KEY);
      storage = JSON.parse(storage);

      // Null check object
      if(storage == null)
          storage = {};

      // Get favorites array from object then remove the character
      if(storage["favorites"] != null)
      {
          // Iterate through favorites to find the index
          let favorites = storage["favorites"];
          let index = 0;
          for(let favorite of favorites)
          {
            // Use string literals to find the correct character
            if(favorite.includes(`data-name="${name}"`))
            {
              index = favorites.indexOf(favorite);

              // Remove the favorite from the list
              if (index > -1) 
              {
                favorites.splice(index, 1);
              }
              storage["favorites"] = favorites;
            }
          }
      }

      // Stringify the JSON to store
      storage = JSON.stringify(storage);
      localStorage.setItem(KEY, storage);
    }
    else // This is for the app page button to reset the slots to normal
    {
      document.querySelector("#output").innerHTML = `<marvel-card></marvel-card>`;
    }
}
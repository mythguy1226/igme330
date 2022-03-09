// Import firebase
import * as firebase from "./firebase.js";

// If on favorites page load the favorites
if(document.querySelector("#favorites-list") != null)
{
    loadFavorites();
}

// Get the clear button
const clearButton = document.querySelector("#clear-favorites");

// Clear button
if(clearButton != null)
{
    clearButton.onclick = e => {
        clearFavorites();
    }
}

// Add a character to the favorites list
const addFavorite = (button) =>
{
    // Null Check for button
    if(button == null)
      return;
    
    // Get the character data
    const savedChar = getFavoriteData(button);

    // Set the local storage key
    const KEY = "rdr8959-marvel-storage";

    // Get the current object stored as JSON and parse
    let storage = localStorage.getItem(KEY);
    storage = JSON.parse(storage);

    // Null check object
    if(storage == null)
        storage = {};
    
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

    // Add to the cloud
    firebase.addCloudFavorite(button);
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
            if(favorite.name == name)
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

// Method that checks favorites list for name given
function checkInFavorites(name) 
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
      for(let favorite of favorites)
      {
        // Use string literals to find the correct character
        if(favorite.name == name)
        {
          return true;
        }
      }
  }
  return false;
}

// Loads all characters from favorites
function loadFavorites()
{
    // Set the local storage key
    const KEY = "rdr8959-marvel-storage";

    // Get the current object stored as JSON and parse
    let storage = localStorage.getItem(KEY);
    storage = JSON.parse(storage);

    // Null check object
    if(storage == null)
        return;

    // Get the favorites from local storage
    let favorites = storage["favorites"];

    // Get reference to favorites section
    const favoritesSection = document.querySelector("#favorites-list");

    // Null Check Favorites
    if(favorites != null)
    {
      // Create a new card element for each favorite and append to the HTML
      for(let favorite of favorites)
      {
        const char = document.createElement("marvel-card");
        char.dataset.name = favorite.name;
        char.dataset.description = favorite.description;
        char.dataset.image = favorite.image;
        char.dataset.comics = favorite.comics;
        char.dataset.events = favorite.events;
        favoritesSection.appendChild(char);
      }
    }
}

// Clear out the favorites tab
const clearFavorites = () =>
{
    // Set the local storage key
    const KEY = "rdr8959-marvel-storage";

    // Get the current object stored as JSON and parse
    let storage = localStorage.getItem(KEY);
    storage = JSON.parse(storage);

    // Null check object
    if(storage == null)
        return;

    // Get the favorites from local storage
    let favorites = storage["favorites"];

    // Clear favorites if they exist
    if(favorites != null)
    {
        storage["favorites"] = null;
        // Clear out the local storage
        storage = JSON.stringify(storage);
        localStorage.setItem(KEY, storage);
    }

    // Reset the HTML on the favorite's page
    document.querySelector("#favorites-list").innerHTML = ``;
}

// Method that returns object containing saved character data
// Used as a helper function for favorite buttons
const getFavoriteData = (button) =>
{
    // Get Card the button is attached to and get all of the necessary information
    let card = button.parentElement.parentElement; // Parent Card Element
    let name = card.children[2].children[0].children[0].children[0].innerHTML; // Name
    let desc = card.children[2].children[0].children[0].children[1].innerHTML; // Description
    let comicsUl = card.children[2].children[1].children[1].children; // Comics List in HTML
    let comics = []; // Init Comics
    for(let comic of comicsUl) // Add Comics iteratively
    {
      comics.push(comic.innerHTML);
    }
    let eventsUl = card.children[2].children[1].children[3].children; // Events List in HTML
    let events = []; // Init Events
    for(let event of eventsUl) // Add Events iteratively
    {
      events.push(event.innerHTML);
    }
    let imgUrl = card.children[1].children[0].children[0].currentSrc; // Image URL

    // Put together saved character
    const savedChar = {
      "name": name,
      "description": desc,
      "image": imgUrl,
      "comics": comics,
      "events": events
    }

    // Return the character object
    return savedChar;
}

// Export all methods
export {addFavorite, deleteFavorite, checkInFavorites, getFavoriteData};
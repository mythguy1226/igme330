// Imports
import "./marvel-footer.js";
import "./marvel-header.js";
import "./marvel-card.js";
import "./app-navbar.js";
import * as searcher from "./searcher.js";
import * as firebase from "./firebase.js";

// If on favorites page load the favorites
if(document.querySelector("#favorites-list") != null)
{
    loadFavorites();
}
else if(document.querySelector("#search") != null)// If on app page load the UI
{
    loadUI();
}


// User Interface
const searchButton = document.querySelector("#search");
const clearButton = document.querySelector("#clear-favorites");
const limit = document.querySelector("#limit");

// Search button
if(searchButton != null)
{
    searchButton.onclick = () => {
        let url = getURL("general");
        searcher.loadJsonFetch(url, getCharacters);
        document.querySelector("#search").classList.add("is-loading");
    }   
}       

// Clear button
if(clearButton != null)
{
    clearButton.onclick = e => {
        clearFavorites();
    }
}

// Limit selector
if(limit != null)
{
    limit.onchange = e => {
        // ****** Save UI state ******
        // Set the local storage key
        const KEY = "rdr8959-marvel-storage";

        // Get the current object stored as JSON and parse
        let storage = localStorage.getItem(KEY);
        storage = JSON.parse(storage);
        if(storage == null)
        {
            storage = {};
            storage["limit"] = document.querySelector("#limit").value;
        }
        else
        {
            storage["limit"] = document.querySelector("#limit").value;
        }

        // Stringify the JSON to store
        storage = JSON.stringify(storage);
        localStorage.setItem(KEY, storage);
    }
}

// Function that creates the character card
const showCharacter = charObj =>{
    document.querySelector("#output").innerHTML = ``;
    const marvelCard = document.createElement("marvel-card");
    marvelCard.dataset.name = charObj.name ?? "No name found";
    marvelCard.dataset.description = charObj.description ?? "No description found";
    marvelCard.dataset.image = charObj.image ?? "";
    marvelCard.dataset.comics = charObj.comics ?? "None";
    marvelCard.dataset.events = charObj.events ?? "None";
    document.querySelector("#output").appendChild(marvelCard);

    // ****** Save UI state ******
    // Set the local storage key
    const KEY = "rdr8959-marvel-storage";

    // Get the current object stored as JSON and parse
    let storage = localStorage.getItem(KEY);
    storage = JSON.parse(storage);

    // Store the active card
    if(storage == null)
    {
        storage = {};
        storage["output"] = document.querySelector("#output").innerHTML;
    }
    else
    {
        storage["output"] = document.querySelector("#output").innerHTML;
    }

    // Stringify the JSON to store
    storage = JSON.stringify(storage);
    localStorage.setItem(KEY, storage);
};

// Function that gets the proper URL based on the search term
function getURL(type)
{
    // Get the proper URL from the API
    const MARVEL_URL = "https://gateway.marvel.com/v1/public/characters?";

    // Public API key from here: https://developer.marvel.com/docs/
    let API_KEY = "fedefa1198cc7584d18711f16800dd54";
    let HASH = "00eb4328a410ac808295621f8ff3986a";

    // Build up our URL string
    let url = MARVEL_URL;

    // parse the user entered term we wish to search
    //let term = document.querySelector("#searchterm").value;
    let term = document.querySelector("#searchterm").value;
    //displayTerm = term;

    // get rid of any leading and trailing spaces
    term = term.trim();

    // encode spaces and special characters
    term = encodeURIComponent(term);

    // if there's no term to search then bail out of the function (return does this)
    if(term.length < 1) 
    {
        document.querySelector("#output").innerHTML = "<b>No results found, please enter a search term!</b>";
        return;
    }

    // Continue to build on URL
    if(type == "general")
    {
        url += "nameStartsWith=" + term;
        url += "&apikey=" + API_KEY;
        url += "&hash=" + HASH;
        url += "&ts=1";
        //let limit = document.querySelector("#limit").value;
        url += "&limit=" + document.querySelector("#limit").value;
    }
    else
    {
        url += "name=" + document.querySelector("#selected-character").innerHTML;
        url += "&apikey=" + API_KEY;
        url += "&hash=" + HASH;
        url += "&ts=1";
    }

    return url;
}

// Function for getting all of the results from the character search
const getCharacters = json => 
{
    // Get all search results
    let results = json.data;
    let chars = results['results'];

    // Init HTML string
    let html = ``;

    // Iterate through and add to the HTML
    for(let i = 0; i < chars.length; i++)
    {
        let char = chars[i]['name'];
        html += `<li>${char}</li>`;
    }

    // Set the HTML
    document.querySelector("#results").innerHTML = html;

    // Add event listeners to all list elements
    let listResults = document.querySelectorAll("li");
    for(let result of listResults)
    {
        result.onclick = e => {
            document.querySelector("#selected-character").innerHTML = e.target.textContent;
            let url = getURL("specific");
            searcher.loadJsonFetch(url, loadCharacter);
        }
    }

    // ****** Save UI state ******
    // Set the local storage key
    const KEY = "rdr8959-marvel-storage";

    // Get the current object stored as JSON and parse
    let storage = localStorage.getItem(KEY);
    storage = JSON.parse(storage);
    if(storage == null)
    {
        storage = {};
        storage["search-term"] = document.querySelector("#searchterm").value;
        storage["results"] = document.querySelector("#results").innerHTML;
    }
    else
    {
        storage["search-term"] = document.querySelector("#searchterm").value;
        storage["results"] = document.querySelector("#results").innerHTML;
    }

    // Stringify the JSON to store
    storage = JSON.stringify(storage);
    localStorage.setItem(KEY, storage);

    document.querySelector("#search").classList.remove("is-loading");
}

// Load the character and call the card to be displayed
const loadCharacter = json =>
{
    // Get the data together
    let result = json.data;
    let charData = result['results'][0];
    let name = charData.name;
    let imgPath = charData.thumbnail.path + ".jpg"
    let description = charData.description;
    let comicsArr = charData['comics']['items'];
    let comics = [];
    for(let comic of comicsArr)
    {
        comics.push(comic.name);
    }
    let eventsArr = charData['events']['items'];
    let events = [];
    for(let event of eventsArr)
    {
        events.push(event.name);
    }

    // Create the character card
    showCharacter({name:name, description:description, image:imgPath, comics:comics, events:events});
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
        // Init HTML
        let html = ``;

        // Loop through favorites and add the proper HTML
        for(let favorite of favorites)
        {
            html += favorite;
        }

        // Sets the favorites section
        favoritesSection.innerHTML = html;
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

// Add a character team to the community favorites list
const addCloudFavorite = () =>
{
    // Get the name being saved
    const savedChar = document.querySelector("#output").firstChild;

    // Convert HTML card into a character object
    const char = {
        "name": savedChar.dataset.name,
        "description": savedChar.dataset.description,
        "image": savedChar.dataset.image,
        "comics": savedChar.dataset.comics,
        "events": savedChar.dataset.events
    }

    // Write to the cloud
    firebase.writeCharCloudData(char.name, char.description, char.image, char.comics, char.events);
}

// Method that loads in all UI states from local storage
function loadUI()
{
    // ****** Load/Set UI state ******
    // Set the local storage key
    const KEY = "rdr8959-marvel-storage";

    // Get the current object stored as JSON and parse
    let storage = localStorage.getItem(KEY);
    storage = JSON.parse(storage);
    if(storage != null) // Null Check
    {
        // Go through each UI piece and set its value as stored in localStorage
        if(storage["search-term"] != null) // Null Check
            document.querySelector("#searchterm").value = storage["search-term"];
        if(storage["limit"] != null) // Null Check
            document.querySelector("#limit").value = storage["limit"];
        if(storage["results"] != null) // Null Check
            document.querySelector("#results").innerHTML = storage["results"];
            // Add event listeners to all list elements
            let listResults = document.querySelectorAll("li");
            for(let result of listResults)
            {
                result.onclick = e => {
                    document.querySelector("#selected-character").innerHTML = e.target.textContent;
                    let url = getURL("specific");
                    searcher.loadJsonFetch(url, loadCharacter);
                }
            }
        if(storage["output"] != null) // Null Check
            document.querySelector("#output").innerHTML = storage["output"];
    }
}

export {addCloudFavorite};

// Imports
import "./marvel-footer.js";
import "./marvel-header.js";
import "./marvel-card.js";
import * as searcher from "./searcher.js";

// If on favorites page load the favorites
if(document.querySelector("#favorites-list") != null)
    loadFavorites();
// Mobile Menu
const burgerIcon = document.querySelector("#burger");
const navBarMenu = document.querySelector("#nav-links");

// Toggle dropdown menu
burgerIcon.addEventListener('click', () => {
    navBarMenu.classList.toggle('is-active');
});

// User Interface
const searchButton = document.querySelector("#search");
const resultsField = document.querySelector("#results");
const favoriteButton = document.querySelector("#favorites");
const clearButton = document.querySelector("#clear-favorites");

// Search button
if(searchButton != null)
    searchButton.onclick = () => {
        let url = getURL("general");
        searcher.loadJsonXHR(url, getCharacters);
    }

// Results field
if(resultsField != null)
    resultsField.onchange = e => {
        let url = getURL("specific");
        searcher.loadJsonXHR(url, loadCharacter);
    }

// Favorites Button
if(favoriteButton != null)
    favoriteButton.onclick = e => {
        addFavorite();
    }

// Clear button
if(clearButton != null)
    clearButton.onclick = e => {
        clearFavorites();
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
        url += "name=" + document.querySelector("#results").value;
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
    let html = `<option>Select a Character</option>`;

    // Iterate through and add to the HTML
    for(let i = 0; i < chars.length; i++)
    {
        let char = chars[i]['name'];
        html += `<option>${char}</option>`;
    }

    // Set the HTML
    document.querySelector("#results").innerHTML = html;
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

    // Get favorites array from object then add the character
    if(storage["favorites"] != null)
    {
        let favorites = storage["favorites"];
        favorites.push(savedChar);
        storage["favorites"] = favorites;
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

// Clear out the favorites tab
const clearFavorites = () =>
{
    // Set the local storage key
    const KEY = "rdr8959-marvel-storage";

    // Clear out the local storage
    localStorage.setItem(KEY, null);

    // Reset the HTML on the favorite's page
    document.querySelector("#favorites-list").innerHTML = ``;
}

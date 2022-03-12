// Imports
import "./marvel-footer.js";
import "./marvel-header.js";
import "./marvel-card.js";
import "./app-navbar.js";
import "./character-management.js"
import * as searcher from "./searcher.js";

// If on app page load the UI
if(document.querySelector("#search") != null)
{
    loadUI();
}

// User Interface
const limit = document.querySelector("#limit");
    
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

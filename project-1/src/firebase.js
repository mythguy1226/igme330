// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getDatabase, ref, set, push, onValue, get } from  "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import { getFavoriteData } from "./favorites.js";
import * as searcher from "./searcher.js";
import * as manager from "./character-management.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA7WCZJYRGsrkuFJUouHxNF7NPILWkS9Es",
    authDomain: "marvel-searcher.firebaseapp.com",
    projectId: "marvel-searcher",
    storageBucket: "marvel-searcher.appspot.com",
    messagingSenderId: "562666080460",
    appId: "1:562666080460:web:506d574f3fed6809025a69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Method that writes character data to the cloud
function writeCharCloudData(name, description, image, comics, events) 
{
    // Get the database
    const db = getDatabase();

    // Push a like!
    const count_ref = ref(db, 'likes/' + name);
    push(count_ref, "Liked!");

    // Set the count to the size of likes
    let snapshot = get(count_ref);
    snapshot.then((value) => {
        // Set the character data
        set(ref(db, 'favorites/' + name), {
            name,
            description,
            image,
            comics,
            events,
            "likes" : value.size
        });
    });
}

// Function for getting character information
const reference = ref(getDatabase(), "favorites");
function dataChanged(snapshot){

    // Reset HTML
    const communitySection = document.querySelector("#community-list");
    if(communitySection != null)
    {
        communitySection.innerHTML = ``;
    }

    let arr = [];
    // Iterate through database to display
    snapshot.forEach(data => {
        const childData = data.val();
        const communitySection = document.querySelector("#community-list");
        if(communitySection != null)
        {
            const marvelCard = document.createElement("marvel-card");
            marvelCard.dataset.name = childData.name ?? "No name found";
            marvelCard.dataset.description = childData.description ?? "No description found";
            marvelCard.dataset.image = childData.image ?? "";
            marvelCard.dataset.comics = childData.comics ?? "None";
            marvelCard.dataset.events = childData.events ?? "None";
            marvelCard.dataset.community = true;
            marvelCard.dataset.likes = childData.likes ?? 0;
            communitySection.appendChild(marvelCard);
        }
        else
        {
            // Push a separate array containing likes data
            arr.push({"name" : childData.name, "likes" : childData.likes});
        }
    });

    // Create the popular list section
    if(document.querySelector("#search") != null)
    {
        // Get the top 5 values for the most popular characters
        let mostPopularCharacters = arr.sort((a,b) => b.likes-a.likes).slice(0,5);

        // Init HTML string
        let html = ``;

        // Iterate through and add to the HTML
        for(let i = 0; i < mostPopularCharacters.length; i++)
        {
            let char = mostPopularCharacters[i]['name'];
            let likes = mostPopularCharacters[i]['likes'];
            html += `<p><b>Likes: </b>${likes}</p> <li>${char}</li>`;
        }

        // Set the HTML
        document.querySelector("#popular").innerHTML = html;

        // Add event listeners to all list elements
        let listResults = document.querySelectorAll("li");
        for(let result of listResults)
        {
            result.onclick = e => {
                document.querySelector("#selected-character").innerHTML = e.target.textContent;
                let url = manager.getURL("specific");
                searcher.loadJsonFetch(url, manager.loadCharacter);
            }
        }
    }
}
onValue(reference,dataChanged);

// Add a character to the community favorites list
const addCloudFavorite = (button) =>
{
    // Get the name being saved
    const savedChar = getFavoriteData(button);

    // Convert HTML card into a character object
    const char = {
        "name": savedChar.name,
        "description": savedChar.description,
        "image": savedChar.image,
        "comics": savedChar.comics,
        "events": savedChar.events,
    }

    // Write to the cloud
    writeCharCloudData(char.name, char.description, char.image, char.comics, char.events);
}

export {addCloudFavorite};
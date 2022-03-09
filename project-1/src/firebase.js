// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from  "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import { getFavoriteData } from "./favorites.js";
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

function writeCharCloudData(name, description, image, comics, events, count) 
{
    const db = getDatabase();
    set(ref(db, 'favorites/' + name), {
        name,
        description,
        image,
        comics,
        events,
        count
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
            marvelCard.dataset.count = childData.count ?? 0;
            communitySection.appendChild(marvelCard);
        }
    });
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
        "count": savedChar.count ?? 0
    }

    // Write to the cloud
    writeCharCloudData(char.name, char.description, char.image, char.comics, char.events, char.count + 1);
}

export {addCloudFavorite};
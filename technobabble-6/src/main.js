"use strict";
        
// Make sure code is ran after page is loaded
window.onload = main;

// Function for main code
function main()
{
    loadTextXHR();
}

// Function for getting random elements from an array
function getRandomElement(array)
{
    return array[Math.floor(Math.random() * array.length)]
}

// Function for generating new babble text
function generateTechno(num, words1, words2, words3)
{
    let fullPhrase = "";
    for(let i = 0; i < num; i++)
    {
        // Get 3 new random words
        let word1 = getRandomElement(words1);
        let word2 = getRandomElement(words2);
        let word3 = getRandomElement(words3);

        // Form the new phrase
        let babblePhrase = word1 + " " + word2 + " " + word3;
        fullPhrase += babblePhrase + "<br>";
    }

    // Change the output HTML text
    document.querySelector("#output").innerHTML = fullPhrase;
}

// Function that loads text
function loadTextXHR()
{
    // Init variables
    const url = "data/babble-data.csv"
    const xhr = new XMLHttpRequest();

    // XHR loading  handler
    xhr.onload = (e) => {
        console.log(`In onload - HTTP Status Code = ${e.target.status}`);
        const text = e.target.responseText;
        console.log(`Success - the file length is ${text.length}`);
        //const lines = text.split("\n");
        //const dogNames = lines[0].split(",");
        //const catNames = lines[1].split(",");

        // Get the names for dogs, cats, and birds
        let [words1,words2,words3] = text.split("\n");
        words1 = words1.split(",");
        words2 = words2.split(",");
        words3 = words3.split(",");

        // Generate some initial text
        generateTechno(1, words1, words2, words3);

        // Add the event listener to the button for generating new text
        const button = document.querySelector("#myButton");
        button.onclick = function() {
            generateTechno(1, words1, words2, words3);
        };

        // Add event listener for multi-babble calls
        const multiButton = document.querySelector("#technoFive");
        multiButton.onclick = function() {
            generateTechno(5, words1, words2, words3);
        }
    };

    // XHR error handler
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);

    // GET the data from the url
    xhr.open("GET", url);
    xhr.send();
}
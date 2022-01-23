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
    const url = "data/babble-data.json"
    const xhr = new XMLHttpRequest();

    // XHR loading  handler
    xhr.onload = (e) => {
        // Get the JSON Object and keys
        const json = JSON.parse(e.target.responseText);
        const keys = Object.keys(json);

        // Init word arrays
        let words1,words2,words3 = [];

        // Loop through JSON Object and get/set word arrays
        let i = 0; // Iterator
        for(let k of keys)
        {
            const obj = json[k];
            // Conditional for getting word arrays
            switch(i)
            {
                case 0:
                    words1 = obj.words;
                    break;
                case 1:
                    words2 = obj.words;
                    break;
                case 2:
                    words3 = obj.words
                    break;
            }
            i++;
        }

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
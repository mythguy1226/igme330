// Set main to run upon window loading
window.onload = main;

// Main Function
function main()
{
    // Set the button to load the text
    document.querySelector("#my-button").onclick = loadTextXHR;
}

// Function that loads text
function loadTextXHR()
{
    // Init variables
    const url = "data/pet-names.txt"
    const xhr = new XMLHttpRequest();

    // XHR loading  handler
    xhr.onload = (e) => {
        console.log(`In onload - HTTP Status Code = ${e.target.status}`);
        const text = e.target.responseText;
        console.log(`Success - the file length is ${text.length}`);
        const words = text.split(",");

        // Long way
        /*let html = "<ol>";
        for(let w of words)
        {
            html += `<li>${w}</li>`;
        }
        html += "</ol>";
        document.querySelector("#output").innerHTML = html;*/

        // Short way
        const html = `<ol>${words.map(w => `<li>${w}</li>`).join("")}</ol>`;
        document.querySelector("#output").innerHTML = html;
    };

    // XHR error handler
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);

    // GET the data from the url
    xhr.open("GET", url);
    xhr.send();
}
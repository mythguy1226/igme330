// Set main to run upon window loading
window.onload = main;

// Main Function
function main()
{
    // Set the button to load the text
    document.querySelector("#my-button").onclick = loadXmlXHR;
}

// Function that loads text
function loadXmlXHR()
{
    // Init variables
    const url = "data/pet-names.json"
    const xhr = new XMLHttpRequest();

    // XHR loading  handler
    xhr.onload = (e) => {
        // Get the JSON Object abd keys
        const json = JSON.parse(e.target.responseText);
        const keys = Object.keys(json);

        let html = "";
        for(let k of keys)
        {
            const obj = json[k];
            html += `<h3>${obj.title = obj.title ? obj.title: "No title found"}</h3> <ol>${obj["namelist"].map(w => `<li>${w}</li>`).join("")}</ol>`;
        }

        // Set new html
        document.querySelector("#output").innerHTML = html;
    };

    // XHR error handler
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);

    // GET the data from the url
    xhr.open("GET", url);
    xhr.send();
}
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
    //const url = "data/pet-names.json"
    const url = "https://dog.ceo/api/breed/hound/images/random/10"
    const xhr = new XMLHttpRequest();

    // XHR loading  handler
    xhr.onload = (e) => {
        // Get the JSON Object abd keys
        const json = JSON.parse(e.target.responseText);
        const keys = Object.keys(json);

        let html = "";
        for(let k of keys)
        {
            let obj = json[k];
            for(let i = 0; i < obj.length; i++)
            {
                html += `<img src="${obj[i]}" alt="a dog">`;
            }
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
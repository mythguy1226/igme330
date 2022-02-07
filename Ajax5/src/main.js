// Set main to run upon window loading
window.onload = main;

// Main Function
function main()
{
    // Set the button to load the text
    document.querySelector("#my-button").onclick = loadJsonFetch;
}

// Method that loads a JSON using fetch()
function loadJsonFetch()
{
    // Fetch the file location or URL
    fetch('data/pet-names.json')
    .then(response => {
        // Check if it's a valid object
        if(response.ok)
        {
            return response.json();
        }

        // If not return a 404 page
        return response.text().then(text =>{
            throw text;
        })
    })
    .then(json => {
        // Log to console the JSON
        console.log(json);
        console.log(json.name);
        console.log(json.homeworld);

        // Put together the HTML based on the JSON file
        const keys = Object.keys(json);
        let html = "";
        for(let k of keys)
        {
            const obj = json[k];
            html += `<h3>${obj.title = obj.title ? obj.title: "No title found"}</h3> <ol>${obj["namelist"].map(w => `<li>${w}</li>`).join("")}</ol>`;
        }

        // Set new html
        document.querySelector("#output").innerHTML = html;
    }).catch(error => {
        console.log(error);
    });
}
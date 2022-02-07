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
    // Function for fetching the promise
    const fetchPromise = async () => {
        // Fetch the file location or URL
        let response = await fetch('data/pet-names.json');
        if(!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the JSON Object
        let json = await response.json();

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
    };

    // Fetching the promise with a catch statement for error handling
    fetchPromise()
      .catch(e => {
        console.log(`In catch with e = ${e}`);
    });
}
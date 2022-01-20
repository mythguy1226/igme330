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
    const url = "data/pet-names.csv"
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
        let [dogNames,catNames,birdNames] = text.split("\n");
        dogNames = dogNames.split(",");
        catNames = catNames.split(",");
        birdNames = birdNames.split(",");

        // Declare the html for each list
        const dogHtml = `<ol>${dogNames.map(w => `<li>${w}</li>`).join("")}</ol>`;
        const catHtml = `<ol>${catNames.map(w => `<li>${w}</li>`).join("")}</ol>`;
        const birdHtml = `<ol>${birdNames.map(w => `<li>${w}</li>`).join("")}</ol>`;

        // Structure the html with all of the lists
        const html = `
            <h3>Dog Names</h3>
            ${dogHtml}
            <h3>Cat Names</h3>
            ${catHtml}
            <h3>Bird Names</h3>
            ${birdHtml}
        `;

        // Set the HTML to output
        document.querySelector("#output").innerHTML = html;
    };

    // XHR error handler
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);

    // GET the data from the url
    xhr.open("GET", url);
    xhr.send();
}
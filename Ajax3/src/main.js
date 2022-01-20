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
    const url = "data/pet-names.xml"
    const xhr = new XMLHttpRequest();

    // XHR loading  handler
    xhr.onload = (e) => {
        // Get the XML Object
        const xml = e.target.responseXML;

        // Null Check XML
        if(!xml)
        {
            document.querySelector("#output").innerHTML = "ERROR: xml is null";
            return;
        }

        // Get the name lists from the XML document
        const dogNames = xml.querySelector("namelist[cid='dognames']").textContent.split(",");
        const catNames = xml.querySelector("namelist[cid='catnames']").textContent.split(",");

        // Declare the html for each list
        const dogHtml = `<ol>${dogNames.map(w => `<li>${w}</li>`).join("")}</ol>`;
        const catHtml = `<ol>${catNames.map(w => `<li>${w}</li>`).join("")}</ol>`;

        // Structure the html with all of the lists
        const html = `
            <h3>Dog Names</h3>
            ${dogHtml}
            <h3>Cat Names</h3>
            ${catHtml}
        `;

        // Set new html
        document.querySelector("#output").innerHTML = html;
    };

    // XHR error handler
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);

    // GET the data from the url
    xhr.open("GET", url);
    xhr.send();
}
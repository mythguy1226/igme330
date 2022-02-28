// Method that loads a JSON using fetch()
function loadJsonFetch(url, callBack)
{
    // Function for fetching the promise
    const fetchPromise = async () => {
        // Fetch the file location or URL
        let response = await fetch(url);
        if(!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the JSON Object
        let json = await response.json();

        callBack(json);
    };

    // Fetching the promise with a catch statement for error handling
    fetchPromise()
      .catch(e => {
        console.log(`In catch with e = ${e}`);
    });
}
export {loadJsonFetch};


function downloadFile(url, callbackRef)
{
    const xhr = new XMLHttpRequest();

    // Set on-error handler
    xhr.onerror = (e) => console.log("error");

    // Set the onload handler
    xhr.onload = (e) => {
        const headers = e.target.getAllResponseHeaders;
        const jsonString = e.target.response;
        callbackRef(jsonString);
    }

    // Open the connection using the HTTP GET method
    xhr.open('GET', url);

    // Send the request
    xhr.send();
}

// Export the funtion
export {downloadFile};
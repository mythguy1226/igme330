function loadJsonXHR(url, callBack){
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
        console.log(`In onload - HTTP Status Code = ${e.target.status}`);

        // Get the JSON and Parse it
        let json;
        try{
            json = JSON.parse(e.target.responseText);
        }catch{
            document.querySelector("#output").innerHTML = "<p>BAD JSON!</p>";
            return;
        }
        
        // Callback function to display the card
        callBack(json);
        console.log("json = ",json);
    }
    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET",url);
    xhr.send();
}

export {loadJsonXHR};
import * as main from "./main.js";
import "./app-navbar.js";

let presets = {};
window.onload = ()=>{
	// 1 - do preload here - load fonts, images, additional sounds, etc...

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

	// Load the presets
	loadJsonFetch("./data/presets.json", json => {
		presets = json;
	});

	// 2 - start up app
	main.init();
}
export {presets};
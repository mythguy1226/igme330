// Imports
import * as map from "./map.js"
import * as ajax from "./ajax.js";

// Init
let poi;

// Function that loads the POI
function loadPOI()
{
    // Set the URL
    const url = "./data/data.json";

    // Callback function for when data shows up
    function poiLoaded(jsonString)
    {
        poi = JSON.parse(jsonString);

        // Add the markers
        for(let p of poi)
        {
            map.addMarker(p.coordinates, p.title, "A POI!", "poi");
        }
    }

    // Download
    ajax.downloadFile(url, poiLoaded);
}

// Init wrapper function
function init() 
{
    // Init the map
    map.initMap();

    // Load all of the markers from the GeoJSON
    map.loadMarkers();

    // Add the markers to the map
    map.addMarkersToMap();

    // Set up the UI
    setupUI();
}

// Function to set up the UI
function setupUI(){
    // it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
    const lnglatRIT = [-77.67454147338866, 43.08484339838443];
    const lnglatIGM = [-77.67990589141846, 43.08447511795301];

    // RIT Zoom 15.5
    btn1.onclick = () => {
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(0, 0);
        map.flyTo(lnglatRIT);
    }

    // RIT isometric view
    btn2.onclick = () => {
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(45, 0);
        map.flyTo(lnglatRIT);
    }

    // World zoom 0
    btn3.onclick = () => {
        map.setZoomLevel();
        map.setPitchAndBearing(0, 0);
        map.flyTo();
    }

    // IGM zoom 18
    btn4.onclick = () => {
        map.setZoomLevel(18);
        map.setPitchAndBearing(0, 0);
        map.flyTo(lnglatIGM);
    }

    // Load some marker data
    btn5.onclick = () => {
        // Only download this once
        if(!poi)
        {
            loadPOI();
        }
    }
}

// Export Init function
export {init};
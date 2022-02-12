// Init wrapper function
function init() 
{
    mapboxgl.accessToken = 'pk.eyJ1IjoibXl0aGdhbWVzIiwiYSI6ImNremp6and4dTRwdWwybm5rYjgwY2d6Z2IifQ.DAgICobx-MKh0VSgvnWe-A';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10'
    });
    map.setZoom(9);
    map.setCenter([-77.6799,43.083848]); // note the order - it's longitude,latitude - which is opposite of Google Maps

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // GeoJSON
    const geojson = {
    type: 'FeatureCollection',
    features: [
        {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-77.032, 38.913]
        },
        properties: {
            title: 'Mapbox',
            description: 'Washington, D.C.'
        }
        },
        {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-122.414, 37.776]
        },
        properties: {
            title: 'Mapbox',
            description: 'San Francisco, California'
        }
        },
        {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [-83.72234344482422, 43.01117463671629]
        },
        properties: {
            title: 'Mapbox',
            description: 'Flint, Michigan'
        }
        }
    ]
    };

    // add markers to map
    for (const feature of geojson.features) 
    {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
                `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
            )
        )
        .addTo(map);
    }
}

// Export Init function
export {init};
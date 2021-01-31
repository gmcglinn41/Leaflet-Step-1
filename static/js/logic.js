// Store our API endpoint inside query Url.  Create the base map
var myMap = L.map("map",{
    center: [
        34.052235, -118.243683
    ],
    zoom:5,
});

//get the url for the earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//add the light layer tile

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Grab data with d3

d3.json(queryUrl, function(data){
    createFeatures(data.features);
});

//create function to view the Earthquake data

function createFeatures(earthquakeData) {
//create function that gets colours for circle markers
function getColor(d) {
    return  d > 5 ? '#ef5a5a':
            d > 4 ? '#da8b4a':
            d > 3 ? '#eaaf3f':
            d > 2 ? '#e3c826':
            d > 1 ? '#cbdf29':
                    '#a4e039';
    }
//create a function that changes marker size depending on magnitute values 
  function style(feature) {
    return {
        radius: (feature.properties.mag)*5,
        fillColor: getColor(feature.properties.mag),
        weight: 1,
        opacity: 0.7,
        color: "grey",
        fillOpacity: 1.0
    };
  }
// // // Define a function we want to run once for each feature in the features array
// // // Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, style);
    },
    style: style,
    onEachFeature: onEachFeature
}).addTo(myMap);


//Create a legend to the bottom right.
var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            mhis = [0, 1, 2, 3, 4, 5],
            labels = [],
            from, to;


         //loop through our density intervals and generate a label    
        for (var i = 0; i < mhis.length; i++) {
            console.log(mhis[i]);
            from = mhis[i];
            to = mhis[i+1];
            labels.push(
                '<i style="background:' + getColor(from +1) + '"></i> ' +
                from + (to ? '&ndash;' + to: '+'));
        }
        console.log(labels);
        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(myMap);
}






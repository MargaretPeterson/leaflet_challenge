console.log("working");

var apiKey = "pk.eyJ1IjoibWVnZWxsZW5wZXRlcnNvbiIsImEiOiJjazhnb2JmOHowM25xM21vOTV4dmc5bHZyIn0.fvumS6wFjvwaSHfaBDdDQg";

var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: apiKey
});


var map = L.map("mapid", {
    center: [
        40.7, -94.5
    ],
    zoom: 3
});

graymap.addTo(map);

// Ajax
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

    // This function returns the style data for each of the earthquakes we plot on
    // the map. We pass the magnitude of the earthquake into two separate functions
    // to calculate the color and radius.
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Color marker function
    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#ea2c2c";
            case magnitude > 4:
                return "#ea822c";
            case magnitude > 3:
                return "#ee9c00";
            case magnitude > 2:
                return "#eecc00";
            case magnitude > 1:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    }


    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }


    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        // styleInfo function.
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(map);

    // Legend
    var legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");

        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        // Label interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };
    legend.addTo(map);
});
// Set up global variable
var result;
var geoWatch;
var latitude;
var longitude;

function startWatchPosition() {
    // Store the element where the page displays the result
    result = document.getElementById("result");
    startWatchButton = document.getElementById("startWatchButton");
    stopWatchButton = document.getElementById("stopWatchButton");
    startWatchButton.classList.replace('block', 'hidden');
    stopWatchButton.classList.replace('hidden', 'block');
    if ( !geoWatch ) {
        // If geolocation is available, try to get the visitor's position
        if (navigator.geolocation) {
            geoWatch = navigator.geolocation.watchPosition(successCallback, errorCallback, { enableHighAccuracy: true });
            // result.innerHTML = "Getting the position information...";
        } else {
            alert("Sorry, your browser does not support HTML5 geolocation.");
        }
    }
};

function stopWatchPosition() { 
    navigator.geolocation.clearWatch( geoWatch ); 
    geoWatch = undefined;
    startWatchButton = document.getElementById("startWatchButton");
    stopWatchButton = document.getElementById("stopWatchButton");
    startWatchButton.classList.replace('hidden', 'block');
    stopWatchButton.classList.replace('block', 'hidden');
};

// Define callback function for successful attempt
function successCallback(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    data = {'latitude': latitude, 'longitude': longitude,
            csrfmiddlewaretoken};
    // result.innerHTML = [position.coords.latitude, position.coords.longitude];
    $.post(url, data)
}

// Define callback function for failed attempt
function errorCallback(error) {
    if (error.code == 1) {
        result.innerHTML = "You've decided not to share your position, but it's OK. We won't ask you again.";
    } else if (error.code == 2) {
        result.innerHTML = "The network is down or the positioning service can't be reached.";
    } else if (error.code == 3) {
        result.innerHTML = "The attempt timed out before it could get the location data.";
    } else {
        result.innerHTML = "Geolocation failed due to unknown error.";
    }
}

// window.onload = showPosition;
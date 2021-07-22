var map;
var marker;
var updatedLatLng;
function initMap() {
    const location = JSON.parse(document.getElementById('latLng').textContent);
    console.log(location);
    var latLng = new google.maps.LatLng(location['lat'], location['lon']);

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(stopTrackingButton());
    marker = createMarker(latLng);
}

function createMarker(latLng) {
    var geocoder = new google.maps.Geocoder();
    var infoWindow = new google.maps.InfoWindow();

    //Remove previous Marker.
    if (marker != null) {
        marker.setMap(null);
    }

    marker = new google.maps.Marker({
        position: latLng,
        // title: 'Point A',
        center: latLng,
        map: map,
        animation: google.maps.Animation.BOUNCE,
        clickable: true
    });

    marker.addListener("click", function() {
        geocoder.geocode({ location: latLng })
        .then((response) => {
            if (response.results[0]) {
                infoWindow.setContent(response.results[0].formatted_address);
                infoWindow.open(map, marker);
            } else {
                window.alert("No results found");
            }
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e));
    })

    return marker;
}

var eventSource = new EventSource(stream_location_url, { withCredentials: true });
eventSource.onopen = function() {
    console.log('Yay! its open!!');
}

eventSource.onmessage = function(e) {
    console.log(e)
    updated_location = JSON.parse(e.data)
    console.log("updated_location")
    console.log(updated_location)
    if (Object.keys(updated_location).length !== 0) {
        updatedLatLng = new google.maps.LatLng(updated_location['lat'], updated_location['lon']);
        map.setCenter(updatedLatLng);
        marker = createMarker(updatedLatLng);
        // var marker = createMarker(geocoder, map, infoWindow, latLng);
        console.log("Marker");
        console.log(marker);
    }
}

eventSource.onerror = function(e) {
    console.log(`error ${e}`);
    eventSource.close();
}

function stopTrackingButton(){
    var btn = $('<div class=" class="flex items-center justify-center"">\
    <button type="button" id="stop-tracking" class="px-16 py-2 my-2 text-base font-medium text-white transition duration-500 ease-in-out transform border-black rounded-md bg-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 hover:bg-blueGray-900">Stop Tracking</button>\
    </div>');
    btn.on("click", function()  {
        data = {
            "stop": true,
            csrfmiddlewaretoken
        }
        $.post(stream_location_url, data)
        eventSource.close();
        location.href = get_users_url;
    })
    return btn[0];
}
var map;
var geocoder;

function getTrip(checkedAttractions) {
	//set up map directions objects
	geocoder = new google.maps.Geocoder();
	var directionsService = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var mapOptions = {
    	zoom: 8,
    	center: new google.maps.LatLng(-34.397, 150.644),
   		mapTypeId: google.maps.MapTypeId.ROADMAP
  	}
	map = new google.maps.Map(document.getElementById("mapLocation"), mapOptions);
  	directionsDisplay.setMap(map);
	
	//set up waypoints here
	var attractions = checkedAttractions;
	var waypoints = [];
	
	if (attractions.length > 0 ) {
	for (var i = 0; i < attractions.length; i++) {
		var waypt = {
          location: attractions[i] + ' ' + $('#city').val(),
          stopover: true
      	}
      	waypoints.push(waypt);
	}
	}

	var request = {
		origin: $('#start_point').val() + ' ' + $('#city').val(),
		destination: $('#end_point').val() + ' ' + $('#city').val(),
		travelMode: google.maps.TravelMode.WALKING, //DRIVING
		waypoints: waypoints,
		optimizeWaypoints: true,
	}

	directionsService.route(request, function(result, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
      		directionsDisplay.setDirections(result);
    	}
  	});
}

//when the page shows
$('#trip').live("pageshow", function() {
	//set the height so the map shows
	$('#mapLocation').css('height', $('#trip').height());
	//resize the map to fit the new height
	google.maps.event.trigger(map, 'resize');
	//call the function to center and zoom the map
	codeAddress();
});


//center and zoom map on city
function codeAddress() {
	var address = $("#city").val();
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if(status == google.maps.GeocoderStatus.OK) {
			//center map on city coordinates
			map.setCenter(results[0].geometry.location);
			//zoom map on city coordinates
			map.fitBounds(results[0].geometry.viewport);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

//get this function to work!!! (so the trips can be saved)
function saveTrip(waypoints) {
	var start = $('#start_point').val();
	var end = $('#end_point').val();
	var city = $('#city').val();
	
	var waypoints = waypoints
	
	$.ajax({
			url: "saveTrip",
			type: "put",
			data: {
				city: city,
				start: start,
				end: end,
				waypoints: waypoints
			},
			success: function(data) {
				alert('trip saved');
			}
	});
	return false;
}

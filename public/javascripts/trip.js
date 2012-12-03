var map;
var geocoder;
var startPoint;

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
	
	var method = "";
	if 	($('#walking').is(':checked')) {
		method = google.maps.TravelMode.WALKING;
	}
	else {
		method = google.maps.TravelMode.DRIVING;
	}
	startPoint = $('#start_point').val() + ' ' + $('#city').val();
	
	var request = {
		origin: $('#start_point').val() + ' ' + $('#city').val(),
		destination: $('#end_point').val() + ' ' + $('#city').val(),
		travelMode: method,
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
	codeAddress(startPoint);
});


//center and zoom map on city
function codeAddress(point) {
	var address = point;
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
	
	var method = "";
	
	if ($('#walking').is(':checked')) {
		method = 'walking';
	}
	else {
		method = 'driving'
	}
	
	var name = $('#tripName').val();
	var username = $('#username').val();
	
	var waypoints = waypoints;
	
	
	$.ajax({
			url: "saveTrip",
			type: "put",
			data: {
				city: city,
				start: start,
				end: end,
				waypoints: waypoints,
				name: name,
				username: username,
				method: method
			},
			success: function(data) {
				$('#trip_save_error').html(data);
			}
	});
	return false;
}


function loadTrip(tripName) {
	var username = $('#username').val();
	var tripName = tripName;
	
	$.ajax({
			url: "loadTrip",
			type: "get",
			data: {
				username: username,
				tripName: tripName
			},
			success: function(data) {
				console.log(data);
				var trip = data.trip[0];
				startPoint = trip.start;
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
				
				
				var attractions = JSON.parse(trip.waypoints);
				
				//set up waypoints here
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
				
				var method = "";
				if 	(trip.method = 'walking') {
					method = google.maps.TravelMode.WALKING;
				}
				else {
					method = google.maps.TravelMode.DRIVING;
				}
				var request = {
					origin: trip.start + ', ' + trip.city,
					destination: trip.end + ', ' + trip.city,
					travelMode: method,
					waypoints: waypoints,
					optimizeWaypoints: true,
				}
			
				directionsService.route(request, function(result, status) {
			    	if (status == google.maps.DirectionsStatus.OK) {
			      		directionsDisplay.setDirections(result);
			    	}
			  	});
			}
	});
  	
  	return false;
}
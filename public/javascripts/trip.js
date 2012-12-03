var map;
var geocoder;
var startPoint;
var endPoint;
var attractions = [];

//creates a trip
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
	attractions = checkedAttractions;
	var waypoints = [];
	
	//set up the waypoint objects
	if (attractions.length > 0 ) {
	for (var i = 0; i < attractions.length; i++) {
		var waypt = {
          location: attractions[i] + ' ' + $('#city').val(),
          stopover: true
      	}
      	waypoints.push(waypt);
	}
	}
	
	//set the method of travel
	var method = "";
	if 	($('#walking').is(':checked')) {
		method = google.maps.TravelMode.WALKING;
	}
	else {
		method = google.maps.TravelMode.DRIVING;
	}
	
	//get the start and end points
	startPoint = $('#start_point').val() + ' ' + $('#city').val();
	endPoint = $('#end_point').val() + ' ' + $('#city').val();
	
	//set up the request
	var request = {
		origin: $('#start_point').val() + ' ' + $('#city').val(),
		destination: $('#end_point').val() + ' ' + $('#city').val(),
		travelMode: method,
		waypoints: waypoints,
		optimizeWaypoints: true,
	}
	
	//get the optimized route and put it on the map
	directionsService.route(request, function(result, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
    		//set up the list of directions
    		//pass in false so that the save trip option is not removed
    		setUpListOfDirections(result, false);
      		directionsDisplay.setDirections(result);
    	}
  	});
}

//when the page shows so that the map is displayed (otherwise JQuery mobile styles hide it)
$('#trip').live("pageshow", function() {
	//set the height so the map show
	$('#mapLocation').css('height', $('#trip').height());
	//resize the map to fit the new height
	google.maps.event.trigger(map, 'resize');
	//call the function to center and zoom the map
	codeAddress(startPoint);
});


//center and zoom map on start point of route
function codeAddress(point) {
	var address = point;
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if(status == google.maps.GeocoderStatus.OK) {
			//center map on start point coordinates
			map.setCenter(results[0].geometry.location);
			//zoom map on start point coordinates
			map.fitBounds(results[0].geometry.viewport);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}


//saves created trips
function saveTrip(waypoints) {
	var start = $('#start_point').val();
	var end = $('#end_point').val();
	var city = $('#city').val();
	
	var method = "";
	
	//set the method of travel
	if ($('#walking').is(':checked')) {
		method = 'walking';
	}
	else {
		method = 'driving'
	}
	
	var name = $('#tripName').val();
	var username = $('#username').val();
	
	var waypoints = waypoints;
	
	
	//ajax request so that the model saveTrip method is called
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
				//sets the error message to display whether the trip was saved or not
				//shows up right below the button to save the trip
				$('#trip_save_error').html(data);
			}
	});
	return false;
}


//This method is similar to the getTrip method above
//However this method is used for loading a trip that was previously saved
//This method uses an ajax request to communicate with the server.
//In addition it needs to hide the save trip button and input on the trip page
//I felt as though separating these methods was necessary to achieve the functionality I wanted
function loadTrip(tripName) {
	//the username of the current user
	var username = sessionStorage.username;
	
	//the name of the trip
	var tripName = tripName;
	
	//ajax request to get the trip details from the db
	$.ajax({
			url: "loadTrip",
			type: "get",
			data: {
				username: username,
				tripName: tripName
			},
			success: function(data) {
				//set up the google map with the directions API
				var trip = data.trip[0];
				
				startPoint = trip.start;
				endPoint = trip.end;
				
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
				
				
				//get the list of waypoint attractions
				attractions = JSON.parse(trip.waypoints);
				
				//set up waypoints here
				var waypoints = [];
				
				//set up the waypoint objects
				if (attractions.length > 0 ) {
				for (var i = 0; i < attractions.length; i++) {
					var waypt = {
			          location: attractions[i] + ' ' + trip.city,
			          stopover: true
			      	}
			      	waypoints.push(waypt);
				}
				}
				
				//set the method of travel
				var method = "";
				if 	(trip.method = 'walking') {
					method = google.maps.TravelMode.WALKING;
				}
				else {
					method = google.maps.TravelMode.DRIVING;
				}
				
				//set up the request object
				var request = {
					origin: trip.start + ', ' + trip.city,
					destination: trip.end + ', ' + trip.city,
					travelMode: method,
					waypoints: waypoints,
					optimizeWaypoints: true,
				}
			
				//make the request and add the directions to the map
				directionsService.route(request, function(result, status) {
			    	if (status == google.maps.DirectionsStatus.OK) {
			    		//set up the directions list which will show below the map
			    		//pass true so that the input to save the trip is removed since it is already saved
			    		setUpListOfDirections(result, true);
			      		directionsDisplay.setDirections(result);
			    	}
			  	});
			}
	});
  	
  	return false;
}

//sets up the list of attractions below the map
//also removes the save trip button is this is a loaded trip
function setUpListOfDirections(result, removeSave) {
	 var start = startPoint;
	 var end = endPoint;
	 //these are the waypoints the user chose to visit
	 var waypoints = attractions;
	 //this is the resulting best order of the waypoints
	 var waypointsOrder = result.routes[0].waypoint_order;

	//empty the list so no previous trips show
	 $('#directionsList').empty();
	 
	 $('#directionsList').append("<h3>Visit attractions in this order for the optimal route.</h3>");
	 
	 //add the start point
	 $('#directionsList').append("<ol>" + startPoint + "</ol>");

	//add all the waypoints
	 for (var i = 0; i < waypointsOrder.length; i++) {
	 	$('#directionsList').append("<ol>" + attractions[waypointsOrder[i]] + "</ol>");
	 }
	 
	 //add the end point
	 $('#directionsList').append("<ol>" + endPoint + "</ol>");
	 
	 //remove the save trip field depending on whether you have loading or created a trip
	 if (removeSave == true) {
	 	$('#saveTripDiv').hide();
	 }
	 else {
	 	$('#saveTripDiv').show();
	 }
}

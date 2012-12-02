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
          location: attractions[i],
          stopover: true
      	}
      	waypoints.push(waypt);
	}
	}
	
	var request = {
		origin: "Empire State Building",
		destination: "World Trade Center Memorial",
		travelMode: google.maps.TravelMode.DRIVING,
		waypoints: waypoints,
		optimizeWaypoints: true,
	}

	directionsService.route(request, function(result, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
      		directionsDisplay.setDirections(result);
    	}
  	});
}



//$('#trip').live("pageinit", function() {
   //$('#mapLocation').map('refresh');
   //$('#trip').css('min-height', '100%');
   //$('#trip').css('height', '100%');
   //$('#mapLocation').css('height', $('#trip').height());
   //google.maps.event.trigger(map, 'resize');
   //console.log('did it');
//});


$('#trip').live("pageshow", function() {
   //$('#mapLocation').gmap('refresh');
   			//$('#mapLocation').css('height', '100%');
			//$('#mapLocation').css('width', '100%');
			$('#mapLocation').css('height', $('#trip').height());
			google.maps.event.trigger(map, 'resize');
			codeAddress();
   //google.maps.event.trigger(map, 'resize');
});


//center map on city
function codeAddress() {
	var address = $("#hidden_city").val();
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if(status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

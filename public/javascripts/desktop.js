//functions which are evoked on actions by the user when viewing on desktop
$(function() {
	$("#desktop_login_submit").click(desktopLogin); //logs in user on desktop
});


//function called when login is submitted
function desktopLogin() {
	//get text from fields on form
	var username = $('#desktop_user').val();
	var password = $('#desktop_pass').val();
	
	//ajax call which evokes the user model's login() function
	$.ajax({
			url: "loginRequest",
			type: "get",
			data: {
				user: username,
				pass: password
			},
			success: function(data) {
				//if successful login then call function to load user_ui page
				if (data == 'success') {
					//sets the username to be stored in the session
					sessionStorage.username = username;
					//loads all of the previously saved trips for that user
					desktopLoadTrips(username);
				}
				else {
					//if there is a login error then display it
					$('#error_on_log_in').html(data);
				}
			}
	});
	return false;
}

//load trips to the user UI page on login
function desktopLoadTrips(username) {
	
	//evokes the trip_model.loadTrips() function on the server side
	$.ajax({
			url: "loadTrips",
			type: "get",
			data: {
				username: username
			},
			success: function(data) {
				//if the user doesn't have any trips display that
				if (data == 'You do not have any saved trips.') {
					$('#loadedTrips').append(data);
				}
				else {
					//if the user has trips display them with buttons that link to the map display of the trip
					var trips = data.trips;
					
					$('#loadedTrips').empty();
	
					for (var i = 0; i < trips.length; i++) { 
						$('#loadedTrips').append(
							"<li><a href='#'><button class='existingTrip' >" + trips[i].name + "</button></a></li>"
						);
					} 
				}
			}
	});
	return false;
}
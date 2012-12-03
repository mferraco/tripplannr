//this file interacts with the user logic on the client side

//action when a user interacts with these buttons
$(function() {
	$("#login").submit(login);
	$("#signup").submit(signUp);
	$('.logout').click(logOut);	
});

//function called when login is submitted
function login() {
	//get text from fields on form
	var username = $('#username').val();
	var password = $('#password').val();
	
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
					loadTrips(username);
					$.mobile.changePage('#userUi');
					$('#welcome_header').text('Welcome, ' + sessionStorage.username);
				}
				else {
					//if there is a login error then display it
					$('#error_on_log_in').html(data);
				}
			}
	});
	return false;
}


//function called when signup is submitted
function signUp() {
	//get text from fields on form
	var username = $('#sign_up_username').val();
	var password = $('#sign_up_password').val();
	
	$.ajax({
			url: "signUpRequest",
			type: "put",
			data: {
				username: username,
				password: password
			},
			success: function(data) {
				if (data == 'User saved.') {
					//sets the sessions storage to that user
					sessionStorage.username = username;
					//loads the previous trips for that user (which should always be none)
					loadTrips(username);
					//change to user ui page
					$.mobile.changePage('#userUi');
					$('#welcome_header').text('Welcome, ' + username);
				}
				else {
					//give an error if there is one
					$('#error_on_sign_up').html(data);	
				}
			}
	});
	return false;
}

//logs out a user by removing them from the sessionStorage
function logOut() {
	console.log('here');
	sessionStorage.username = undefined;
	$('#username').val("");
	$('#password').val("");
	$('#sign_up_username').val("");
	$('#sign_up_password').val("");
	$.mobile.changePage('#intro');
}

//load trips to the user UI page on login
function loadTrips(username) {
	
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
							"<li><a href='#trip'><button class='existingTrip' >" + trips[i].name + "</button></a></li>"
						);
					}
				}
			}
	});
	return false;
}

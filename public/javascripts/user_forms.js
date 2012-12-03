$(function() {
	$("#login").submit(login);
	$("#signup").submit(signUp);
	} );

//function called when login form is submitted
function login() {
	
	//get text from fields on form
	var username = $('#username').val();
	var password = $('#password').val();
	
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
					loadTrips(username);
					$.mobile.changePage('#userUi');
					$('#welcome_header').text('Welcome, ' + username);
				}
				else {
					$('#error_on_log_in').html(data);
				}
			}
	});
	return false;
}


//function called when signup form is submitted
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
					loadTrips(username);
					$.mobile.changePage('#userUi');
					$('#welcome_header').text('Welcome, ' + username);
				}
				else {
					$('#error_on_sign_up').html(data);	
				}
			}
	});
	return false;
}

//load trips to the user UI page on login
function loadTrips(username) {
	$.ajax({
			url: "loadTrips",
			type: "get",
			data: {
				username: username
			},
			success: function(data) {
				if (data == 'You do not have any saved trips.') {
					$('#loadedTrips').append(data);
				}
				else {
					var trips = data.trips;
					
					$('#loadedTrips').empty();
	
					for (var i = 0; i < trips.length; i++) { 
						$('#loadedTrips').append('<li>' + trips[i].name + '</li>');
					}
				}
			}
	});
	return false;
}

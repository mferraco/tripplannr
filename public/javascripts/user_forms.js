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
					$.mobile.changePage('#userUi');
					$('#welcome_header').text('Welcome, ' + username);
				}
				else {
					$('.error').html(data);
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
				if (data == 'user saved') {
					$.mobile.changePage('#userUi');
				}
				else {
					$('.error').html(data);	
				}
			}
	});
	return false;
}

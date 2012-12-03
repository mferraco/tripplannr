$('#trip').live("pageshow", function() {
	console.log(sessionStorage.username);
	if (sessionStorage.username == "undefined" || sessionStorage.username == undefined) {
		$('#trip_hidePage').hide();
		$('#trip_not_logged_in').show();	
	}
	else {
		$('#trip_hidePage').show();
		$('#trip_not_logged_in').hide();	
	}
});

$('#categories').live("pageshow", function() {
	console.log(sessionStorage.username);
	if (sessionStorage.username == "undefined" || sessionStorage.username == undefined) {
		$('#categories_hidePage').hide();
		$('#categories_not_logged_in').show();	
	}
	else {
		$('#categories_hidePage').show();
		$('#categories_not_logged_in').hide();	
	}
});

$('#start_stop').live("pageshow", function() {
	console.log(sessionStorage.username);
	if (sessionStorage.username == "undefined" || sessionStorage.username == undefined) {
		$('#start_stop_hidePage').hide();
		$('#start_stop_not_logged_in').show();	
	}
	else {
		$('#start_stop_hidePage').show();
		$('#start_stop_not_logged_in').hide();	
	}
});

$('#userUi').live("pageshow", function() {
	console.log(sessionStorage.username);
	if (sessionStorage.username == "undefined" || sessionStorage.username == undefined) {
		$('#userUi_hidePage').hide();
		$('#userUi_not_logged_in').show();	
	}
	else {
		$('#userUi_hidePage').show();
		$('#userUi_not_logged_in').hide();	
	}
});
//functions which are evoked on actions by the user
$(function() {
	$("#start_planning").click(categoryRequest); //gets the list of categories to display
	$("#categoryForm").submit(attractionsRequest); //gets the attractions to display
	$(".attractionsForm").click(tripRequest); //gets the trip to display
	$('#saveTrip').click(getWaypoints); //gets the waypoints
	$('.existingTrip').live('click', function(event) { //must be 'live' because .existingTrip is added to the DOM dynamically
		var id = event.target.innerHTML;
		loadTrip(id); //in trip.js
	});
});

//the attractions that are selected by the user
var checkedAttractions = [];

//function called when the user enters a city and clicks the button
function categoryRequest() {
	//get city value from input
	var city = $('#city').val();
	
	//ajax request to evoke server side method trip_model.getCategories()
	$.ajax({
			url: "categoryRequest",
			type: "get",
			data: {
				city: city
			},
			success: function(data) {
				$.mobile.changePage('#categories');
			}
	});
	return false;
}


//function called when the user enters a city and clicks the button
//evokes the trip_model.getAttractions() methods
function attractionsRequest() {
	
	//find out whether the attraction was chosen or not
	var collegeuniv = $('#collegeuniv').is(':checked');
	var landmarks = $('#landmarks').is(':checked');
	var movietheaters = $('#movietheaters').is(':checked');
	var parks = $('#parks').is(':checked');
	var stadiumsarenas = $('#stadiumsarenas').is(':checked');
	var zoos = $('#zoos').is(':checked');
	
	var categories = [];
	
	//if it was chosen then push that onto the list of categories
	if (collegeuniv == true) {
		categories.push('collegeuniv');
	}
	if (landmarks == true) {
		categories.push('landmarks');
	}
	if (movietheaters == true) {
		categories.push('movietheaters');
	}
	if (parks == true) {
		categories.push('parks');
	}
	if (stadiumsarenas == true) {
		categories.push('stadiumsarenas');
	}
	if (zoos == true) {
		categories.push('zoos');
	}
	
	//ajax request
	$.ajax({
			url: "attractionsRequest",
			type: "get",
			data: {
				categories: categories,
				city: $('#city').val()
			},
			success: function(data) {	
				
				//gets all of the attractions from Yelp based on the city and categories chosen
				var categoryJSON = data.categoryJSON;

				//empty the attractions list so no old data is displayed in the view
				$('#attractionsList').empty();

			
				//set up each categories page (navbar to choose categories)(created in the js file because JQuery Mobile was screwing up styling)
				var count = 0;
				//loop through each category
				for (category in categoryJSON) {
					//add each page to the body
					$('body').append(
						//each page has an id of that category
						"<div data-role='page' id='" + categoryJSON[count].category + "' data-theme='a'>" + 
								"<div data-role='header' data-id='attractionsBar' data-position='fixed'>" +
									"<div data-role='navbar'>" + 
										"<ul class='attractionsList'>" +
										"</ul>" +
									"</div>" +
								"</div>" + 
								"<div class='checkboxesAttractions'>" + 
								//the div where the attractions for that category will be put
								"<div class='" + categoryJSON[count].category + "'></div>" +
								"</div>" + 
								"<a href='#trip'><button class='attractionsForm' onclick='tripRequest()'>Plan Now!</button></a>" +
								
						"</div>"
					);
					
				count++;	
				}
				
				
				//set each of the navbars with their list content
				var count = 0;
				for (category in categoryJSON) {
					//link for navbar to display categories
					var link = "#" + categoryJSON[count].category
					//add the navbar element to the navbar list
					$('.attractionsList').append("<li><a href = '" + link + 
						"'>" + categoryJSON[count].category + "</a></li>");
					count++;
				}
				
				//put the checkboxes onto the page
				var count = 0;
				//loop through all fo the categories
				for (category in categoryJSON) {
					for (var i = 0; i < categoryJSON[count].attractions.length; i++) {
						//put the checkbox in the div corresponding to that category
						var identifier = "." + categoryJSON[count].category
						$(identifier).append(
							"<label><input type='checkbox' id='" + categoryJSON[count].attractions[i] + "'>" + categoryJSON[count].attractions[i] + "</label>"
						);
					}
					count++
				}
				
				//create the link for the first category
				var catPage = '#' + categoryJSON[0].category

				//change to the attractions page for the first category
				$.mobile.changePage(catPage);
			}
	});
	return false;
}

//this function gets all of the attractions that were checked and adds them to an array
//then it calls the getTrip() method in trip.js which creates the map
function tripRequest() {

	//get all of the attractions on the form that were checked
	$(':checkbox', '.checkboxesAttractions').filter(':checked').each(function(){
    	checkedAttractions.push(this.id);
	});
	
	
	//call the method which sets up the map with the trip
	getTrip(checkedAttractions);
}

//calls the saveTrip() method in trip.js
function getWaypoints() {
	saveTrip(checkedAttractions);
}


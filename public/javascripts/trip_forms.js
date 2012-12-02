$(function() {
	$("#start_planning").click(categoryRequest);
	$("#categoryForm").submit(attractionsRequest);
	$(".attractionsForm").click(tripRequest);
} );

//function called when the user enters a city and clicks the button
function categoryRequest() {
	var city = $('#city').val();
	
	$.ajax({
			url: "categoryRequest",
			type: "get",
			data: {
				city: city
			},
			success: function(data) {
				$('#city').val(data);
				$.mobile.changePage('#categories');
			}
	});
	return false;
}


//function called when the user enters a city and clicks the button
function attractionsRequest() {
	var collegeuniv = $('#collegeuniv').is(':checked');
	var landmarks = $('#landmarks').is(':checked');
	var movietheaters = $('#movietheaters').is(':checked');
	var parks = $('#parks').is(':checked');
	var stadiumsarenas = $('#stadiumsarenas').is(':checked');
	var zoos = $('#zoos').is(':checked')
	
	var categories = [];
	
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
	
	$.ajax({
			url: "attractionsRequest",
			type: "get",
			data: {
				categories: categories,
				city: $('#city').val()
			},
			success: function(data) {	
				//set the category JSON from the JSON returned
				var categoryJSON = data.categoryJSON;
				//empty the attractions list
				$('#attractionsList').empty();

			
				//set up each categories page
				var count = 0;
				for (category in categoryJSON) {
					//add each page to the body
					$('body').append(
						"<div data-role='page' id='" + categoryJSON[count].category + "' data-theme='a'>" + 
								"<div data-role='header' data-id='attractionsBar' data-position='fixed'>" +
									"<div data-role='navbar'>" + 
										"<ul class='attractionsList'>" +
										"</ul>" +
									"</div>" +
								"</div>" + 
								"<div class='checkboxesAttractions'>" + 
								"<div class='" + categoryJSON[count].category + "'></div>" +
								"</div>" + 
								"<a href='#trip'><button class='attractionsForm' onclick='tripRequest()'>Plan Now!</button></a>" +
								
						"</div>"
					);
					
				count++;	
				}
				
				//clear the list of attractions in case the button gets clicked twice
				$('.attractionsList').empty();
				
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
				for (category in categoryJSON) {
					for (var i = 0; i < categoryJSON[count].attractions.length; i++) {
						var identifier = "." + categoryJSON[count].category
						$(identifier).append(
							"<label><input type='checkbox' id='" + categoryJSON[count].attractions[i] + "'>" + categoryJSON[count].attractions[i] + "</label>"
						);
					}
					count++
				}
				
				var catPage = '#' + categoryJSON[0].category
				//change to the attractions page
				$.mobile.changePage(catPage);
			}
	});
	return false;
}

function tripRequest() {
	var checkedAttractions = [];

	//get all of the attractions on the form that were checked
	$(':checkbox', '.checkboxesAttractions').filter(':checked').each(function(){
    	checkedAttractions.push(this.id);
	});
	
	
	//call the method which sets up the map with the trip
	getTrip(checkedAttractions);
}


//trying to select only 8
$(document).ready(function(){
	var maxChecks = 8;
	$('input').click(function(){
		console.log('CLICK')
		   //update checkCount 
	    checkCount = $(':checked').length;
	
	    if (checkCount >= maxChecks) {
	        //alert('you may only choose up to ' + maxChecks + ' options');
	        $(':checkbox[name=checkbox]').not(':checked').attr('disabled', true);
	    } else {
	        $(':checkbox[name=checkbox]:disabled').attr('disabled', false);
	    }
	})
});


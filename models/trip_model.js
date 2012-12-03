
//sets up yelp authentication as required by the module
var yelp = require("yelp").createClient({
  consumer_key: "JxvliTo7dOxlkfMH6CbhRA", 
  consumer_secret: "VDrmrG2Tbb2gMW5dpb6hDPrP6WQ",
  token: "02JQ43WdVVY7ywr5o-9zCQaunW2dP_R_",
  token_secret: "3OX1fAWsu61Y87O_BsuykKA1Pno"
});

//sets up the database which is deployed on nodejitsu
var databaseUrl = "mongodb://nodejitsu_mferraco:vvllmfjpmb9a0d8fta3j6g69km@ds043947.mongolab.com:43947/nodejitsu_mferraco_nodejitsudb7764651684";
var collections = ["users", "trips"];
var db = require("mongojs").connect(databaseUrl, collections);


//evoked by getCategories ajax request in trip_forms.js
exports.getCategories = function (req, res) {
	var city = req.query.city;
	res.render('city', {city: city});
}

//evoked by getAttractions ajax request in trip_forms.js
//gets attractions from Yelp API using module
exports.getAttractions = function(req, res) {

	var categories = req.query.categories;
	
	//loop through and turn into string to be used in query
	var catString = "";
	
	//set up the string of all the categories that need to be queried
	for (var i = 0; i < categories.length; i++) {
		catString += categories[i];
		if (i < categories.length - 1)
			catString+= ',';
	}
	
	//the city where the attractions need to be from
	var city = req.query.city;
	
	//yelp query
	yelp.search({location: city, category_filter: catString }, function(err, data) {
			//set up an empty category map
			categoryMap = {};
			
			//set each category mapped to an empty array which will hold its attractions
			for (var i = 0; i < categories.length; i++) {
				categoryMap[categories[i]] = [];
			}
			
			//if there are attractions returned from yelp
			if (data.businesses != undefined) {
				//set to list of returned attractions
				var returnedBusinesses = data.businesses.sort(sortNames);
				
				//loop through each attractions returned
				for (var i = 0; i < returnedBusinesses.length; i++) {
					//get all the categories for that business ex. ['Parks', 'parks']
					var businessesCategories = returnedBusinesses[i].categories;
					
					//loop through categories and add to map
					for (var j = 0; j < businessesCategories.length; j++) {
						//if the category map contains the category for that attraction then
						//add the attraction to the array for that category in the map
						if (categoryMap[businessesCategories[j][1]] != undefined) {
							categoryMap[businessesCategories[j][1]].push(data.businesses[i].name);
						}
					}
				}
			}
			
			//set up the JSON to be passed though a view back to the client side
			var categoryJSON = {};
			var count = 0;
			
			//loop through each category and add the attractions array to the JSON
			for (name in categoryMap) {
				categoryJSON[count] = {category: name, attractions: categoryMap[name]};
				count++;
			}
			

			//pass the map to the view to render the category tabs
			res.json('categories', {categoryJSON: categoryJSON});
	});	

} 


//custom sort so that i can sort the businesses returned by yelp by name
function sortNames(a, b){
//Compare "a" and "b" in some fashion, and return -1, 0, or 1
	if (a.name < b.name)
		return -1;
	else if (a.name > b.name)
		return 1;
	else
		return 0;
}

//saves a trip to the db
exports.saveTrip = function(req, res) {
	
	//get all the attributes of a trip
	var city = req.body.city;
	var start = req.body.start;
	var end = req.body.end;
	var waypoints = JSON.stringify(req.body.waypoints);
	var name = req.body.name;
	var username = req.body.username;
	var method = req.body.method;
	
	//give an error if they forgot to name their trip
	if (name == null || name == "") {
		res.render('error', {error: 'Enter a trip name before saving.'});
	}

	//give an error if that name already exists in the db
	db.trips.find({name: name}, function(err, trips) {
		if (trips.length > 0) {
			res.render('error', {error: 'Trip name already used.'})
		}
		else { 
			//save the trip to the db with all of the attributes
			db.trips.save({username: username, name: name, method: method, city: city, start: start, end: end, waypoints: waypoints}, function(err, saved) {
				if( err || !saved ) {
					res.render('error', {error: 'Trip not saved.'});
				}
				else {
					res.render('error', {error: 'Trip saved.'});
				}
			});
		}
	});
}


//load the trips for a user so they can be listed on the user home page
exports.loadTrips = function(req, res) {
	//get the username to find trips for
	var username = req.query.username;
	
	//find trips for that username
	db.trips.find({username: username}, function(err, trips) {
		if (trips.length == 0) {
			res.render('error', {error: 'You do not have any saved trips.'});
		}
		else {
			res.json('listOfTrips', {trips: trips});
		}
	});
}

//load a single trip when a user selects that trip from the list of saved trips
exports.loadTrip = function(req, res) {
	
	//get the username and name of trip to find
	var username = req.query.username;
	var name = req.query.tripName;
	
	//find that trip
	db.trips.find({username:username, name: name}, function (err, trips) {
		if (trips.length == 0) {
			res.render('error', {error: 'No trips by that name.'});
		}
		else {
			res.json('listOfTrips', {trip: trips});
		}
	});
}



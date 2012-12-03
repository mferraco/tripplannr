var yelp = require("yelp").createClient({
  consumer_key: "JxvliTo7dOxlkfMH6CbhRA", 
  consumer_secret: "VDrmrG2Tbb2gMW5dpb6hDPrP6WQ",
  token: "02JQ43WdVVY7ywr5o-9zCQaunW2dP_R_",
  token_secret: "3OX1fAWsu61Y87O_BsuykKA1Pno"
});

//set up database
var databaseUrl = "mydb"//"mongodb://nodejitsu_mferraco:vvllmfjpmb9a0d8fta3j6g69km@ds043947.mongolab.com:43947/nodejitsu_mferraco_nodejitsudb7764651684";
var collections = ["users", "trips"];
var db = require("mongojs").connect(databaseUrl, collections);



exports.getCategories = function (req, res) {
	var city = req.query.city;
	res.render('city', {city: city});
}

exports.getAttractions = function(req, res) {
	//get attractions from Yelp API with AJAX request
	
	var categories = req.query.categories;
	
	//loop through and turn into string to be used in query
	var catString = "";
	
	for (var i = 0; i < categories.length; i++) {
		catString += categories[i];
		if (i < categories.length - 1)
			catString+= ',';
	}
	var city = req.query.city;
	
	yelp.search({location: city, category_filter: catString }, function(err, data) {
			//set up the category map with an empty array value for each category key
			categoryMap = {};
			
			for (var i = 0; i < categories.length; i++) {
				categoryMap[categories[i]] = [];
			}

			if (data.businesses != undefined) {
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
			
			var categoryJSON = {};
			var count = 0;
			
			for (name in categoryMap) {
				categoryJSON[count] = {category: name, attractions: categoryMap[name]};
				count++;
			}
			

			//pass the map to the view to render the category tabs
			res.json('categories', {categoryJSON: categoryJSON});
	});	

} 


function sortNames(a, b){
//Compare "a" and "b" in some fashion, and return -1, 0, or 1
	if (a.name < b.name)
		return -1;
	else if (a.name > b.name)
		return 1;
	else
		return 0;
}

exports.saveTrip = function(req, res) {
	console.log(req.body.city);
	var city = req.body.city;
	var start = req.body.start;
	var end = req.body.end;
	var waypoints = JSON.stringify(req.body.waypoints);
	var name = req.body.name;
	var username = req.body.username;
	
	if (name == null || name == "") {
		res.render('error', {error: 'Enter a trip name before saving.'});
	}

	db.trips.find({name: name}, function(err, trips) {
		if (trips.length > 0) {
			res.render('error', {error: 'Trip name already used.'})
		}
		else { 
			db.trips.save({username: username, name: name, city: city, start: start, end: end, waypoints: waypoints}, function(err, saved) {
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


exports.loadTrips = function(req, res) {
	var username = req.query.username;
	
	db.trips.find({username: username}, function(err, trips) {
		if (trips.length == 0) {
			res.render('error', {error: 'You do not have any saved trips.'});
		}
		else {
			res.json('listOfTrips', {trips: trips});
		}
	});
}



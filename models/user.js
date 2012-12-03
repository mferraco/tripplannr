
//set up database
var databaseUrl = "mongodb://nodejitsu_mferraco:vvllmfjpmb9a0d8fta3j6g69km@ds043947.mongolab.com:43947/nodejitsu_mferraco_nodejitsudb7764651684";
var collections = ["users", "trips"];
var db = require("mongojs").connect(databaseUrl, collections);

exports.getDB = function() {
	return db;
}

//checks if user exists and logs them in
exports.login = function(req, res) {
	//username and password entered into form
	var username = req.query.user;
	var password = req.query.pass;
	
	//if the username and password and blank then give error
	if (username == "" || password == "") {
		res.render('error', {error: 'Username and Password fields must be filled.'});	
	}
	else {
		//find the user in the database
		db.users.find({username: username }, function(err, users) {
			
			if (users == undefined) { //wrong username
				res.render('error', {error: 'User does not exist.'});
			}
			else if (users[0].password == password) { //good log in
				res.render('trigger', {trigger: 'success'});	
			}
			else { //wrong password
				res.render('error', {error: 'Incorrect password.'});
			}
		});
	}
	
}

//signs up a new user
exports.signUp = function(req, res) {
	//username and password from the form
	var username = req.body.username;
	var password = req.body.password;
	
	//if no name or password is entered give error
	if ( username == "" || password == "") {
		res.render('error', {error: 'Username and Password fields must be filled.'})
	}
	
	//check if the username already exists in the database
	db.users.find({username: username}, function(err, users) {
		console.log(users);
		if (users.length > 0) {
			res.render('error', {error: 'Username already taken.'})
		}
		else { //username doesn't already exists so save user
			db.users.save({username: username, password: password}, function(err, saved) {
				if( err || !saved ) {
					res.render('error', {error: 'User not saved.'});
				}
				else {
					res.render('error', {error: 'User saved.'});
				}
			});
		}
	});
	
}


//set up database
var databaseUrl = "mydb";
var collections = ["users"]
var db = require("mongojs").connect(databaseUrl, collections);


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
			var user = users[0];
			
			if (user == undefined) { //wrong username
				res.render('error', {error: 'User does not exist.'});
			}
			else if (user.password == password) { //good log in
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
		if (users.length > 0) {
			res.render('error', {error: 'Username already taken.'})
		}
		else { //username doesn't already exists so save user
			db.users.save({username: username, password: password}, function(err, saved) {
				if( err || !saved ) {
					res.render('error', {error: 'user not saved'});
				}
				else {
					res.render('error', {error: 'user saved'});
				}
			});
		}
	});
	
}


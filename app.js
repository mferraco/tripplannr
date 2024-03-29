
/**
 * Module dependencies.
 */

//this file serves as the controller for the application
//it defines all routes throughout the application


var express = require('express')
  //, routes = require('./routes')
  , user = require('./models/user')
  , trip_model = require('./models/trip_model')
  , home = require('./routes/home')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//home page route
app.get('/', home.home);

//desktop login
app.get('/desktop', home.desktop)

//path for a user logging in
app.get('/loginRequest', user.login);

//path for a user signing up
app.put('/signUpRequest', user.signUp);

//path for when a user enters a city
app.get('/categoryRequest', trip_model.getCategories);
//path for when a user has selected attractions
app.get('/attractionsRequest', trip_model.getAttractions);

//path for when a user saves a trip
app.put('/saveTrip', trip_model.saveTrip);

//path for when the trips need loaded into the list on the users home page
app.get('/loadTrips', trip_model.loadTrips);
//path for when a single trip map needs loaded when a user selects it from saved trips
app.get('/loadTrip', trip_model.loadTrip);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var path = require('path');
var express = require('express');
var app = express();
var _ = require('underscore');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var fs = require('fs');
var authUser = require('./middlewares/authUser');
var user = require('./routes/user.js');
var page = require('./routes/page.js');
var ads = require('./routes/adds.js');
var event = require('./routes/event.js');
var admin = require('./routes/admin.js');
var reportProblem = require('./routes/reportProblem.js');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var session = require('client-sessions');

var port = process.env.PORT || 8082; // used to create, sign, and verify tokens
// use body parser so we can get info from POST and/or URL parameters

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true,parameterLimit:50000}));
//app.use(express.bodyParser({limit: '50mb'}));
 

mongoose.connect('mongodb://localhost/brolix');
app.use(express.static('assest'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/');
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 10 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
app.use(express.static(path.join(__dirname, 'assest')));


app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.use('/user', user);  
app.use('/page', page);
app.use('/ads', ads);
app.use('/event', event);  
app.use('/report', reportProblem);
app.use('/admin', admin);

 

// start the server 

app.listen(port);

console.log('http://localhost:' + port);

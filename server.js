var path = require('path');
var express = require('express');
app = express();
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
var chat = require('./file_handler/chat.js')();
var follower = require('./routes/followers.js');
var product = require('./routes/product.js');
var reportProblem = require('./routes/reportProblem.js');
var terms = require('./routes/termsConditions.js');
var tool = require('./routes/brolixAndDollors.js');
var pageFollow = require('./routes/pageFollow.js');
var mongoose = require('mongoose');
var logger = require('morgan');
mongoose.Promise = global.Promise;
var nodemailer = require('nodemailer');
var session = require('client-sessions');
var express = require('express'),
    i18n = require("i18n");


var port = process.env.PORT || 8082; // used to create, sign, and verify tokens
// use body parser so we can get info from POST and/or URL parameters

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));
//app.use(express.bodyParser({limit: '50mb'}));


mongoose.connect('mongodb://localhost/brolix');
app.use(express.static('assest'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/');
});
app.get('/', function(req, res) {
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
app.use('/follower', follower);
app.use('/product', product);
app.use('/terms', terms);
app.use('/tool', tool)
app.use('/pageFollow', pageFollow)

// start the server 

app.listen(port, '0.0.0.0');


console.log('http://localhost:' + port);

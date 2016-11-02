var path = require('path');
var user = require('./user');
var express = require('express');
var app = express();
var _ = require('underscore');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var fs = require('fs');
var authUser = require('./middlewares/authUser');

var port = process.env.PORT || 9000; // used to create, sign, and verify tokens
// use body parser so we can get info from POST and/or URL parameters

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
 


app.use(express.static('assest'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/');
});
app.get('/test', function(res,res){

  res.send("api works on ---->>>"+port);
})


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
//authUser.authUser,
app.post('/signup', user.signup);
app.post('/login', user.login);
app.post('/verifyOtp', user.verifyOtp);
app.post('/forgotPassword',user.forgotPassword);
app.get('/allUserDetails',user.allUserDetails);
app.post('/userProfile',user.userProfile);
app.put('/editProfile/:id',user.editProfile);
app.post('/createPage', user.createPage);
app.get('/showAllPages',user.showAllPages);
app.post('/showPageDetails',user.showPageDetails);
app.post('/createAds', user.createAds);
app.get('/showAllAdsData', user.showAllAdsData);
//app.get('/showAdsDetails', user.showAdsDetails);
app.post('/followList', user.followList);
app.post('/videoCount', user.videoCount);
app.post('/raffleJoin', user.raffleJoin);

 

// start the server 

app.listen(port);

console.log('http://localhost:' + port);

// Listen application request on port 3000

// var fs = require('fs');
// var https = require('https');
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

// var httpsServer = https.createServer(credentials, app);

// httpsServer.listen(port);

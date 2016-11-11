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

var port = process.env.PORT || 8082; // used to create, sign, and verify tokens
// use body parser so we can get info from POST and/or URL parameters

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true,parameterLimit:50000}));
//app.use(express.bodyParser({limit: '50mb'}));
 


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
app.put('/changePassword/:id',user.changePassword);
app.post('/createPage', user.createPage);
app.get('/showAllPages',user.showAllPages);
app.post('/showPageDetails',user.showPageDetails);
app.post('/createAds', user.createAds);
app.get('/showAllAdsData', user.showAllAdsData);
//app.get('/showAdsDetails', user.showAdsDetails);
app.post('/followUnfollow', user.followUnfollow);
app.post('/followerList', user.followerList);
app.post('/acceptFollowerRequest', user.acceptFollowerRequest);
app.post('/tagFriends', user.tagFriends);
app.post('/videoCount', user.videoCount);
app.post('/raffleJoin', user.raffleJoin);
app.post('/couponsSearch',user.couponsSearch);
app.post('/searchForCoupons',user.searchForCoupons);
app.post('/likeAndUnlike',user.likeAndUnlike);
app.post('/reportProblem',user.reportProblem);
app.post('/commentOnAds',user.commentOnAds);
app.post('/rplyOnComment',user.rplyOnComment);
app.post('/sendCoupon',user.sendCoupon);
app.post('/exchangeCoupon',user.exchangeCoupon);
app.post('/acceptExchangeCouponRequest',user.acceptExchangeCouponRequest);
//app.post('/otp',user.otp);
app.post('/luckCard', user.luckCard);
app.post('/redeemCash', user.redeemCash);

 

// start the server 

app.listen(port);

console.log('http://localhost:' + port);

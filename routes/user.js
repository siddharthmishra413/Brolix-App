var express = require('express');
var app = express();
var userHandler = require('../file_handler/user.js');



app.post('/signup', userHandler.signup);
app.post('/login', userHandler.login);
app.post('/verifyOtp', userHandler.verifyOtp);
app.get('/allUserDetails',userHandler.allUserDetails);
app.put('/editProfile/:id',userHandler.editProfile);
app.put('/changePassword/:id',userHandler.changePassword);
app.post('/forgotPassword',userHandler.forgotPassword);
app.post('/userProfile',userHandler.userProfile);
app.get('/detailsOfAdvertiser/:id',userHandler.detailsOfAdvertiser);
app.get('/listOfAllAdvertiser',userHandler.listOfAllAdvertiser);
app.post('/followUnfollow', userHandler.followUnfollow);
app.post('/followerList', userHandler.followerList);
app.post('/acceptFollowerRequest', userHandler.acceptFollowerRequest);
app.post('/tagFriends', userHandler.tagFriends);
app.post('/luckCard', userHandler.luckCard);
app.post('/redeemCash', userHandler.redeemCash);
app.post('/sendBrolixToFollower', userHandler.sendBrolixToFollower);
app.post('/sendCashToFollower', userHandler.sendCashToFollower);
app.post('/buyBrolix', userHandler.buyBrolix);
app.post('/rating', userHandler.rating);


module.exports = app;	
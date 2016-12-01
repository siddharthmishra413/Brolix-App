var express = require('express');
var app = express();
var userHandler = require('../file_handler/user.js');
var authUser = require('../middlewares/authUser');


app.post('/signup', userHandler.signup);
app.post('/login', userHandler.login);
app.post('/verifyOtp', userHandler.verifyOtp);
app.get('/allUserDetails',authUser.authUser,userHandler.allUserDetails);
app.put('/editProfile/:id',authUser.authUser,userHandler.editProfile);
//app.put('/changePassword/:id',authUser.authUser,userHandler.changePassword);
app.post('/changePassword',authUser.authUser,userHandler.changePassword);
app.post('/forgotPassword',authUser.authUser,userHandler.forgotPassword);
app.post('/userProfile',authUser.authUser,userHandler.userProfile);
app.get('/detailsOfAdvertiser/:id',authUser.authUser,userHandler.detailsOfAdvertiser);
app.get('/listOfAllAdvertiser',authUser.authUser,userHandler.listOfAllAdvertiser);
app.post('/followUnfollow', authUser.authUser,userHandler.followUnfollow);
app.post('/followerList', authUser.authUser,userHandler.followerList);
app.post('/acceptFollowerRequest', authUser.authUser,userHandler.acceptFollowerRequest);
app.post('/tagFriends', authUser.authUser,userHandler.tagFriends);
app.post('/luckCard', authUser.authUser,userHandler.luckCard);
app.post('/redeemCash', authUser.authUser,userHandler.redeemCash);
app.post('/sendBrolixToFollower', authUser.authUser,userHandler.sendBrolixToFollower);
app.post('/sendCashToFollower', authUser.authUser,userHandler.sendCashToFollower);
app.post('/buyBrolix', authUser.authUser,userHandler.buyBrolix);
app.post('/rating', authUser.authUser,userHandler.rating);
app.post('/filterToDateAndFromDate', authUser.authUser,userHandler.filterToDateAndFromDate);
app.post('/blockUser', authUser.authUser,userHandler.blockUser);
app.post('/updatePrivacy', authUser.authUser,userHandler.updatePrivacy);
app.post('/showPrivacy',authUser.authUser, userHandler.showPrivacy);
//app.post('/sendCash',authUser.authUser, userHandler.sendCash);


module.exports = app;	
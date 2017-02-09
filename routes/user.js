var express = require('express');
var app = express();
var userHandler = require('../file_handler/user.js');
var authUser = require('../middlewares/authUser');


app.post('/signup', userHandler.signup);
app.post('/login', userHandler.login);
app.post('/verifyOtp', userHandler.verifyOtp);
app.get('/allUserDetails',authUser.authUser,userHandler.allUserDetails);
app.put('/editProfile/:id',authUser.authUser,userHandler.editProfile);
app.post('/changePassword',authUser.authUser,userHandler.changePassword);
app.post('/forgotPassword',userHandler.forgotPassword);
app.post('/userProfile',authUser.authUser,userHandler.userProfile);
app.get('/detailsOfAdvertiser/:id',authUser.authUser,userHandler.detailsOfAdvertiser);
app.get('/listOfAllAdvertiser',authUser.authUser,userHandler.listOfAllAdvertiser);
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
app.get('/showAllBlockUser/:id',authUser.authUser, userHandler.showAllBlockUser);
app.post('/logout',authUser.authUser, userHandler.logout);
app.post('/purchaseUpgradeCard', authUser.authUser, userHandler.purchaseUpgradeCard);
app.post('/purchaseLuckCard', authUser.authUser, userHandler.purchaseLuckCard);
app.post('/showLuckCard', authUser.authUser, userHandler.showLuckCard);
app.post('/showUpgradeCard', authUser.authUser, userHandler.showUpgradeCard);
app.post('/useLuckCard', authUser.authUser, userHandler.useLuckCard);
app.post('/useUpgradeCard', authUser.authUser, userHandler.useUpgradeCard);
app.post('/facebookLogin',  authUser.authUser, userHandler.facebookLogin);
app.get('/countrys', userHandler.countrys);
app.get('/getAllStates/:name/:code', userHandler.getAllStates);
app.post('/chatHistory/:pageNumber',  authUser.authUser, userHandler.chatHistory);
app.post('/onlineUserList',  authUser.authUser, userHandler.onlineUserList);
app.post('/userGifts', authUser.authUser, userHandler.userGifts);
<<<<<<< HEAD


=======
>>>>>>> ab392163b8b2082e1779c15c8863c2e8881e9db2


module.exports = app;	
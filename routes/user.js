var express = require('express');
var app = express();
var userHandler = require('../file_handler/user.js');
var authUser = require('../middlewares/authUser');

app.post('/getCash', userHandler.getCash);


app.post('/massPay', userHandler.massPay);

app.post('/paynow', userHandler.paynow);

app.get('/validatorPaytabs', userHandler.validatorPaytabs);

app.post('/createToken', userHandler.createToken);

app.post('/Twocheckout', userHandler.Twocheckout);
app.post('/signup', userHandler.signup);
app.post('/login', userHandler.login);
app.post('/verifyOtp', userHandler.verifyOtp);
app.get('/allUserDetails/:id', authUser.authUser, userHandler.allUserDetails);
app.put('/editProfile/:id',authUser.authUser, userHandler.editProfile);
app.post('/changePassword', userHandler.changePassword);
app.post('/forgotPassword', userHandler.forgotPassword);
app.post('/userProfile', authUser.authUser, userHandler.userProfile);
app.get('/detailsOfAdvertiser/:id', authUser.authUser, userHandler.detailsOfAdvertiser);
app.get('/listOfAllAdvertiser', authUser.authUser, userHandler.listOfAllAdvertiser);
app.post('/tagFriends', authUser.authUser, userHandler.tagFriends);
app.post('/luckCard', authUser.authUser, userHandler.luckCard);
app.post('/sendBrolixToFollower', authUser.authUser, userHandler.sendBrolixToFollower);
app.post('/sendCashToFollower', authUser.authUser, userHandler.sendCashToFollower);
app.post('/rating', authUser.authUser, userHandler.rating);
app.post('/filterToDateAndFromDate', authUser.authUser, userHandler.filterToDateAndFromDate);
app.post('/blockUser', authUser.authUser, userHandler.blockUser);
app.post('/updatePrivacy', authUser.authUser, userHandler.updatePrivacy);
app.post('/showPrivacy', authUser.authUser, userHandler.showPrivacy);
app.get('/showAllBlockUser/:id', authUser.authUser, userHandler.showAllBlockUser);
app.post('/logout', authUser.authUser, userHandler.logout);
app.post('/purchaseUpgradeCard', userHandler.purchaseUpgradeCard);
app.post('/purchaseLuckCard', authUser.authUser, userHandler.purchaseLuckCard);
app.post('/showLuckCard', authUser.authUser, userHandler.showLuckCard);
app.post('/showUpgradeCard',  userHandler.showUpgradeCard);
app.post('/useLuckCard', authUser.authUser, userHandler.useLuckCard);
app.post('/useUpgradeCard', authUser.authUser, userHandler.useUpgradeCard);
app.post('/facebookLogin', userHandler.facebookLogin);
app.get('/countrys', userHandler.countrys);
app.get('/getAllStates/:name/:code', userHandler.getAllStates);
app.post('/chatHistory/:pageNumber', authUser.authUser, userHandler.chatHistory);
app.post('/onlineUserList', authUser.authUser, userHandler.onlineUserList);
app.get('/paymentClientToken', userHandler.paymentClientToken);
app.post('/paymentIntegration', userHandler.paymentIntegration);
app.post('/userCouponGifts', userHandler.userCouponGifts);
app.post('/winnersFilter', authUser.authUser, userHandler.winnersFilter);
app.post('/googleLogin', userHandler.googleLogin);
app.post('/buyCoupon', userHandler.buyCoupon);
app.post('/userCashGifts', authUser.authUser, userHandler.userCashGifts);
app.post('/addRemoveCouponFromFavourite', userHandler.addRemoveCouponFromFavourite);
app.post('/listOfFavouriteCoupon/:pageNumber', authUser.authUser, userHandler.listOfFavouriteCoupon);
app.post('/couponExchangeOnOff', authUser.authUser, userHandler.couponExchangeOnOff);
app.post('/sendCouponExchangeRequest', authUser.authUser, userHandler.sendCouponExchangeRequest);
app.post('/sendCouponToFollower', authUser.authUser, userHandler.sendCouponToFollower);
app.post('/registerWithRefferalCode/:pageNumber', authUser.authUser, userHandler.registerWithRefferalCode);
app.post('/seeExchangeRequest', userHandler.seeExchangeRequest);
app.post('/couponRequestsSearch', authUser.authUser, userHandler.couponRequestsSearch);
app.post('/acceptDeclineCouponRequest', authUser.authUser, userHandler.acceptDeclineCouponRequest);
app.post('/useCouponWithoutCode', userHandler.useCouponWithoutCode);
app.post('/winnersFilterCodeBasis', userHandler.winnersFilterCodeBasis)
app.post('/useCouponWithCode', authUser.authUser, userHandler.useCouponWithCode);
app.post('/seeExchangeSentRequest', authUser.authUser, userHandler.seeExchangeSentRequest);
app.post('/savePaymentRequest', userHandler.savePaymentRequest);
app.post('/userCashGifts', authUser.authUser, userHandler.userCashGifts);
app.post('/blockUserSearch', authUser.authUser, userHandler.blockUserSearch);
app.post('/userNotification', userHandler.userNotification);
app.post('/couponExchangeOff', userHandler.couponExchangeOff);


app.post('/payU', userHandler.payU)


module.exports = app;

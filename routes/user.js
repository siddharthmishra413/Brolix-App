var express = require('express');
var app = express();
var userHandler = require('../file_handler/user.js');
var authUser = require('../middlewares/authUser');

app.post('/getCash', userHandler.getCash);


app.post('/massPay', userHandler.massPay);

app.post('/paynow', userHandler.paynow);

app.get('/validatorPaytabs/:lang', userHandler.validatorPaytabs);
app.post('/sendOtp', userHandler.sendOtp);

app.post('/createToken', userHandler.createToken);

app.post('/Twocheckout', userHandler.Twocheckout);
app.post('/signup', userHandler.signup);
app.post('/signup', userHandler.signup);
app.post('/login', userHandler.login);
app.post('/verifyOtp', userHandler.verifyOtp);
app.get('/allUserDetails/:id/:lang', userHandler.allUserDetails);
app.put('/editProfile/:id', userHandler.editProfile);
app.post('/changePassword', userHandler.changePassword);
app.post('/forgotPassword', userHandler.forgotPassword);
app.post('/userProfile',  userHandler.userProfile);
app.get('/detailsOfAdvertiser/:id/:lang',  userHandler.detailsOfAdvertiser);
app.get('/listOfAllAdvertiser/:lang',  userHandler.listOfAllAdvertiser);
app.post('/tagFriends',  userHandler.tagFriends);
app.post('/luckCard',  userHandler.luckCard);
app.post('/sendBrolixToFollower',  userHandler.sendBrolixToFollower);
app.post('/sendCashToFollower',  userHandler.sendCashToFollower);
app.post('/rating',  userHandler.rating);
app.post('/filterToDateAndFromDate',  userHandler.filterToDateAndFromDate);
app.post('/blockUser',  userHandler.blockUser);
app.post('/updatePrivacy',  userHandler.updatePrivacy);
app.post('/showPrivacy',  userHandler.showPrivacy);
app.get('/showAllBlockUser/:id/:lang',  userHandler.showAllBlockUser);
app.post('/logout',  userHandler.logout);
app.post('/purchaseUpgradeCard',  userHandler.purchaseUpgradeCard);
app.post('/purchaseLuckCard',  userHandler.purchaseLuckCard);
app.post('/showLuckCard',  userHandler.showLuckCard);
app.post('/showUpgradeCard',  userHandler.showUpgradeCard);
app.post('/useLuckCard',  userHandler.useLuckCard);
app.post('/useUpgradeCard',  userHandler.useUpgradeCard);
app.post('/facebookLogin', userHandler.facebookLogin);
app.get('/countrys/:lang', userHandler.countrys);
app.get('/getAllStates/:name/:code/:lang',  userHandler.getAllStates);
app.post('/chatHistory/:pageNumber',  userHandler.chatHistory);
app.post('/onlineUserList',  userHandler.onlineUserList);
app.get('/paymentClientToken/:lang', userHandler.paymentClientToken);
app.post('/paymentIntegration', userHandler.paymentIntegration);
app.post('/userCouponGifts', userHandler.userCouponGifts);
app.post('/winnersFilter',  userHandler.winnersFilter);
app.post('/googleLogin', userHandler.googleLogin);
app.post('/buyCoupon', userHandler.buyCoupon);
app.post('/userCashGifts',  userHandler.userCashGifts);
app.post('/addRemoveCouponFromFavourite', userHandler.addRemoveCouponFromFavourite);
app.post('/listOfFavouriteCoupon/:id/:pageNumber',  userHandler.listOfFavouriteCoupon);
app.post('/couponExchangeOnOff',  userHandler.couponExchangeOnOff);
app.post('/sendCouponExchangeRequest',  userHandler.sendCouponExchangeRequest);
app.post('/sendCouponToFollower',  userHandler.sendCouponToFollower);
app.post('/registerWithRefferalCode/:id/:pageNumber',  userHandler.registerWithRefferalCode);
app.post('/seeExchangeRequest', userHandler.seeExchangeRequest);
app.post('/couponRequestsSearch',  userHandler.couponRequestsSearch);
app.post('/acceptDeclineCouponRequest',  userHandler.acceptDeclineCouponRequest);
app.post('/useCouponWithoutCode', userHandler.useCouponWithoutCode);
app.post('/winnersFilterCodeBasis', userHandler.winnersFilterCodeBasis)
app.post('/useCouponWithCode',  userHandler.useCouponWithCode);
app.post('/seeExchangeSentRequest',  userHandler.seeExchangeSentRequest);
app.post('/savePaymentRequest', userHandler.savePaymentRequest);
app.post('/userCashGifts',  userHandler.userCashGifts);
app.post('/blockUserSearch',  userHandler.blockUserSearch);
app.post('/userNotification',  userHandler.userNotification);
app.post('/couponExchangeOff',  userHandler.couponExchangeOff);
app.post('/sendPaymentHistoryOnMailId',  userHandler.sendPaymentHistoryOnMailId);
app.post('/updateLive',  userHandler.updateLive);
app.post('/cancelExchangeCouponRequest', userHandler.cancelExchangeCouponRequest);
app.post('/sendMessage', userHandler.sendMessage);
app.post('/pageInboxChat', userHandler.pageInboxChat);



app.post('/payU', userHandler.payU)


module.exports = app;

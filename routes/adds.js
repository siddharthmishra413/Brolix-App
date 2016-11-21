var express = require('express');
var app = express();
var adsHandler = require('../file_handler/ads.js');
var authUser = require('../middlewares/authUser');


app.post('/createAds', authUser.authUser,adsHandler.createAds);
app.put('/applyCoupon/:id',authUser.authUser,adsHandler.applyCoupon);
app.get('/showAllAdsData', authUser.authUser,adsHandler.showAllAdsData);
app.post('/videoCount', authUser.authUser,adsHandler.videoCount);
app.post('/raffleJoin', authUser.authUser,adsHandler.raffleJoin);
app.post('/couponsSearch',authUser.authUser,adsHandler.couponsSearch); //Not in docs
app.post('/searchForCoupons',authUser.authUser,adsHandler.searchForCoupons);
app.post('/likeAndUnlike',authUser.authUser,adsHandler.likeAndUnlike);
app.post('/commentOnAds',authUser.authUser,adsHandler.commentOnAds);
app.post('/replyOnComment',authUser.authUser,adsHandler.replyOnComment);
app.post('/sendCoupon',authUser.authUser,adsHandler.sendCoupon);
app.post('/exchangeCoupon',authUser.authUser,adsHandler.exchangeCoupon);
app.post('/acceptExchangeCouponRequest',authUser.authUser,adsHandler.acceptExchangeCouponRequest);
app.post('/socialShare', authUser.authUser,adsHandler.socialShare);
app.get('/winners', authUser.authUser,adsHandler.winners);

module.exports = app;
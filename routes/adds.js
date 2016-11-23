var express = require('express');
var app = express();
var adsHandler = require('../file_handler/ads.js');
var authUser = require('../middlewares/authUser');


<<<<<<< HEAD
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
=======
app.post('/createAds', adsHandler.createAds);
app.put('/applyCoupon/:id',adsHandler.applyCoupon);
app.get('/showAllAdsData', adsHandler.showAllAdsData);
app.post('/videoCount', adsHandler.videoCount);
app.post('/raffleJoin', adsHandler.raffleJoin);
app.post('/couponsSearch',adsHandler.couponsSearch); //Not in docs
app.post('/searchForCoupons',adsHandler.searchForCoupons);
app.post('/likeAndUnlike',adsHandler.likeAndUnlike);
app.post('/commentOnAds',adsHandler.commentOnAds);
app.post('/replyOnComment',adsHandler.replyOnComment);
app.post('/sendCoupon',adsHandler.sendCoupon);
app.post('/exchangeCoupon',adsHandler.exchangeCoupon);
app.post('/acceptExchangeCouponRequest',adsHandler.acceptExchangeCouponRequest);
app.post('/socialShare', adsHandler.socialShare);
app.post('/upgradeCard',adsHandler.upgradeCard);
app.get('/winners', adsHandler.winners);
>>>>>>> deepak

module.exports = app;
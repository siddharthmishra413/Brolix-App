var express = require('express');
var app = express();
var adsHandler = require('../file_handler/ads.js');


app.post('/createAds', adsHandler.createAds);
app.put('/applyCoupon/:id',adsHandler.applyCoupon);
app.get('/showAllAdsData', adsHandler.showAllAdsData);
app.post('/videoCount', adsHandler.videoCount);
app.post('/raffleJoin', adsHandler.raffleJoin);
app.post('/couponsSearch',adsHandler.couponsSearch);
app.post('/searchForCoupons',adsHandler.searchForCoupons);
app.post('/likeAndUnlike',adsHandler.likeAndUnlike);
app.post('/commentOnAds',adsHandler.commentOnAds);
app.post('/replyOnComment',adsHandler.replyOnComment);
app.post('/sendCoupon',adsHandler.sendCoupon);
app.post('/exchangeCoupon',adsHandler.exchangeCoupon);
app.post('/acceptExchangeCouponRequest',adsHandler.acceptExchangeCouponRequest);
app.post('/socialShare', adsHandler.socialShare);

module.exports = app;
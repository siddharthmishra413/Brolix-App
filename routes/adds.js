var express = require('express');
var app = express();
var adsHandler = require('../file_handler/ads.js');
var authUser = require('../middlewares/authUser');


app.post('/createAds', authUser.authUser, adsHandler.createAds);
app.put('/applyCoupon/:id', authUser.authUser, adsHandler.applyCoupon);
app.get('/showAllAdsCouponType/:id/:pageNumber', authUser.authUser, adsHandler.showAllAdsCouponType);
app.get('/showAllAdsCashType/:id/:pageNumber', authUser.authUser, adsHandler.showAllAdsCashType);
app.post('/couponsSearch', authUser.authUser, adsHandler.couponsSearch); //Not in docs
app.post('/searchForCoupons/:pageNumber', authUser.authUser, adsHandler.searchForCoupons);
app.post('/likeAndUnlike', authUser.authUser, adsHandler.likeAndUnlike);
app.post('/commentOnAds', authUser.authUser, adsHandler.commentOnAds);
app.post('/replyOnComment', authUser.authUser, adsHandler.replyOnComment);
app.post('/sendCoupon', authUser.authUser, adsHandler.sendCoupon);
app.post('/exchangeCoupon', authUser.authUser, adsHandler.exchangeCoupon);
app.post('/acceptExchangeCouponRequest', authUser.authUser, adsHandler.acceptExchangeCouponRequest);
app.post('/socialShare', authUser.authUser, adsHandler.socialShare);
app.get('/winners', authUser.authUser, adsHandler.winners);
app.post('/listOfAds', authUser.authUser, adsHandler.listOfAds);
app.get('/listOfAllAds/:id/:type/:pageNumber', authUser.authUser, adsHandler.listOfAllAds);
app.post('/uploads', authUser.authUser, adsHandler.uploads);
app.post('/viewAd', authUser.authUser, adsHandler.viewAd);
app.post('/adFollowUnfollow', authUser.authUser, adsHandler.adFollowUnfollow);
app.get('/couponWinners/:pageNumber', authUser.authUser, adsHandler.couponWinners);
app.get('/cashWinners/:pageNumber', authUser.authUser, adsHandler.cashWinners);
app.get('/adsCommentList/:id/:pageNumber', authUser.authUser, adsHandler.adsCommentList);
app.post('/tagOnads', authUser.authUser, adsHandler.tagOnads);
app.put('/editAd/:id/:userId', authUser.authUser, adsHandler.editAd);
app.post('/adsDateFilter',authUser.authUser,adsHandler.adsDateFilter);
app.post('/searchAds',authUser.authUser,adsHandler.searchAds)
app.post('/couponFilter',authUser.authUser,adsHandler.couponFilter)

module.exports = app;

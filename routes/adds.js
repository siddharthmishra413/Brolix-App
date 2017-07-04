var express = require('express');
var app = express();
var adsHandler = require('../file_handler/ads.js');
var authUser = require('../middlewares/authUser');


app.post('/deleteComments', adsHandler.deleteComments);
app.post('/editComments', adsHandler.editComments);

app.post('/removeAds', adsHandler.removeAds);

app.post('/continueAd', adsHandler.continueAd);

app.get('/getMp3Files', adsHandler.getMp3Files);
app.post('/uploadMp3Files', adsHandler.uploadMp3Files);

app.post('/createAdPayment', adsHandler.createAdPayment);

app.post('/createAds', adsHandler.createAds);
app.put('/applyCoupon/:id', authUser.authUser, adsHandler.applyCoupon);
app.get('/showAllAdsCouponType/:id/:pageNumber', adsHandler.showAllAdsCouponType);
app.get('/showAllAdsCashType/:id/:pageNumber', adsHandler.showAllAdsCashType);
app.post('/couponsSearch', authUser.authUser, adsHandler.couponsSearch); //Not in docs
app.post('/searchForCoupons/:pageNumber', adsHandler.searchForCoupons);
app.post('/likeAndUnlike', authUser.authUser, adsHandler.likeAndUnlike);
app.post('/commentOnAds', authUser.authUser, adsHandler.commentOnAds);
app.post('/replyOnComment', authUser.authUser, adsHandler.replyOnComment);
app.post('/sendCoupon', authUser.authUser, adsHandler.sendCoupon);
app.post('/exchangeCoupon', authUser.authUser, adsHandler.exchangeCoupon);
app.post('/acceptExchangeCouponRequest', authUser.authUser, adsHandler.acceptExchangeCouponRequest);
app.post('/socialShare', authUser.authUser, adsHandler.socialShare);
app.get('/winners', authUser.authUser, adsHandler.winners);
app.post('/listOfAds',  adsHandler.listOfAds);
app.get('/listOfAllAds/:pageId/:type/:pageNumber',  adsHandler.listOfAllAds);
app.post('/uploads', adsHandler.uploads);
app.post('/viewAd', adsHandler.viewAd);
app.post('/adFollowUnfollow', authUser.authUser, adsHandler.adFollowUnfollow);
app.get('/couponWinners/:pageNumber', adsHandler.couponWinners);
app.get('/cashWinners/:pageNumber',  adsHandler.cashWinners);
app.get('/adsCommentList/:id/:pageNumber', adsHandler.adsCommentList);
app.post('/tagOnads', authUser.authUser, adsHandler.tagOnads);
app.put('/editAd/:id/:userId', adsHandler.editAd);
app.post('/adsDateFilter/:id/:pageNumber', authUser.authUser, adsHandler.adsDateFilter);
app.post('/particularPageCouponAdsFilter/:pageNumber', adsHandler.particularPageCouponAdsFilter);
app.post('/couponFilter/:pageNumber', adsHandler.couponFilter);
app.post('/couponGiftsFilter', authUser.authUser, adsHandler.couponGiftsFilter);
app.post('/cashGiftsFilter', authUser.authUser, adsHandler.cashGiftsFilter);
app.get('/storeCouponList/:id/:pageNumber', adsHandler.storeCouponList);
app.post('/viewCoupon',  adsHandler.viewCoupon);
app.post('/PageCouponFilter/:pageNumber', adsHandler.PageCouponFilter);
app.post('/StoreFavCouponFilter/:pageNumber', adsHandler.StoreFavCouponFilter);
app.post('/couponWinnersDateFilter/:pageNumber', adsHandler.couponWinnersDateFilter);
app.post('/cashWinnersDateFilter/:pageNumber', adsHandler.cashWinnersDateFilter);
app.post('/adsViewClick', adsHandler.adsViewClick);
app.post('/adStatistics', adsHandler.adStatistics);
app.post('/adStatisticsFilterClick', adsHandler.adStatisticsFilterClick);
app.post('/couponStatisticsYearClicks', adsHandler.couponStatisticsYearClicks);
app.post('/CouponAdStatistics', adsHandler.CouponAdStatistics);
app.post('/CashAdStatistics', adsHandler.CashAdStatistics);
app.post('/cashStatisticsYearClicks', adsHandler.cashStatisticsYearClicks);
app.post('/homepageAds', adsHandler.homepageAds);
app.get('/storeCouponPrice/:id', adsHandler.storeCouponPrice);
app.put('/updateCash/:id', adsHandler.updateCash);
app.post('/allAreWinners', adsHandler.allAreWinners);
app.post('/targetedOrNottargeted', adsHandler.targetedOrNottargeted);

module.exports = app;

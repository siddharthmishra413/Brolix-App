var express = require('express');
var app = express();
var adsHandler = require('../file_handler/ads.js');
var authUser = require('../middlewares/authUser');


app.post('/deleteComments',authUser.authUser, adsHandler.deleteComments);
app.post('/editComments',adsHandler.editComments);
app.post('/editCommentsOnPage',adsHandler.editCommentsOnPage);

app.post('/removeAds',adsHandler.removeAds);

app.post('/continueAd',adsHandler.continueAd);

app.get('/getMp3Files/:lang',adsHandler.getMp3Files);
app.post('/uploadMp3Files',adsHandler.uploadMp3Files);

app.post('/createAdPayment',adsHandler.createAdPayment);
app.post('/readFile',adsHandler.readFile);
app.post('/uploadXlFile',adsHandler.uploadXlFile);


app.post('/createAds',adsHandler.createAds);
app.put('/applyCoupon/:id', adsHandler.applyCoupon);
app.get('/showAllAdsCouponType/:id/:pageNumber/:lang', adsHandler.showAllAdsCouponType);
app.get('/showAllAdsCashType/:id/:pageNumber/:lang', adsHandler.showAllAdsCashType);
app.post('/couponsSearch', adsHandler.couponsSearch); //Not in docs
app.post('/searchForCoupons/:id/:pageNumber', adsHandler.searchForCoupons);
app.post('/likeAndUnlike', adsHandler.likeAndUnlike);
app.post('/commentOnAds', adsHandler.commentOnAds);
app.post('/replyOnComment', adsHandler.replyOnComment);
app.post('/sendCoupon', adsHandler.sendCoupon);
app.post('/exchangeCoupon', adsHandler.exchangeCoupon);
app.post('/acceptExchangeCouponRequest', adsHandler.acceptExchangeCouponRequest);
app.post('/socialShare', adsHandler.socialShare);
app.get('/winners/:lang', adsHandler.winners);
app.post('/listOfAds', adsHandler.listOfAds);
app.get('/listOfAllAds/:pageId/:type/:pageNumber/:lang', adsHandler.listOfAllAds);
app.post('/uploads',adsHandler.uploads);
app.post('/viewAd',adsHandler.viewAd);
app.post('/adFollowUnfollow',adsHandler.adFollowUnfollow);
app.get('/couponWinners/:id/:pageNumber/:lang',adsHandler.couponWinners);
app.get('/cashWinners/:id/:pageNumber/:lang', adsHandler.cashWinners);
app.get('/adsCommentList/:id/:type/:userId/:pageNumber/:lang',adsHandler.adsCommentList);
app.post('/tagOnads', adsHandler.tagOnads);
app.put('/editAd/:id/:userId',adsHandler.editAd);
app.post('/adsDateFilter/:id/:pageNumber', adsHandler.adsDateFilter);
app.post('/particularPageCouponAdsFilter/:pageNumber', adsHandler.particularPageCouponAdsFilter);
app.post('/couponFilter/:pageNumber',authUser.authUser,adsHandler.couponFilter);
app.post('/couponGiftsFilter', adsHandler.couponGiftsFilter);
app.post('/cashGiftsFilter', adsHandler.cashGiftsFilter);
app.get('/storeCouponList/:id/:pageNumber/:lang',adsHandler.storeCouponList);
app.post('/viewCoupon', adsHandler.viewCoupon);
app.post('/PageCouponFilter/:id/:pageNumber',authUser.authUser, adsHandler.PageCouponFilter);
app.post('/StoreFavCouponFilter/:id/:pageNumber',adsHandler.StoreFavCouponFilter);
app.post('/couponWinnersDateFilter/:id/:pageNumber',authUser.authUser, adsHandler.couponWinnersDateFilter);
app.post('/cashWinnersDateFilter/:id/:pageNumber',adsHandler.cashWinnersDateFilter);
app.post('/adsViewClick', adsHandler.adsViewClick);
app.post('/adStatistics', adsHandler.adStatistics);
app.post('/adStatisticsFilterClick', adsHandler.adStatisticsFilterClick);
app.post('/couponStatisticsYearClicks', adsHandler.couponStatisticsYearClicks);
app.post('/CouponAdStatistics', adsHandler.CouponAdStatistics);
app.post('/CashAdStatistics', adsHandler.CashAdStatistics);
app.post('/cashStatisticsYearClicks', adsHandler.cashStatisticsYearClicks);
app.post('/homepageAds', adsHandler.homepageAds);
app.get('/storeCouponPrice/:id/:lang', adsHandler.storeCouponPrice);
app.put('/updateCash/:id', adsHandler.updateCash);
app.post('/allAreWinners', adsHandler.allAreWinners);
app.post('/targetedOrNottargeted',adsHandler.targetedOrNottargeted);
app.get('/testingPriority/:id/:pageNumber/:lang', adsHandler.testingPriority);

module.exports = app;

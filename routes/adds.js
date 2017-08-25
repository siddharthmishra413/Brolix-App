var express = require('express');
var app = express();
var adsHandler = require('../file_handler/ads.js');
var authUser = require('../middlewares/authUser');


app.post('/deleteComments',authUser.authUser, adsHandler.deleteComments);
app.post('/editComments', authUser.authUser,adsHandler.editComments);
app.post('/editCommentsOnPage', authUser.authUser,adsHandler.editCommentsOnPage);

app.post('/removeAds', authUser.authUser,adsHandler.removeAds);

app.post('/continueAd', authUser.authUser,adsHandler.continueAd);

app.get('/getMp3Files/:lang', authUser.authUser,adsHandler.getMp3Files);
app.post('/uploadMp3Files', authUser.authUser,adsHandler.uploadMp3Files);

app.post('/createAdPayment', authUser.authUser,adsHandler.createAdPayment);
app.post('/readFile', authUser.authUser,adsHandler.readFile);
app.post('/uploadXlFile', authUser.authUser,adsHandler.uploadXlFile);


app.post('/createAds', authUser.authUser,adsHandler.createAds);
app.put('/applyCoupon/:id', authUser.authUser, adsHandler.applyCoupon);
app.get('/showAllAdsCouponType/:id/:pageNumber/:lang', adsHandler.showAllAdsCouponType);
app.get('/showAllAdsCashType/:id/:pageNumber/:lang', adsHandler.showAllAdsCashType);
app.post('/couponsSearch', authUser.authUser, adsHandler.couponsSearch); //Not in docs
app.post('/searchForCoupons/:id/:pageNumber', adsHandler.searchForCoupons);
app.post('/likeAndUnlike', authUser.authUser, adsHandler.likeAndUnlike);
app.post('/commentOnAds', adsHandler.commentOnAds);
app.post('/replyOnComment', authUser.authUser, adsHandler.replyOnComment);
app.post('/sendCoupon', authUser.authUser, adsHandler.sendCoupon);
app.post('/exchangeCoupon', authUser.authUser, adsHandler.exchangeCoupon);
app.post('/acceptExchangeCouponRequest', authUser.authUser, adsHandler.acceptExchangeCouponRequest);
app.post('/socialShare', authUser.authUser, adsHandler.socialShare);
app.get('/winners/:lang', authUser.authUser, adsHandler.winners);
app.post('/listOfAds', authUser.authUser, adsHandler.listOfAds);
app.get('/listOfAllAds/:pageId/:type/:pageNumber/:lang', authUser.authUser, adsHandler.listOfAllAds);
app.post('/uploads', authUser.authUser,adsHandler.uploads);
app.post('/viewAd', authUser.authUser,adsHandler.viewAd);
app.post('/adFollowUnfollow', authUser.authUser,adsHandler.adFollowUnfollow);
app.get('/couponWinners/:id/:pageNumber/:lang', authUser.authUser,adsHandler.couponWinners);
app.get('/cashWinners/:id/:pageNumber/:lang', authUser.authUser, adsHandler.cashWinners);
app.get('/adsCommentList/:id/:type/:userId/:pageNumber/:lang', authUser.authUser,adsHandler.adsCommentList);
app.post('/tagOnads', authUser.authUser, adsHandler.tagOnads);
app.put('/editAd/:id/:userId', authUser.authUser,adsHandler.editAd);
app.post('/adsDateFilter/:id/:pageNumber', authUser.authUser, adsHandler.adsDateFilter);
app.post('/particularPageCouponAdsFilter/:pageNumber', adsHandler.particularPageCouponAdsFilter);
app.post('/couponFilter/:pageNumber',authUser.authUser,adsHandler.couponFilter);
app.post('/couponGiftsFilter', authUser.authUser, adsHandler.couponGiftsFilter);
app.post('/cashGiftsFilter', authUser.authUser, adsHandler.cashGiftsFilter);
app.get('/storeCouponList/:id/:pageNumber/:lang', authUser.authUser,adsHandler.storeCouponList);
app.post('/viewCoupon', authUser.authUser, adsHandler.viewCoupon);
app.post('/PageCouponFilter/:id/:pageNumber',authUser.authUser, adsHandler.PageCouponFilter);
app.post('/StoreFavCouponFilter/:id/:pageNumber', authUser.authUser,adsHandler.StoreFavCouponFilter);
app.post('/couponWinnersDateFilter/:id/:pageNumber',authUser.authUser, adsHandler.couponWinnersDateFilter);
app.post('/cashWinnersDateFilter/:id/:pageNumber', authUser.authUser,adsHandler.cashWinnersDateFilter);
app.post('/adsViewClick', authUser.authUser, adsHandler.adsViewClick);
app.post('/adStatistics', authUser.authUser, adsHandler.adStatistics);
app.post('/adStatisticsFilterClick', authUser.authUser, adsHandler.adStatisticsFilterClick);
app.post('/couponStatisticsYearClicks', authUser.authUser, adsHandler.couponStatisticsYearClicks);
app.post('/CouponAdStatistics', authUser.authUser, adsHandler.CouponAdStatistics);
app.post('/CashAdStatistics', authUser.authUser, adsHandler.CashAdStatistics);
app.post('/cashStatisticsYearClicks', authUser.authUser, adsHandler.cashStatisticsYearClicks);
app.post('/homepageAds', authUser.authUser, adsHandler.homepageAds);
app.get('/storeCouponPrice/:id/:lang', authUser.authUser, adsHandler.storeCouponPrice);
app.put('/updateCash/:id', authUser.authUser, adsHandler.updateCash);
app.post('/allAreWinners', authUser.authUser, adsHandler.allAreWinners);
app.post('/targetedOrNottargeted', authUser.authUser,adsHandler.targetedOrNottargeted);
app.get('/testingPriority/:id/:pageNumber/:lang', authUser.authUser, adsHandler.testingPriority);

module.exports = app;

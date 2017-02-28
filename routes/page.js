var express = require('express');
var app = express();
var pageHandler = require('../file_handler/page.js');
var authUser = require('../middlewares/authUser');



app.post('/createPage', pageHandler.createPage);
app.get('/showAllPages/:pageNumber', authUser.authUser, pageHandler.showAllPages);
app.get('/showAllOtherUserPages/:id/:pageNumber', authUser.authUser, pageHandler.showAllOtherUserPages);
app.post('/showPageDetails', authUser.authUser, pageHandler.showPageDetails);
app.get('/showPageBusinessType/:id/:pageNumber', authUser.authUser, pageHandler.showPageBusinessType);
app.get('/showPageFavouriteType/:id/:pageNumber', authUser.authUser, pageHandler.showPageFavouriteType);
app.put('/editPage/:id', authUser.authUser, pageHandler.editPage);
app.post('/deletePage', authUser.authUser, pageHandler.deletePage);
app.post('/pagesSearch/:pageNumber', authUser.authUser, pageHandler.pagesSearch); //Not Update in Docs
app.post('/pageFollowUnfollow', authUser.authUser, pageHandler.pageFollowUnfollow); //Not Update in Docs
app.post('/searchForPages/:pageNumber', authUser.authUser, pageHandler.searchForPages); //Not Upadte in Docs
app.post('/pageRating', authUser.authUser, pageHandler.pageRating);
app.get('/showBlockedPage/:pageNumber', authUser.authUser, pageHandler.showBlockedPage);
app.post('/removePage', authUser.authUser, pageHandler.removePage);
app.get('/showAllRemovedPage/:pageNumber', authUser.authUser, pageHandler.showAllRemovedPage);
app.post('/linkSocialMedia', authUser.authUser, pageHandler.linkSocialMedia);
app.post('/getSocialMediaLink', authUser.authUser, pageHandler.getSocialMediaLink);
app.post('/particularPageCouponWinners/:pageNumber', authUser.authUser, pageHandler.particularPageCouponWinners);
app.post('/particularPageCashWinners/:pageNumber', authUser.authUser, pageHandler.particularPageCashWinners);
app.put('/adAdmin/:id', authUser.authUser, pageHandler.adAdmin);

app.post('/pageViewClick', pageHandler.pageViewClick);
app.post('/pageStatisticsFilter', pageHandler.pageStatisticsFilter);
app.post('/giftStatistics', pageHandler.giftStatistics);
app.post('/adsStatistics', pageHandler.adsStatistics);
app.post('/CouponCashAdStatistics', pageHandler.CouponCashAdStatistics);

app.post('/pageFilter', authUser.authUser, pageHandler.pageFilter);

module.exports = app;

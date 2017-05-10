var express = require('express');
var app = express();
var pageHandler = require('../file_handler/page.js');
var authUser = require('../middlewares/authUser');



app.post('/createPage', pageHandler.createPage);
app.get('/showAllPages/:pageNumber', authUser.authUser, pageHandler.showAllPages);
app.get('/showAllOtherUserPages/:id/:pageNumber', authUser.authUser, pageHandler.showAllOtherUserPages);
app.post('/showPageDetails', authUser.authUser, pageHandler.showPageDetails);
app.get('/myPages/:id/:pageNumber', authUser.authUser, pageHandler.myPages);
app.get('/showPageFavouriteType/:id/:pageNumber', authUser.authUser, pageHandler.showPageFavouriteType);
app.put('/editPage/:id', authUser.authUser, pageHandler.editPage);
app.post('/deletePage', authUser.authUser, pageHandler.deletePage);
app.post('/allPagesSearch/:id/:pageNumber', authUser.authUser, pageHandler.allPagesSearch); //Not Update in Docs
app.post('/pageFollowUnfollow', pageHandler.pageFollowUnfollow); //Not Update in Docs
app.post('/searchForPages/:pageNumber', pageHandler.searchForPages); //Not Upadte in Docs
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
app.post('/pageStatisticsFilterClick', pageHandler.pageStatisticsFilterClick);
app.post('/giftStatistics', pageHandler.giftStatistics);
app.post('/giftStatisticsFilterClick', pageHandler.giftStatisticsFilterClick);
app.post('/pageFilter', authUser.authUser, pageHandler.pageFilter);
app.post('/userFavouratePages', pageHandler.userFavouratePages);
app.get('/listOfCategory', authUser.authUser, pageHandler.listOfCategory);
app.post('/subCategoryData', pageHandler.subCategoryData);
app.post('/winnerFilter/:pageNumber', pageHandler.winnerFilter);
app.post('/myPagesSearch/:id/:pageNumber', pageHandler.myPagesSearch);
app.post('/PageCashWinnersFilter/:id/:pageNumber', authUser.authUser, pageHandler.PageCashWinnersFilter);
app.post('/PageCouponWinnersFilter/:id/:pageNumber', authUser.authUser, pageHandler.PageCouponWinnersFilter);
app.get('/pageFollowersList/:id', authUser.authUser, pageHandler.pageFollowersList);
app.get('/CouponInboxWinners/:id', authUser.authUser, pageHandler.CouponInboxWinners);
app.post('/viewCouponCode', authUser.authUser, pageHandler.viewCouponCode);
app.post('/couponInboxDateFilter', authUser.authUser, pageHandler.couponInboxDateFilter);
app.post('/blockedPagesSearch/:pageNumber', pageHandler.blockedPagesSearch);
app.post('/searchFavouitePages/:id/:pageNumber', pageHandler.searchFavouitePages);
app.post('/reviewOnPage', authUser.authUser, pageHandler.reviewOnPage);
app.post('/replyOnReview', authUser.authUser, pageHandler.replyOnReview);
app.get('/reviewCommentList/:id/:pageNumber', authUser.authUser, pageHandler.reviewCommentList);
app.post('/winnerSearchFilter/:pageNumber', pageHandler.winnerSearchFilter);


module.exports = app;

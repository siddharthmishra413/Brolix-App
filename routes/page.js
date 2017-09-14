var express = require('express');
var app = express();
var pageHandler = require('../file_handler/page.js');
var authUser = require('../middlewares/authUser');

app.post('/createPagePayment', authUser.authUser, pageHandler.createPagePayment);
app.post('/returnPage', pageHandler.returnPage);
app.post('/deleteSocialMediaLink', authUser.authUser, pageHandler.deleteSocialMediaLink);
app.post('/editSocialMediaLink', authUser.authUser, pageHandler.editSocialMediaLink);
app.get('/redirectpage/:id/:status/:lang', authUser.authUser, pageHandler.redirectpage);
app.post('/createAdPayment', authUser.authUser, pageHandler.createAdPayment);
app.post('/returnAdsData', authUser.authUser, pageHandler.returnAdsData);
app.post('/paymentFilterApi', authUser.authUser, pageHandler.paymentFilterApi);
app.post('/deleteCommentsOnPage', authUser.authUser, pageHandler.deleteCommentsOnPage);
app.post('/editCommentsonPage', authUser.authUser, pageHandler.editCommentsonPage);
app.post('/createPage', authUser.authUser, pageHandler.createPage);
app.get('/showAllPages/:pageNumber/:lang', authUser.authUser, pageHandler.showAllPages);
app.get('/showAllOtherUserPages/:id/:pageNumber/:lang',  pageHandler.showAllOtherUserPages);
app.post('/showPageDetails',  pageHandler.showPageDetails);
app.get('/myPages/:id/:pageNumber/:lang', authUser.authUser, pageHandler.myPages);
app.get('/showPageFavouriteType/:id/:pageNumber/:lang', authUser.authUser, pageHandler.showPageFavouriteType);
app.put('/editPage/:id', authUser.authUser, pageHandler.editPage);
app.post('/deletePage', authUser.authUser, pageHandler.deletePage);
app.post('/allPagesSearch/:id/:pageNumber', authUser.authUser, pageHandler.allPagesSearch); //Not Update in Docs
app.post('/pageFollowUnfollow', authUser.authUser, pageHandler.pageFollowUnfollow); //Not Update in Docs
app.post('/searchForPages/:id/:pageNumber', authUser.authUser, pageHandler.searchForPages); //Not Upadte in Docs
app.post('/pageRating', authUser.authUser, pageHandler.pageRating);
app.get('/showBlockedPage/:pageNumber/:lang', authUser.authUser, pageHandler.showBlockedPage);
app.post('/removePage', authUser.authUser, pageHandler.removePage);
app.get('/showAllRemovedPage/:pageNumber/:lang', authUser.authUser, pageHandler.showAllRemovedPage);
app.post('/linkSocialMedia', authUser.authUser, pageHandler.linkSocialMedia);
app.post('/getSocialMediaLink', authUser.authUser, pageHandler.getSocialMediaLink);
app.post('/particularPageCouponWinners/:id/:pageNumber', authUser.authUser, pageHandler.particularPageCouponWinners);
app.post('/particularPageCashWinners/:id/:pageNumber', authUser.authUser, pageHandler.particularPageCashWinners);
app.put('/adAdmin/:id', authUser.authUser, pageHandler.adAdmin);
app.post('/pageViewClick', authUser.authUser, pageHandler.pageViewClick);
app.post('/pageStatisticsFilter', authUser.authUser, pageHandler.pageStatisticsFilter);
app.post('/pageStatisticsFilterClick', authUser.authUser, pageHandler.pageStatisticsFilterClick);
app.post('/giftStatistics',  pageHandler.giftStatistics);
app.post('/giftStatisticsFilterClick', authUser.authUser, pageHandler.giftStatisticsFilterClick);
app.post('/pageFilter', authUser.authUser, pageHandler.pageFilter);
app.post('/userFavouratePages', authUser.authUser, pageHandler.userFavouratePages);
app.get('/listOfCategory/:lang', authUser.authUser, pageHandler.listOfCategory);
app.post('/subCategoryData', authUser.authUser, pageHandler.subCategoryData);
app.post('/winnerFilter/:id/:pageNumber', authUser.authUser, pageHandler.winnerFilter);
app.post('/myPagesSearch/:id/:pageNumber', authUser.authUser, pageHandler.myPagesSearch);
app.post('/PageCashWinnersFilter/:id/:pageNumber', authUser.authUser, pageHandler.PageCashWinnersFilter);
app.post('/PageCouponWinnersFilter/:id/:pageNumber', authUser.authUser, pageHandler.PageCouponWinnersFilter);
app.get('/pageFollowersList/:id/:lang', authUser.authUser, pageHandler.pageFollowersList);
app.post('/CouponInboxWinners/:id', pageHandler.CouponInboxWinners);
app.post('/viewCouponCode', authUser.authUser, pageHandler.viewCouponCode);
app.post('/couponInboxDateFilter/:id', authUser.authUser, pageHandler.couponInboxDateFilter);
app.post('/blockedPagesSearch/:pageNumber', authUser.authUser, pageHandler.blockedPagesSearch);
app.post('/searchFavouitePages/:id/:pageNumber', authUser.authUser, pageHandler.searchFavouitePages);
app.post('/reviewOnPage', authUser.authUser, pageHandler.reviewOnPage);
app.post('/replyOnReview', authUser.authUser, pageHandler.replyOnReview);
app.get('/reviewCommentList/:id/:pageNumber/:lang',  pageHandler.reviewCommentList);
app.post('/winnerSearchFilter/:id/:pageNumber', authUser.authUser, pageHandler.winnerSearchFilter);
app.post('/sendCouponToAdvertiser', authUser.authUser, pageHandler.sendCouponToAdvertiser);


module.exports = app;
var express = require('express');
var app = express();
var adminHandler = require('../file_handler/admin.js');


app.post('/login', adminHandler.login);
app.get('/adminProfile', adminHandler.adminProfile);
app.post('/addNewUser', adminHandler.addNewUser);
app.get('/showAllUser', adminHandler.showAllUser);
app.get('/showAllPersonalUser', adminHandler.showAllPersonalUser);
app.get('/showAllBusinessUser', adminHandler.showAllBusinessUser);
app.get('/winners', adminHandler.winners);
app.post('/sendBrolix', adminHandler.sendBrolix);
app.get('/showAllBlockUser', adminHandler.showAllBlockUser);
app.post('/blockUser', adminHandler.blockUser);
app.get('/totalAds', adminHandler.totalAds);
app.post('/listOfAds', adminHandler.listOfAds);
app.get('/listOfAllAds', adminHandler.listOfAllAds);
app.get('/totalSoldUpgradeCard', adminHandler.totalSoldUpgradeCard);
app.get('/totalSoldLuckCard', adminHandler.totalSoldLuckCard);
app.get('/totalIncomeInBrolixFromLuckCard', adminHandler.totalIncomeInBrolixFromLuckCard);
app.get('/totalIncomeInCashFromUpgradeCard', adminHandler.totalIncomeInCashFromUpgradeCard);
app.get('/usedLuckCard', adminHandler.usedLuckCard);
app.get('/unUsedLuckCard', adminHandler.unUsedLuckCard);
app.get('/usedUpgradeCard', adminHandler.usedUpgradeCard);
app.get('/unUsedUpgradeCard', adminHandler.unUsedUpgradeCard);
app.get('/countrys', adminHandler.countrys);
app.get('/getAllStates/:name/:code', adminHandler.getAllStates);
app.get('/userProfile/:id', adminHandler.userProfile);
app.put('/editUserProfile/:id', adminHandler.editUserProfile);
app.get('/totalPages', adminHandler.totalPages);
app.get('/viewPage/:id', adminHandler.viewPage);
app.get('/couponWinners', adminHandler.couponWinners);
app.get('/cashWinners', adminHandler.cashWinners);
app.get('/totalActiveAds', adminHandler.totalActiveAds);
app.get('/totalExpiredAds', adminHandler.totalExpiredAds);
app.get('/videoAds', adminHandler.videoAds);
app.get('/slideshowAds', adminHandler.slideshowAds);
app.get('/totalPages/:pageNumber', adminHandler.totalPages);
app.post('/blockPage', adminHandler.blockPage);
app.get('/showAllBlockedPage/:pageNumber', adminHandler.showAllBlockedPage);
app.post('/removePage', adminHandler.removePage);
app.get('/showAllRemovedPage', adminHandler.showAllRemovedPage);





module.exports = app;

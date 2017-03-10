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
// app.post('/blockUser', adminHandler.blockUser);
app.get('/blockUser/:userId', adminHandler.blockUser);
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
app.get('/showAllBlockedPage', adminHandler.showAllBlockedPage);
app.get('/removePage/:id', adminHandler.removePage);
app.get('/showAllRemovedPage', adminHandler.showAllRemovedPage);
app.get('/sendcardAndcoupan/:id',adminHandler.sendcardAndcoupan);
app.get('/findAllCities',adminHandler.findAllCities);
app.get('/unPublishedPage',adminHandler.unPublishedPage);
app.post('/createCards',adminHandler.createCards);
app.get('/viewCards/:type',adminHandler.viewCards);
app.post('/editCards',adminHandler.editCards);
app.get('/showCardDetails/:id',adminHandler.showCardDetails);
app.get('/removeCard/:id', adminHandler.removeCard);
app.post('/createOfferOnCard', adminHandler.createOfferOnCard);
app.post('/showOfferOnCards',adminHandler.showOfferOnCards);
app.get('/showUserPage/:id',adminHandler.showUserPage);
app.get('/adsOnPage/:id',adminHandler.adsOnPage);
app.get('/winnersOnPage/:id',adminHandler.winnersOnPage);
app.get('/pageAdminsDetail/:id',adminHandler.pageAdminsDetail);
app.get('/showReportOnAd/:id',adminHandler.showReportOnAd);
app.get('/ownerDetails/:id',adminHandler.ownerDetails);
app.get('/PagesAdmins',adminHandler.PagesAdmins);




module.exports = app;

var express = require('express');
var app = express();
var adminHandler = require('../file_handler/admin.js');



app.post('/login', adminHandler.login);


app.get('/adminProfile', adminHandler.adminProfile);
app.post('/addNewUser', adminHandler.addNewUser);


app.post('/sendBrolix', adminHandler.sendBrolix);

app.get('/blockUser/:userId', adminHandler.blockUser);

app.get('/countrys', adminHandler.countrys);
app.get('/getAllStates/:name/:code', adminHandler.getAllStates);
app.get('/userProfile/:id', adminHandler.userProfile);
app.put('/editUserProfile/:id', adminHandler.editUserProfile);
app.get('/totalPages', adminHandler.totalPages);
app.get('/viewPage/:id', adminHandler.viewPage);


/*----------------------Manage Users------------------------*/

app.get('/showAllUser', adminHandler.showAllUser);
app.get('/showAllPersonalUser', adminHandler.showAllPersonalUser);
app.get('/showAllBusinessUser', adminHandler.showAllBusinessUser);
app.get('/winners', adminHandler.winners);
app.get('/couponWinners', adminHandler.couponWinners);
app.get('/cashWinners', adminHandler.cashWinners);
app.get('/showAllBlockUser', adminHandler.showAllBlockUser);

/*---------------------------------------------------------------*/

/*--------------------------Manage Cards--------------------------*/

app.get('/totalSoldUpgradeCard', adminHandler.totalSoldUpgradeCard);
app.get('/totalSoldLuckCard', adminHandler.totalSoldLuckCard);
app.get('/totalIncomeInBrolixFromLuckCard', adminHandler.totalIncomeInBrolixFromLuckCard);
app.get('/totalIncomeInCashFromUpgradeCard', adminHandler.totalIncomeInCashFromUpgradeCard);
app.get('/usedLuckCard', adminHandler.usedLuckCard);
app.get('/unUsedLuckCard', adminHandler.unUsedLuckCard);
app.get('/usedUpgradeCard', adminHandler.usedUpgradeCard);
app.get('/unUsedUpgradeCard', adminHandler.unUsedUpgradeCard);

/*---------------------------------------------------------------*/


/*-------------------------Manage ADS---------------------*/

app.get('/totalAds', adminHandler.totalAds);
app.get('/totalActiveAds', adminHandler.totalActiveAds);
app.get('/totalExpiredAds', adminHandler.totalExpiredAds);
app.get('/videoAds', adminHandler.videoAds);
app.get('/slideshowAds', adminHandler.slideshowAds);
app.post('/listOfAds', adminHandler.listOfAds);
app.get('/listOfAllAds', adminHandler.listOfAllAds);

/*----------------------------------------------------*/


app.get('/allCountriesfind', adminHandler.allCountriesfind);
app.post('/allstatefind', adminHandler.allstatefind);


app.post('/sendCashBrolix', adminHandler.sendCashBrolix);

app.post('/messageBroadcast', adminHandler.messageBroadcast);

app.post('/uploadImage', adminHandler.uploadImage); 

module.exports = app;

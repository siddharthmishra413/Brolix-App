var express = require('express');
var app = express();
var adminHandler = require('../file_handler/admin.js');


app.post('/login', adminHandler.login);
app.get('/adminProfile', adminHandler.adminProfile);
app.get('/showAllUser',  adminHandler.showAllUser);
app.get('/winners',  adminHandler.winners);
app.post('/sendBrolix',  adminHandler.sendBrolix);
app.get('/showAllBlockUser',  adminHandler.showAllBlockUser);
app.post('/blockUser',  adminHandler.blockUser);
app.get('/showAllAds',  adminHandler.showAllAds);
app.post('/listOfAds',  adminHandler.listOfAds);
app.get('/listOfAllAds',  adminHandler.listOfAllAds);
app.get('/totalUpgradeCardFromStore', adminHandler.totalUpgradeCardFromStore);
app.get('/totalLuckCardFromStore', adminHandler.totalLuckCardFromStore);
app.get('/totalIncomeInBrolixFromLuckCard', adminHandler.totalIncomeInBrolixFromLuckCard);
app.get('/totalIncomeInBrolixFromupgradeCard', adminHandler.totalIncomeInBrolixFromupgradeCard);

module.exports = app;

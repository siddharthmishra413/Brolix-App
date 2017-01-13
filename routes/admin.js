var express = require('express');
var app = express();
var adminHandler = require('../file_handler/admin.js');


app.post('/login', adminHandler.login);
app.get('/adminProfile', adminHandler.adminProfile);
app.post('/addNewUser',  adminHandler.addNewUser);
app.get('/showAllUser',  adminHandler.showAllUser);
app.get('/winners',  adminHandler.winners);
app.post('/sendBrolix',  adminHandler.sendBrolix);
app.get('/showAllBlockUser',  adminHandler.showAllBlockUser);
app.post('/blockUser',  adminHandler.blockUser);
app.get('/totalAds',  adminHandler.totalAds);
app.post('/listOfAds',  adminHandler.listOfAds);
app.get('/listOfAllAds',  adminHandler.listOfAllAds);
app.get('/totalSoldUpgradeCard', adminHandler.totalSoldUpgradeCard);
app.get('/totalSoldLuckCard', adminHandler.totalSoldLuckCard);
app.get('/totalIncomeInBrolixFromLuckCard', adminHandler.totalIncomeInBrolixFromLuckCard);
app.get('/totalIncomeInBrolixFromUpgradeCard', adminHandler.totalIncomeInBrolixFromUpgradeCard);
app.get('/countrys', adminHandler.countrys);
app.get('/getAllStates/:name/:code', adminHandler.getAllStates);
app.get('/userProfile/:id', adminHandler.userProfile);

module.exports = app;

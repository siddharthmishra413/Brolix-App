var express = require('express');
var app = express();
var adminHandler = require('../file_handler/admin.js');
var authUser = require('../middlewares/authUser');



app.post('/login', adminHandler.login);
app.get('/adminProfile', adminHandler.adminProfile);
app.get('/showAllUsershowAllUser', authUser.authUser, adminHandler.showAllUser);
app.get('/winners', authUser.authUser, adminHandler.winners);
app.post('/sendBrolix', authUser.authUser, adminHandler.sendBrolix);
app.get('/showAllBlockUser', authUser.authUser, adminHandler.showAllBlockUser);
app.post('/blockUser', authUser.authUser, adminHandler.blockUser);
app.get('/showAllAds', authUser.authUser, adminHandler.showAllAds);
app.post('/listOfAds', authUser.authUser, adminHandler.listOfAds);
app.get('/listOfAllAds', authUser.authUser, adminHandler.listOfAllAds);

module.exports = app;
